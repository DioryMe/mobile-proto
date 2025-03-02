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
import EndpointTestPage from "./endpointTest";
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
      <NavBar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
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

        <Route element={<DiosphereProvider />}>
          <Route path="/my-diory">
            <Route index element={<HomePage />} />
            <Route path=":focusId">
              <Route index element={<HomePage />} />
              <Route path="content" element={<Content />} />
            </Route>
          </Route>
          <Route path="/browse">
            <Route index element={<Browse />} />
            <Route path=":focusId">
              <Route index element={<Browse />} />
              <Route path="content" element={<Content />} />
            </Route>
          </Route>
          {/* Other standalone routes */}
          <Route path="/add" element={<Add />} />
          <Route path="/copy" element={<Copy />} />
          <Route path="/search" element={<Search />} />
          <Route path="/endpoint-test" element={<EndpointTestPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
