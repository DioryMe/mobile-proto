import { useState, useEffect } from "react";

export const fetchContent = async <T>(url: string): Promise<T> => {
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
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response as T;
};

export const fetchData = async <T>(url: string): Promise<T> => {
  const response = await fetchContent<any>(url);
  return response.json();
};

const baseUrl = import.meta.env.VITE_API_URL;

const useFetchData = <T>(url: string) => {
  const [result, setResult] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchData<T>(url)
      .then((result) => {
        setResult(result);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [url]);

  return { result, loading, error };
};

export default useFetchData;
