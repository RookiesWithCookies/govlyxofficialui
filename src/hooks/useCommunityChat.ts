import { useState, useEffect, useRef, useCallback } from "react";
import { communityChatSocket } from "../api/communityChatSocket.service";
import { communityService } from "../api/communityService";
import type { CommunityMessage, TypingIndicator } from "../types/CommunityChat.types";

interface UserProfile {
  id: number;
  username: string;
  actualUsername?: string;
  profileImage: string | null;
}

export function useCommunityChat(communityId: number, currentUser: UserProfile | null) {
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<{ [userId: number]: { username: string; timestamp: number } }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const lastTypingSentRef = useRef<number>(0);
  const pendingMessagesRef = useRef<Set<string>>(new Set());

  // ── 1. Fetch Initial Messages ──
  const fetchInitialMessages = useCallback(async () => {
    if (!communityId) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await communityService.getChatMessages(communityId, null, 25);
      // Expected structure: ApiResponse<CommunityMessage[]> or direct list or paginated payload
      const paged = response?.data ?? response;
      const list: CommunityMessage[] = Array.isArray(paged)
        ? paged
        : (Array.isArray(paged?.data)
          ? paged.data
          : (Array.isArray(paged?.content)
            ? paged.content
            : []));
      
      const hasMoreFlag = typeof paged?.hasMore === "boolean"
        ? paged.hasMore
        : (typeof response?.hasMore === "boolean"
          ? response.hasMore
          : list.length >= 25);

      // If descending (newest first), reverse it so older is at the top, newer is at bottom
      const sorted = [...list].reverse();
      setMessages(sorted);
      setHasMore(hasMoreFlag);
    } catch (err: any) {
      console.error("Failed to load initial chat history:", err);
      setError("Failed to load chat history.");
    } finally {
      setIsLoading(false);
    }
  }, [communityId]);

  // ── 2. Fetch Older Messages (Pagination) ──
  const loadMoreMessages = useCallback(async () => {
    if (isFetchingMore || !hasMore || !messages.length || !communityId) return;
    setIsFetchingMore(true);
    try {
      // The cursor is the oldest message ID we have (first item in messages array)
      const cursorId = messages[0].id ? String(messages[0].id) : null;
      const response = await communityService.getChatMessages(communityId, cursorId, 25);
      const paged = response?.data ?? response;
      const list: CommunityMessage[] = Array.isArray(paged)
        ? paged
        : (Array.isArray(paged?.data)
          ? paged.data
          : (Array.isArray(paged?.content)
            ? paged.content
            : []));

      const hasMoreFlag = typeof paged?.hasMore === "boolean"
        ? paged.hasMore
        : (typeof response?.hasMore === "boolean"
          ? response.hasMore
          : list.length >= 25);

      if (list.length === 0) {
        hasMore && setHasMore(false);
      } else {
        const sorted = [...list].reverse();
        setMessages((prev) => [...sorted, ...prev]);
        setHasMore(hasMoreFlag);
      }
    } catch (err) {
      console.error("Failed to load older messages:", err);
    } finally {
      setIsFetchingMore(false);
    }
  }, [communityId, messages, isFetchingMore, hasMore]);

  // ── 3. WebSocket Handlers ──
  const handleIncomingMessage = useCallback((msg: CommunityMessage) => {
    setMessages((prev) => {
      // 1. Check if this resolves an optimistic/pending message
      // Since backend doesn't return clientSideId, we match by sender and content:
      const pendingIndex = prev.findIndex(
        (m) => !m.id && m.sender.id === msg.sender.id && m.content === msg.content
      );

      if (pendingIndex !== -1) {
        const updated = [...prev];
        updated[pendingIndex] = msg;
        return updated;
      }

      // 2. Prevent duplication of messages that are already in list
      if (prev.some((m) => m.id === msg.id)) {
        return prev;
      }

      // 3. Otherwise append new message to the bottom
      return [...prev, msg];
    });
  }, []);

  const handleIncomingTyping = useCallback((n: TypingIndicator) => {
    if (currentUser && n.userId === currentUser.id) return; // ignore our own typing echoes
    setTypingUsers((prev) => ({
      ...prev,
      [n.userId]: {
        username: n.username,
        timestamp: Date.now(),
      },
    }));
  }, [currentUser]);

  // ── 4. Setup Socket Connection ──
  useEffect(() => {
    if (!communityId) return;

    // Trigger initial REST fetch
    fetchInitialMessages();

    // Connect & subscribe
    communityChatSocket.connect({
      onMessage: handleIncomingMessage,
      onTyping: handleIncomingTyping,
      onError: (errMsg) => {
        console.error("[CommunityChatHook] Socket error:", errMsg);
        setError(errMsg);
      },
    });

    communityChatSocket.joinCommunity(communityId);

    return () => {
      // On unmount/switch, we tell socket service to clear subscriptions for this community
      // and disconnect if this was the last consumer.
      communityChatSocket.disconnect();
    };
  }, [communityId, fetchInitialMessages, handleIncomingMessage, handleIncomingTyping]);

  // ── 5. Auto-clearing Typing Indicators (3-second timeout) ──
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setTypingUsers((prev) => {
        const updated = { ...prev };
        let changed = false;
        for (const [userIdStr, data] of Object.entries(updated)) {
          if (now - data.timestamp > 3000) {
            delete updated[Number(userIdStr)];
            changed = true;
          }
        }
        return changed ? updated : prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ── 6. Local Expiry / Pruning of Disappearing Messages ──
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setMessages((prev) => {
        const filtered = prev.filter((m) => {
          if (!m.expiresAt) return true;
          return new Date(m.expiresAt).getTime() > now;
        });
        return filtered.length === prev.length ? prev : filtered;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ── 7. Send Actions ──
  const sendMessage = useCallback((content?: string, replyToId?: number, sharedPostId?: number) => {
    if (!communityId || !currentUser) return;

    // Generate correlation ID
    const clientSideId = `opt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    pendingMessagesRef.current.add(clientSideId);

    // Optimistic message DTO
    const optimisticMessage: CommunityMessage = {
      messageId: clientSideId,
      content,
      sender: {
        id: currentUser.id,
        username: currentUser.username,
        actualUsername: currentUser.actualUsername,
        profileImage: currentUser.profileImage,
      },
      messageType: sharedPostId ? "SHARE_POST" : "TEXT",
      replyToId,
      createdAt: new Date().toISOString(),
      clientSideId,
    };

    // Append optimistically
    setMessages((prev) => [...prev, optimisticMessage]);

    // Send payload
    communityChatSocket.sendMessage(communityId, {
      content,
      replyToId: replyToId ? String(replyToId) : undefined,
      sharedPostId,
      clientSideId,
    });
  }, [communityId, currentUser]);

  const sendTyping = useCallback(() => {
    if (!communityId) return;
    const now = Date.now();
    // Throttle outgoing typing signals to once per 2 seconds
    if (now - lastTypingSentRef.current > 2000) {
      lastTypingSentRef.current = now;
      communityChatSocket.sendTyping(communityId, true);
    }
  }, [communityId]);

  return {
    messages,
    typingUsers: Object.values(typingUsers),
    isLoading,
    isFetchingMore,
    hasMore,
    error,
    setError,
    sendMessage,
    sendTyping,
    loadMoreMessages,
    fetchInitialMessages,
  };
}
