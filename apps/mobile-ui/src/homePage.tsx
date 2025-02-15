import useFetchData from "./hooks/useFetchData";

import RoomSelection from "./components/RoomSelection";
import { useRoomContext } from "./contexts/RoomContext";
import DioryGrid from "./components/DioryGrid";
import { IDiographObject, RoomConfigData } from "@diograph/diograph/types";
import Content from "./components/Content";
import { useState } from "react";

const HomePage = () => {
  const { nativeDiograph, nativeDiographError } = useRoomContext();

  return (
    <div>
      <h2>My Diory</h2>
      {nativeDiograph && Object.keys(nativeDiograph.toObject()).length ? (
        <DioryGrid diograph={nativeDiograph} />
      ) : (
        <>
          <div>Native room not initialized</div>
        </>
      )}
      <div>{nativeDiographError}</div>
    </div>
  );
};

export default HomePage;
