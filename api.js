const BASE_URL = "http://127.0.0.1:8000";

async function handle(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `Request failed (${res.status})`);
  }
  return res.json();
}

export const api = {
  chat: (message, sessionId) =>
    fetch(`${BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, session_id: sessionId }),
    }).then(handle),

  listSchemes: (q, state) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (state) params.set("state", state);
    const qs = params.toString();
    return fetch(`${BASE_URL}/api/schemes${qs ? `?${qs}` : ""}`).then(handle);
  },

  checkEligibility: (profile, schemeId) =>
    fetch(`${BASE_URL}/api/eligibility`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile, scheme_id: schemeId || null }),
    }).then(handle),

  fileGrievance: (category, summary, priority) =>
    fetch(`${BASE_URL}/api/grievance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, summary, priority }),
    }).then(handle),

  trackGrievance: (ticketId) =>
    fetch(`${BASE_URL}/api/grievance/${encodeURIComponent(ticketId)}`).then(handle),

  analyzeDocument: async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    console.log("Uploading document:", file.name);
    console.log("File size:", file.size);
    console.log("API URL:", `${BASE_URL}/api/analyze-document`);

    const response = await fetch(`${BASE_URL}/api/analyze-document`, {
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
