// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface DioryLink {
  id: string;
  path: string;
}

interface Diory {
  text?: string;
  image?: string;
  links?: DioryLink[];
  created?: string;
  modified?: string;
  id: string;
  data?: Array<{
    "@context": string;
    "@type": string;
    contentUrl: string;
    height?: number;
    width?: number;
    encodingFormat: string;
  }>;
}

interface DiographType {
  [key: string]: Diory;
}

const HomePage = () => {
  const [diograph, setDiograph] = useState<DiographType>({});

  const navigate = useNavigate();

  const handleApiRequest = async () => {
    try {
      const accessToken = sessionStorage.getItem("accessToken");
      const idToken = sessionStorage.getItem("idToken");

      if (!accessToken || !idToken) {
        throw new Error("No tokens found");
      }

      const response = await fetch(
        `/diograph.json`
        // `${import.meta.env.VITE_API_URL}/room/diograph`,
        // {
        //   headers: {
        //     Authorization: `Bearer ${accessToken}`,
        //     "X-Id-Token": idToken,
        //   },
        // }
      );

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      setDiograph(data);
    } catch (error) {
      console.error("API request failed:", error);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div>
      <h1>Hello World</h1>
      <button data-test-id="makeApiRequest" onClick={handleApiRequest}>
        Make API request
      </button>
      <button data-test-id="logout" onClick={handleLogout}>
        Logout
      </button>
      <div data-test-id="diory-list">
        {Object.entries(diograph).map(([id, diory]) => (
          <div
            key={id}
            id={`diory-${id}`}
            style={{ cursor: "pointer" }}
            onClick={() =>
              alert(`You clicked diory (id: ${id}): ${diory.text || "No text"}`)
            }
          >
            {diory.text || id}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
