// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "./homePage";
import RoomAdmin from "./components/RoomAdmin";
import Copy from "./components/CopyLink";
import UploadCreate from "./components/Add";
import LoginPage from "./loginPage";
import { RoomProvider } from "./contexts/RoomContext";
import NavBar from "./components/NavBar";
import Add from "./components/Add";
import EndpointTestPage from "./endpointTest";
import Content from "./components/Content";
import Search from "./components/Search";
import Browse from "./components/Browse";

const App = () => {
  const isAuthenticated = () => {
    const accessToken = sessionStorage.getItem("accessToken");
    return !!accessToken;
  };
  return (
    <RoomProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              isAuthenticated() ? (
                // Native room has no diories
                // <Navigate replace to="/init" />
                // else
                <Navigate replace to="/home" />
              ) : (
                <Navigate replace to="/login" />
              )
            }
          />
          <Route path="/home" element={<HomePage />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/add" element={<Add />} />
          <Route path="/copy" element={<Copy />} />
          <Route path="/search" element={<Search />} />
          <Route path="/endpoint-test" element={<EndpointTestPage />} />
          <Route path="/content" element={<Content />} />
        </Routes>
      </Router>
    </RoomProvider>
  );
};

export default App;
