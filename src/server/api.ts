import { BASE_URL } from "../constant/BASE_URL";

interface FetchOptions extends RequestInit {
  requiresAuth?: boolean;
}

export async function apiFetch(endpoint: string, options: FetchOptions = {}) {
  const { headers, ...restOptions } = options;

  // Set up default headers
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...headers,
  };


  try {
    const response = await fetch(`${BASE_URL}/api/v1/${endpoint}`, {
      headers: defaultHeaders,
      credentials: "include", 
      ...restOptions,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
