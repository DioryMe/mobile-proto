import { useRoomContext } from "./contexts/RoomContext";
import DioryGrid from "./components/DioryGrid";
import { useEffect, useState } from "react";
import { fetchData } from "./hooks/fetchData";

const HomePage = () => {
  const {
    nativeDioryId,
    setNativeDioryId,
    nativeDiograph,
    nativeDiographError,
  } = useRoomContext();

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
        <DioryGrid
          dioryId={nativeDioryId}
          setDioryId={setNativeDioryId}
          diograph={nativeDiograph}
        />
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
