import { useState, useEffect } from "react";
import { fetchData } from "./fetchData";

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
          setError(err.message || err);
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
