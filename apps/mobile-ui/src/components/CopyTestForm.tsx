import React, { useState, ChangeEvent, FormEvent } from "react";

const baseUrl = import.meta.env.VITE_API_URL;

export const postFormContent = async (
  url: string,
  payload: any,
  signal?: AbortSignal
): Promise<any> => {
  const accessToken = sessionStorage.getItem("accessToken");
  const idToken = sessionStorage.getItem("idToken");

  if (!accessToken || !idToken) {
    throw new Error("No tokens found");
  }

  const response = await fetch(`${baseUrl}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-Id-Token": idToken,
    },
    body: JSON.stringify(payload),
    signal,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response;
};

interface CopyTestFormProps {
  onResponse: (data: any) => void;
}

const CopyTestForm: React.FC<CopyTestFormProps> = ({ onResponse }) => {
  const [copyForm, setCopyForm] = useState({
    sourceRoomId: "demo",
    copyDioryId: "generic-content",
    destinationRoomId: "native",
    parentDioryId: "/",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCopyForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await postFormContent("/copy", copyForm);
      const data = await response.json();
      onResponse(data);
    } catch (error) {
      console.error(error);
      onResponse("Error");
    }
  };

  return (
    <div>
      <h2>Copy Diory</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Source Room ID:
            <input
              type="text"
              name="sourceRoomId"
              value={copyForm.sourceRoomId}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Copy Diory ID:
            <input
              type="text"
              name="copyDioryId"
              value={copyForm.copyDioryId}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Destination Room ID:
            <input
              type="text"
              name="destinationRoomId"
              value={copyForm.destinationRoomId}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Parent Diory ID:
            <input
              type="text"
              name="parentDioryId"
              value={copyForm.parentDioryId}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <button type="submit">Copy Diory</button>
      </form>
    </div>
  );
};

export default CopyTestForm;
