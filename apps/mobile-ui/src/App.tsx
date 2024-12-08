// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "./homePage";
import DioryGrid from "./components/DioryGrid";
import RoomAdmin from "./components/RoomAdmin";
import Copy from "./components/CopyLink";
import UploadCreate from "./components/UploadCreate";
import Search from "./components/Search";
import Timeline from "./components/Timeline";
import Map from "./components/Map";
import EditDelete from "./components/EditDelete";
import LoginPage from "./loginPage";
import { RoomProvider } from "./contexts/RoomContext";
import NavBar from "./components/NavBar";
import EndpointTestPage from "./endpointTest";

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
                <Navigate replace to="/home" />
              ) : (
                <Navigate replace to="/login" />
              )
            }
          />
          <Route path="/home" element={<HomePage />} />
          <Route path="/diory-grid" element={<DioryGrid />} />
          <Route path="/room-admin" element={<RoomAdmin />} />
          <Route path="/copy" element={<Copy />} />
          <Route path="/upload-create" element={<UploadCreate />} />
          <Route path="/search" element={<Search />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/map" element={<Map />} />
          <Route path="/edit-delete" element={<EditDelete />} />
          <Route path="/endpoint-test" element={<EndpointTestPage />} />
        </Routes>
      </Router>
    </RoomProvider>
  );
};

export default App;
