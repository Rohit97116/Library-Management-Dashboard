const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

export async function apiRequest(
  path,
  { method = "GET", body, token, headers = {}, signal } = {}
) {
  if (!API_URL) {
    throw new Error(
      "Missing VITE_API_URL. Add it to frontend/.env for local development or set it in Vercel."
    );
  }

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
