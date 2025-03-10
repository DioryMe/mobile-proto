import useFetchData from "../hooks/useFetchData";

import RoomSelection from "./RoomSelection";
import DioryGrid from "./DioryGrid";
import { RoomConfigData } from "@diograph/diograph/types";

const Browse = () => {
  const url = `/room/list`;
  const { result: rooms, error: roomConfigError } =
    useFetchData<RoomConfigData[]>(url);

  const handleRoomSelect = (roomId: string) => {
    // cancelRoomFetch();
    // setRoomId(roomId);
    // setDioryId("/");
  };

  return (
    <div>
      <div>
        <h2>Browse rooms</h2>
      </div>
      <DioryGrid />
      {/* <RoomSelection
        rooms={(rooms && rooms.filter((r) => r.id !== "native")) || []}
        onSelect={handleRoomSelect}
        // selectedRoomId={selectedRoomId}
      /> */}
      {roomConfigError}
    </div>
  );
};

export default Browse;
