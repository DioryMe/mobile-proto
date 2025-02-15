import useFetchData from "../hooks/useFetchData";

import RoomSelection from "./RoomSelection";
import { useRoomContext } from "../contexts/RoomContext";
import DioryGrid from "./DioryGrid";
import { RoomConfigData } from "@diograph/diograph/types";

const Browse = () => {
  const url = `/room/list`;
  const {
    diograph,
    roomId: selectedRoomId,
    setRoomId,
    setDioryId,
    error: diographError,
    cancelFetch: cancelRoomFetch,
  } = useRoomContext();
  const { result: rooms, error: roomConfigError } =
    useFetchData<RoomConfigData[]>(url);

  const handleRoomSelect = (roomId: string) => {
    cancelRoomFetch();
    setRoomId(roomId);
    setDioryId("/");
  };

  return (
    <div>
      <div>
        <h2>Browse rooms</h2>
      </div>
      <DioryGrid diograph={diograph} />
      <RoomSelection
        rooms={(rooms && rooms.filter((r) => r.id !== "native")) || []}
        onSelect={handleRoomSelect}
        selectedRoomId={selectedRoomId}
      />
      {roomConfigError}
      {diographError}
    </div>
  );
};

export default Browse;
