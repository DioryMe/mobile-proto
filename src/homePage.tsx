// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [dummyList, setDummyList] = useState([]);

  const navigate = useNavigate();

  const handleApiRequest = async () => {
    try {
      const response = await fetch("https://dummyjson.com/todos", {
        // credentials: "include",
      });
      setDummyList((await response.json()).todos);
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
        {dummyList.map(({ id, todo }, index) => (
          <div
            key={index}
            id={`diory-${id}`}
            style={{ cursor: "pointer" }}
            onClick={() =>
              alert(`You clicked dummy-diory (id: ${id}): ${todo}`)
            }
          >
            {todo}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
