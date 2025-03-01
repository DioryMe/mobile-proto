import { isAuthenticated } from "../App";

const baseUrl = import.meta.env.VITE_API_URL;

class UnauthorizedAccessError extends Error {
  constructor() {
    super("Unauthorized access");
    this.name = "UnauthorizedAccessError";
  }
}

class NoTokensFoundError extends Error {
  constructor() {
    super("No tokens found in session storage");
    this.name = "NoTokensFoundError";
  }
}

export const fetchContent = async <T>(
  url: string,
  signal?: AbortSignal
): Promise<T> => {
  const accessToken = sessionStorage.getItem("accessToken");
  const idToken = sessionStorage.getItem("idToken");

  if (!isAuthenticated() || !accessToken || !idToken) {
    throw new NoTokensFoundError();
  }

  const response = await fetch(`${baseUrl}${url}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "X-Id-Token": idToken,
    },
    signal,
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new UnauthorizedAccessError();
    }
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response as T;
};

export const fetchData = async <T>(
  url: string,
  signal?: AbortSignal
): Promise<T> => {
  const response = await fetchContent<any>(url, signal);
  return response.json();
};
