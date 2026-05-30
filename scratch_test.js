import axios from "axios";

const BASE_URL = "https://jan-sahayak-ai-84vh.onrender.com";

async function run() {
  try {
    const email = "example@gmail.com";
    const password = "password123";

    // 1. Login
    console.log(`1. Attempting login as ${email}...`);
    let token = null;
    try {
      const loginRes = await axios.post(`${BASE_URL}/api/auth/login`, {
        email,
        password
      });
      console.log("Login success.");
      const authData = loginRes.data?.data ?? loginRes.data;
      token = authData.token || authData.authToken || authData.accessToken || authData.jwt;
      console.log("Token obtained:", token ? "YES" : "NO");
    } catch (err) {
      console.log("Login failed:", err.response?.data || err.message);
      return;
    }

    if (!token) {
      console.log("Could not obtain auth token. Cannot proceed.");
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`
    };

    // 2. Fetch feed to find a valid postId
    console.log("2. Fetching feed for posts...");
    let postId = 1; // Fallback
    try {
      const feedRes = await axios.get(`${BASE_URL}/api/v1/feed/for-you?limit=5`, { headers });
      const posts = feedRes.data?.data?.content ?? feedRes.data?.data ?? feedRes.data ?? [];
      console.log(`Fetched ${posts.length} posts from feed.`);
      if (posts.length > 0) {
        postId = posts[0].id;
        console.log(`Using post ID from feed: ${postId} (variant: ${posts[0].variant})`);
      }
    } catch (err) {
      console.log("Feed fetch failed:", err.response?.data || err.message);
    }

    // 3. Test comments endpoints with authentication
    const testPaths = [
      `/api/comments/posts/${postId}/top-level`,
      `/api/comments/post/${postId}/top-level`,
      `/api/comments/social-posts/${postId}/top-level`,
      `/api/comments/social-post/${postId}/top-level`
    ];

    console.log("\n3. Testing comment endpoints with token:");
    for (const path of testPaths) {
      try {
        const res = await axios.get(`${BASE_URL}${path}`, { headers });
        console.log(`[OK] ${path} -> Status: ${res.status}, data is array: ${Array.isArray(res.data?.data ?? res.data)}`);
      } catch (err) {
        console.log(`[ERR] ${path} -> Status: ${err.response ? err.response.status : err.message}, message: ${JSON.stringify(err.response?.data)}`);
      }
    }

  } catch (err) {
    console.error("Main execution error:", err.message);
  }
}

run();
