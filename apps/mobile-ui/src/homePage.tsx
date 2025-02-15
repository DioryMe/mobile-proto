import useFetchData, { fetchData } from "./hooks/useFetchData";

import RoomSelection from "./components/RoomSelection";
import { useRoomContext } from "./contexts/RoomContext";
import DioryGrid from "./components/DioryGrid";
import { IDiographObject, RoomConfigData } from "@diograph/diograph/types";
import Content from "./components/Content";
import { useEffect, useState } from "react";

const HomePage = () => {
  const { nativeDiograph, nativeDiographError } = useRoomContext();

  const [nativeRoomInited, setNativeRoomInited] = useState(false);

  useEffect(() => {
    setNativeRoomInited(
      nativeDiograph !== null &&
        Object.keys(nativeDiograph.toObject()).length > 0
    );
  }, [nativeDiograph]);

  const handleApiRequest = async (postfix: string) => {
    fetchData(postfix).then((data) => setNativeRoomInited(true));
  };

  return (
    <div>
      <h2>My Diory</h2>
      {nativeRoomInited ? (
        <DioryGrid diograph={nativeDiograph} />
      ) : (
        <>
          <div data-test-id="native-room-not-initialised">
            Native room not initialised
          </div>
          <button
            key="nativeDiographInitButton"
            data-test-id="nativeDiographInitButton"
            onClick={() => handleApiRequest("/room/native/init")}
          >
            Init native room
          </button>
        </>
      )}
      <div>{nativeDiographError}</div>
    </div>
  );
};

export default HomePage;
