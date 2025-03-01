import React, { useState, ChangeEvent, FormEvent } from "react";
import { useDiosphereContext } from "../contexts/DiosphereContext";

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
  const {
    myDioryRoom: { focusId: myDioryFocusId },
    browseRoom: { focusId: browseFocusId },
  } = useDiosphereContext();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await postFormContent("/copy", {
        destinationRoomId: "native",
        parentDioryId: myDioryFocusId,
        sourceRoomId: "demo",
        copyDioryId: browseFocusId,
      });

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
          <label>Destination Room ID: native</label>
        </div>
        <div>
          <label>Parent Diory ID: {myDioryFocusId}</label>
        </div>
        <div>
          <label>Source Room ID: demo</label>
        </div>
        <div>
          <label>Copy Diory ID: {browseFocusId}</label>
        </div>
        <button type="submit" data-test-id="submitCopyTestForm">
          Copy Diory
        </button>
      </form>
    </div>
  );
};

export default CopyTestForm;
