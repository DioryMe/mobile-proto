import DioryGrid from "./components/DioryGrid";
import { useEffect, useState } from "react";
import { fetchData } from "./hooks/fetchData";
import { useDiosphereContext } from "./contexts/DiosphereContext";

const HomePage = () => {
  const {
    myDioryRoom: { diograph: nativeDiograph },
  } = useDiosphereContext();

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
        <DioryGrid />
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
    </div>
  );
};

export default HomePage;
