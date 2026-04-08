const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function apiRequest(
  path,
  { method = "GET", body, token, headers = {}, signal } = {}
) {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    const error = new Error(data?.message || "Request failed.");
    error.status = response.status;
    throw error;
  }

  return data;
}

export { API_URL };
