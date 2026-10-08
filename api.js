const BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") ||
  (import.meta.env.DEV
    ? "http://127.0.0.1:8000"
    : "https://ai-government-assistant.onrender.com");

function apiUrl(path) {
  if (!BASE_URL) {
    throw new Error(
      "Backend API is not configured. Set VITE_API_BASE_URL to the deployed API URL."
    );
  }
  return `${BASE_URL}${path}`;
}

async function handle(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `Request failed (${res.status})`);
  }
  return res.json();
}

export const api = {
  googleLogin: (credential) =>
    fetch(apiUrl("/api/auth/google"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential }),
    }).then(handle),

  chat: (message, sessionId) =>
    fetch(apiUrl("/api/chat"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, session_id: sessionId }),
    }).then(handle),

  listSchemes: (q, state) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (state) params.set("state", state);
    const qs = params.toString();
    return fetch(apiUrl(`/api/schemes${qs ? `?${qs}` : ""}`)).then(handle);
  },

  checkEligibility: (profile, schemeId) =>
    fetch(apiUrl("/api/eligibility"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile, scheme_id: schemeId || null }),
    }).then(handle),

  fileGrievance: (category, summary, priority) =>
    fetch(apiUrl("/api/grievance"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, summary, priority }),
    }).then(handle),

  trackGrievance: (ticketId) =>
    fetch(apiUrl(`/api/grievance/${encodeURIComponent(ticketId)}`)).then(handle),

  analyzeDocument: async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    console.log("Uploading document:", file.name);
    console.log("File size:", file.size);
    const url = apiUrl("/api/analyze-document");
    console.log("API URL:", url);

    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      const text = await response.text();
      console.error("Backend error:", text);
      throw new Error(`Upload failed (${response.status})`);
    }

    const data = await response.json();
    console.log("Document response:", data);
    return data;
  },
};
