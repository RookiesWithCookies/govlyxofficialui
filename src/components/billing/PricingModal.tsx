import { useState } from "react";
import { X, Check, Crown, Zap, Sparkles, Loader2 } from "lucide-react";
import { useCurrentUser } from "../../hooks/useUser";
import { useMyBilling } from "../../hooks/useBilling";
import { billingApi } from "../../api/billing";
import { loadRazorpayScript } from "../../utils/razorpay";
import { showToast } from "../../utils/toast";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const { data: user } = useCurrentUser();
  const { data: billing } = useMyBilling();
  const queryClient = useQueryClient();
  const [loadingTier, setLoadingTier] = useState<"GOVLYX_PRO" | "GOVLYX_VIP" | null>(null);

  if (!isOpen) return null;

  const currentTier = billing?.currentTier || "GOVLYX_FREE";

  const handleUpgrade = async (tier: "GOVLYX_PRO" | "GOVLYX_VIP") => {
    setLoadingTier(tier);
    try {
      // 1. Fetch Razorpay config key
      const config = await billingApi.getConfig();
      if (!config.keyId) {
        throw new Error("Razorpay configuration not available");
      }

      // 2. Load Razorpay checkout script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load Razorpay SDK. Please check your internet connection.");
      }

      // 3. Create backend order
      const orderData = await billingApi.createOrder(tier);

      // 4. Configure Razorpay checkout options
      const options = {
        key: config.keyId,
        amount: tier === "GOVLYX_VIP" ? 14900 : 4900, // paise (₹149 / ₹49)
        currency: "INR",
        name: "Govlyx",
        description: tier === "GOVLYX_VIP" ? "Govlyx VIP Monthly Pass" : "Govlyx Pro Monthly Pass",
        order_id: orderData.orderId,
        handler: async (response: any) => {
          const toastId = toast.loading("Verifying payment...");
          try {
            await billingApi.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.dismiss(toastId);
            showToast.success("Pass activated successfully!");
            // Invalidate queries so settings and chat update immediately
            queryClient.invalidateQueries({ queryKey: ["myBilling"] });
            queryClient.invalidateQueries({ queryKey: ["currentUser"] });
            onClose();
          } catch (err: any) {
            toast.dismiss(toastId);
            showToast.error(err.response?.data?.message || "Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: user?.actualUsername || user?.username || "",
          email: user?.email || "",
        },
        theme: {
          color: tier === "GOVLYX_VIP" ? "#F59E0B" : "#1D4ED8",
        },
        modal: {
          ondismiss: () => {
            showToast.error("Payment cancelled");
          },
        },
      };

      // 5. Open Razorpay checkout modal
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      showToast.error(err.message || "An error occurred during payment setup.");
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-base-200 border border-base-300 p-6 sm:p-8 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-base-content/60 hover:text-base-content hover:bg-base-300 rounded-full transition-colors focus:outline-none"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary mb-3">
            <Sparkles size={12} className="animate-pulse" /> Govlyx Monetization Pass
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-base-content tracking-tight">
            Unlock the Full Power of Govlyx
          </h2>
          <p className="text-sm opacity-70 mt-1 max-w-md mx-auto">
            Choose a pass tier to power up your matchmaking, chat experience, and community features.
          </p>
        </div>

        {/* Plan Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          
          {/* FREE TIER CARD */}
          <div className="flex flex-col justify-between p-6 rounded-2xl bg-base-100 border border-base-300 transition-all hover:shadow-md relative">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black uppercase tracking-wider text-base-content/40">Free Pass</span>
                {currentTier === "GOVLYX_FREE" && (
                  <span className="badge badge-sm badge-outline opacity-60">Active Plan</span>
                )}
              </div>
              <div className="mb-4">
                <span className="text-3xl font-black text-base-content">₹0</span>
                <span className="text-xs opacity-60">/month</span>
              </div>
              <p className="text-xs opacity-70 mb-6">Standard portal access with basic matchmaking limits.</p>
              
              <div className="divider my-0 opacity-40" />
              
              <ul className="space-y-3 mt-6 text-xs text-base-content/80">
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-green-500 shrink-0 mt-0.5" />
                  <span>3 matches per 24 hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-green-500 shrink-0 mt-0.5" />
                  <span>Text-only stranger chat</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-green-500 shrink-0 mt-0.5" />
                  <span>Auto-Translate feed posts</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-green-500 shrink-0 mt-0.5" />
                  <span>Standard poll creation</span>
                </li>
              </ul>
            </div>
            <div className="mt-8">
              <button
                disabled
                className="btn btn-sm btn-outline w-full rounded-xl cursor-default opacity-50"
              >
                {currentTier === "GOVLYX_FREE" ? "Current Plan" : "Free Plan"}
              </button>
            </div>
          </div>

          {/* PRO TIER CARD */}
          <div className={`flex flex-col justify-between p-6 rounded-2xl bg-base-100 border ${currentTier === "GOVLYX_PRO" ? "border-blue-500 shadow-md" : "border-base-300"} transition-all hover:shadow-lg relative`}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider text-blue-700 dark:text-blue-400">
                  <Zap size={12} /> Pro Pass
                </span>
                {currentTier === "GOVLYX_PRO" && (
                  <span className="badge badge-sm badge-primary">Active Plan</span>
                )}
              </div>
              <div className="mb-4">
                <span className="text-3xl font-black text-base-content">₹49</span>
                <span className="text-xs opacity-60">/month</span>
              </div>
              <p className="text-xs opacity-70 mb-6">Enhance your communication and create private groups.</p>
              
              <div className="divider my-0 opacity-40" />
              
              <ul className="space-y-3 mt-6 text-xs text-base-content/80">
                <li className="flex items-start gap-2 font-semibold">
                  <Check size={14} className="text-blue-500 shrink-0 mt-0.5" />
                  <span>Unlimited 1-vs-1 matchmaking</span>
                </li>
                <li className="flex items-start gap-2 font-semibold">
                  <Check size={14} className="text-blue-500 shrink-0 mt-0.5" />
                  <span>Rich Media in Chat (Images/Videos)</span>
                </li>
                <li className="flex items-start gap-2 font-semibold">
                  <Check size={14} className="text-blue-500 shrink-0 mt-0.5" />
                  <span>Create 3 Private Communities</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-blue-500 shrink-0 mt-0.5" />
                  <span>Advanced chat matchmaking filters</span>
                </li>
              </ul>
            </div>
            <div className="mt-8">
              <button
                onClick={() => handleUpgrade("GOVLYX_PRO")}
                disabled={currentTier === "GOVLYX_PRO" || currentTier === "GOVLYX_VIP" || loadingTier !== null}
                className="btn btn-sm btn-primary w-full text-white rounded-xl shadow-md disabled:bg-base-300 disabled:text-base-content/40 border-none bg-blue-700 hover:bg-blue-800"
              >
                {loadingTier === "GOVLYX_PRO" ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : currentTier === "GOVLYX_PRO" ? (
                  "Active"
                ) : currentTier === "GOVLYX_VIP" ? (
                  "Downgrade Gated"
                ) : (
                  "Upgrade to Pro"
                )}
              </button>
            </div>
          </div>

          {/* VIP TIER CARD */}
          <div className={`flex flex-col justify-between p-6 rounded-2xl bg-base-100 border-2 ${currentTier === "GOVLYX_VIP" ? "border-amber-500 shadow-md" : "border-amber-500/40"} transition-all hover:shadow-lg relative overflow-hidden`}>
            
            {/* VIP Glow badge */}
            <div className="absolute top-0 right-0 bg-amber-500 text-amber-950 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl shadow-sm">
              Popular
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider text-amber-500">
                  <Crown size={12} /> VIP Pass
                </span>
                {currentTier === "GOVLYX_VIP" && (
                  <span className="badge badge-sm badge-warning font-semibold">Active Plan</span>
                )}
              </div>
              <div className="mb-4">
                <span className="text-3xl font-black text-base-content">₹149</span>
                <span className="text-xs opacity-60">/month</span>
              </div>
              <p className="text-xs opacity-70 mb-6">Complete VIP experience, disappearing messages, priority matching.</p>
              
              <div className="divider my-0 opacity-40" />
              
              <ul className="space-y-3 mt-6 text-xs text-base-content/80">
                <li className="flex items-start gap-2 font-bold text-amber-600 dark:text-amber-400">
                  <Check size={14} className="text-amber-500 shrink-0 mt-0.5" />
                  <span>VIP Priority Queue Matchmaking</span>
                </li>
                <li className="flex items-start gap-2 font-bold text-amber-600 dark:text-amber-400">
                  <Check size={14} className="text-amber-500 shrink-0 mt-0.5" />
                  <span>Disappearing messages (settings)</span>
                </li>
                <li className="flex items-start gap-2 font-bold text-amber-600 dark:text-amber-400">
                  <Check size={14} className="text-amber-500 shrink-0 mt-0.5" />
                  <span>Toggle message pinning in chat</span>
                </li>
                <li className="flex items-start gap-2 font-semibold">
                  <Check size={14} className="text-amber-500 shrink-0 mt-0.5" />
                  <span>Create 5 Private Communities</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-amber-500 shrink-0 mt-0.5" />
                  <span>Includes all PRO benefits</span>
                </li>
              </ul>
            </div>
            <div className="mt-8">
              <button
                onClick={() => handleUpgrade("GOVLYX_VIP")}
                disabled={currentTier === "GOVLYX_VIP" || loadingTier !== null}
                className="btn btn-sm w-full text-amber-950 font-bold bg-amber-500 hover:bg-amber-600 border-none rounded-xl shadow-md disabled:bg-base-300 disabled:text-base-content/40"
              >
                {loadingTier === "GOVLYX_VIP" ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : currentTier === "GOVLYX_VIP" ? (
                  "Active"
                ) : (
                  "Upgrade to VIP"
                )}
              </button>
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="text-center mt-8 text-[11px] opacity-50 space-y-1">
          <p>Payments are securely processed via Razorpay. Subscriptions are billed monthly.</p>
          <p>By upgrading, you agree to our Terms of Service and Refund Policy.</p>
        </div>
      </div>
    </div>
  );
}
