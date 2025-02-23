const baseUrl = import.meta.env.VITE_API_URL;

export const fetchContent = async <T>(
  url: string,
  signal?: AbortSignal
): Promise<T> => {
  const accessToken = sessionStorage.getItem("accessToken");
  const idToken = sessionStorage.getItem("idToken");

  if (!accessToken || !idToken) {
    throw new Error("No tokens found");
  }

  const response = await fetch(`${baseUrl}${url}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "X-Id-Token": idToken,
    },
    signal,
  });

  if (!response.ok) {
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
