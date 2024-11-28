import { useNavigate } from "react-router-dom";
import useFetchData from "./hooks/useFetchData";

import RoomSelection from "./components/RoomSelection";
import { RoomConfigData } from "@diograph/diograph/types";
import { useRoomContext } from "./contexts/RoomContext";
import DioryGrid from "./components/DioryGrid";

const HomePage = () => {
  const url = `/room/list`;
  const { roomId: selectedRoomId, setRoomId, setDioryId } = useRoomContext();
  const rooms = useFetchData<RoomConfigData[]>(url);
  const navigate = useNavigate();

  const handleRoomSelect = (roomId: string) => {
    setRoomId(roomId);
    setDioryId("/");
  };

  return (
    <div>
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
