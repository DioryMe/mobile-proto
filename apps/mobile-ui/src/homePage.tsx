import useFetchData from "./hooks/useFetchData";

import RoomSelection from "./components/RoomSelection";
import { useRoomContext } from "./contexts/RoomContext";
import DioryGrid from "./components/DioryGrid";
import { IDiographObject, RoomConfigData } from "@diograph/diograph/types";
import Content from "./components/Content";
import { useState } from "react";

const HomePage = () => {
  const { nativeDiograph } = useRoomContext();

  return (
    <div>
      <h2>My Diory</h2>
      <DioryGrid diograph={nativeDiograph} />
    </div>
  );
};

export default HomePage;
