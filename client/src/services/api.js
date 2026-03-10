import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
});

export async function sendChatMessage({ sessionId, question }) {
  const response = await apiClient.post("/chat", {
    session_id: sessionId,
    question,
  });
  return response.data;
}

export async function fetchHistory(sessionId) {
  const response = await apiClient.get(`/history/${sessionId}`);
  return response.data;
}

export async function fetchDocuments() {
  const response = await apiClient.get("/docs-list");
  return response.data;
}

