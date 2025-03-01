import { useState, useEffect } from "react";
import { fetchData } from "./fetchData";
import { useNavigate } from "react-router-dom";

const useFetchData = <T>(url: string) => {
  const [result, setResult] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);
  const navigate = useNavigate();

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
        } else if (err.name === "NoTokensFoundError") {
          console.error("No tokens found in session storage");
          navigate("/login");
        } else if (err.status === 401) {
          // Assuming fetchData throws error with status
          console.error("Unauthorized access, redirecting to login.");
          sessionStorage.removeItem("accessToken");
          sessionStorage.removeItem("refreshToken");
          navigate("/login");
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
