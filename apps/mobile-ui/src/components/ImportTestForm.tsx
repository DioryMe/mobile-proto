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
      // "Content-Type": "application/json", -> copyTestForm's postFormContent
      Authorization: `Bearer ${accessToken}`,
      "X-Id-Token": idToken,
    },
    // body: JSON.stringify(payload), -> copyTestForm's postFormContent
    body: payload,
    signal,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response;
};

interface ImportTestFormProps {
  onResponse: (data: any) => void;
}

const ImportTestForm: React.FC<ImportTestFormProps> = ({ onResponse }) => {
  const {
    myDioryRoom: { focusId },
  } = useDiosphereContext();

  const [importForm, setImportForm] = useState({
    diographOnly: "false",
    formFiles: [] as File[],
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "formFiles" && files) {
      setImportForm((prev) => ({
        ...prev,
        formFiles: Array.from(files),
      }));
    } else {
      setImportForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (importForm.formFiles.length === 0) {
      alert("Please select at least one file to upload.");
      return;
    }

    const formData = new FormData();

    // Append non-file fields
    formData.append("destinationRoomId", "native");
    formData.append("parentDioryId", focusId);
    formData.append("diographOnly", importForm.diographOnly.toString()); // Convert boolean to string

    // Append files
    importForm.formFiles.forEach((file) => {
      formData.append("formFiles", file); // Field name must match with NestJS's @UploadedFiles()
    });

    try {
      const response = await postFormContent("/import", formData);
      const data = await response.json();
      onResponse(data);
    } catch (error) {
      console.error(error);
      onResponse("Error");
    }
  };

  return (
    <div>
      <h2>Import Diory</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>Destination Room ID: native</label>
        </div>
        <div>
          <label>Parent Diory ID: {focusId}</label>
        </div>
        <div>
          <label>
            Diograph Only:
            <select
              name="diographOnly"
              value={importForm.diographOnly}
              onChange={handleChange}
              required
            >
              <option value="false">False</option>
              <option value="true">True</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Select Files:
            <input
              type="file"
              id="formFiles"
              name="formFiles"
              onChange={handleChange}
              multiple
              required
            />
          </label>
        </div>
        <button type="submit" data-test-id="submitImportTestForm">
          Import Diory
        </button>
      </form>
    </div>
  );
};

export default ImportTestForm;
