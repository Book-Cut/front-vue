const API_URL = (
  import.meta.env.VITE_API_URL ??
  "https://book-cut-backend-9r62.onrender.com/api"
).replace(/\/+$/, "");

interface ApiRequestConfig {
  authenticated?: boolean;
}

function parseApiResponse<T>(
  response: Response,
): Promise<(T & { message?: string }) | { message: string }> {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return response.json() as Promise<T & { message?: string }>;
  }

  return response.text().then((text) => ({
    message: text || `Error de API (${response.status})`,
  })) as Promise<T & { message?: string }>;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  config: ApiRequestConfig = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  const token = localStorage.getItem("token");

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  if (config.authenticated !== false && token) {
    headers.set("Authorization", ["Bearer", token].join(" "));
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });
  const data = await parseApiResponse<T>(response);

  if (!response.ok) {
    const err = data as { message?: string; errors?: Record<string, string[]> };
    const primerError = err.errors
      ? Object.values(err.errors).flat()[0]
      : undefined;
    throw new Error(
      primerError ?? err.message ?? `Error de API (${response.status})`,
    );
  }

  return data as T;
}
