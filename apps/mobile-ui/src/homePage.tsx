// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useFetchData, { fetchData } from "./hooks/useFetchData";

import NavBar from "./components/NavBar";

const HomePage = () => {
  const [responses, setResponses] = useState<Record<string, any>>({
    "/room/native/diograph": null,
    "/room/demo/diograph": null,
    "/room/thumbnail": null,
    "/room/content": null,
    "/room/list": null,
  });

  const navigate = useNavigate();

  const handleApiRequest = async (postfix: string) => {
    fetchData(postfix).then((data) =>
      setResponses({ ...responses, [postfix]: data })
    );
  };

  return (
    <div>
      <NavBar />
      <h1>Hello World</h1>
      {Object.entries(responses).map(([key, value]) => (
        <div>
          {key}: {value ? "OK" : "-"}
        </div>
      ))}
      <button
        data-test-id="nativeDiographButton"
        onClick={() => handleApiRequest("/room/native/diograph")}
      >
        Native Diograph
      </button>
      <button
        data-test-id="demoDiographButton"
        onClick={() => handleApiRequest("/room/demo/diograph")}
      >
        Demo Diograph
      </button>
      <br />
      <button
        data-test-id="thumbnailButton"
        onClick={() => handleApiRequest("/room/thumbnail")}
      >
        Thumbnail
      </button>
      <button
        data-test-id="contentButton"
        onClick={() => handleApiRequest("/room/content")}
      >
        Content
      </button>
      <button
        data-test-id="listButton"
        onClick={() => handleApiRequest("/room/list")}
      >
        List
      </button>
    </div>
  );
};

export default HomePage;
