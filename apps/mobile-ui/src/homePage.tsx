// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useNavigate } from "react-router-dom";
import useFetchData from "./hooks/useFetchData";

import NavBar from "./components/NavBar";
import RoomSelection from "./components/RoomSelection";
import { RoomConfigData } from "@diograph/diograph/types";
import { useRoomContext } from "./contexts/RoomContext";
import DioryGrid from "./components/DioryGrid";

const HomePage = () => {
  const url = `/room/list`;
  const { setRoomId, setDioryId } = useRoomContext();
  const rooms = useFetchData<RoomConfigData[]>(url);
  const navigate = useNavigate();

  const handleRoomSelect = (roomId: string) => {
    setRoomId(roomId);
    setDioryId("/");
  };

  return (
    <div>
      <NavBar />
      <h2>Home</h2>
      <RoomSelection rooms={rooms || []} onSelect={handleRoomSelect} />
      <DioryGrid />
    </div>
  );
};

export default HomePage;
