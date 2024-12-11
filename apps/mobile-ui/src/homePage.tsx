import { useNavigate } from "react-router-dom";
import useFetchData from "./hooks/useFetchData";

import RoomSelection from "./components/RoomSelection";
import { useRoomContext } from "./contexts/RoomContext";
import DioryGrid from "./components/DioryGrid";
import { RoomConfigData } from "@diograph/diograph/types";

const HomePage = () => {
  const url = `/room/list`;
  const {
    roomId: selectedRoomId,
    setRoomId,
    setDioryId,
    error: diographError,
  } = useRoomContext();
  const { result: rooms, error: roomConfigError } =
    useFetchData<RoomConfigData[]>(url);

  const handleRoomSelect = (roomId: string) => {
    setRoomId(roomId);
    setDioryId("/");
  };

  return (
    <div>
      <div>
        {"_"}
        {roomConfigError}
        {diographError}
      </div>
      <RoomSelection
        rooms={rooms || []}
        onSelect={handleRoomSelect}
        selectedRoomId={selectedRoomId}
      />
      <DioryGrid />
    </div>
  );
};

export default HomePage;
