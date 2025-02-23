import { useState, useEffect } from "react";

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

const baseUrl = ""; // import.meta.env.VITE_API_URL;

const useFetchData = <T>(url: string) => {
  const [result, setResult] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  const cancelFetch = () => {
    if (abortController) {
      abortController.abort();
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    setAbortController(controller);

    setResult(null);
    setLoading(true);
    setError(null);

    fetchData<T>(url, controller.signal)
      .then((result) => {
        setResult(result);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          console.log("Fetch aborted", url);
        } else {
          setError(err.message);
        }
        setLoading(false);
      });

    return () => {
      cancelFetch();
    };
  }, [url]);

  return { result, loading, error, cancelFetch };
};

export default useFetchData;
