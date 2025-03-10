// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "./homePage";
import Copy from "./components/CopyLink";
import LoginPage from "./loginPage";
import NavBar from "./components/NavBar";
import Add from "./components/Add";
import Content from "./components/Content";
import Search from "./components/Search";
import Browse from "./components/Browse";
import { DiosphereProvider } from "./contexts/DiosphereContext";

export const isAuthenticated = () => {
  const accessToken = sessionStorage.getItem("accessToken");
  const idToken = sessionStorage.getItem("idToken");

  return !!accessToken && !!idToken;
};

const App = () => {
  return (
    <Router>
      <DiosphereProvider>
        <NavBar />
        <Routes>
          {/* Root route */}
          <Route
            path="/"
            element={
              isAuthenticated() ? (
                <Navigate replace to="/my-diory" />
              ) : (
                <Navigate replace to="/login" />
              )
            }
          />

          {/* Main routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/my-diory" element={<HomePage />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/add" element={<Add />} />
          <Route path="/copy" element={<Copy />} />
          <Route path="/search" element={<Search />} />

          {/* Dynamic routes with DiosphereProvider */}
          <Route
            path="/my-diory/:focusId/content"
            element={
              <DiosphereProvider>
                <Content />
              </DiosphereProvider>
            }
          />
          <Route
            path="/my-diory/:focusId"
            element={
              <DiosphereProvider>
                <HomePage />
              </DiosphereProvider>
            }
          />
          <Route
            path="/browse/:focusId/content"
            element={
              <DiosphereProvider>
                <Content />
              </DiosphereProvider>
            }
          />
          <Route
            path="/browse/:focusId"
            element={
              <DiosphereProvider>
                <Browse />
              </DiosphereProvider>
            }
          />
        </Routes>
      </DiosphereProvider>
    </Router>
  );
};

export default App;
