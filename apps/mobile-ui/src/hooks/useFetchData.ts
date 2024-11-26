import { useState, useEffect } from "react";

export const fetchData = async <T>(url: string): Promise<T> => {
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

const baseUrl = import.meta.env.VITE_API_URL;

const useFetchData = <T>(url: string) => {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    fetchData<T>(url).then(setData);
  }, [url]);

  return data;
};

export default useFetchData;
