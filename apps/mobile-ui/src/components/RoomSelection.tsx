import { RoomConfigData } from "@diograph/diograph/types";

interface RoomSelectionProps {
  rooms: RoomConfigData[];
  onSelect: (roomId: string) => void;
  selectedRoomId?: string;
}

const RoomSelection = ({
  rooms,
  onSelect,
  selectedRoomId,
}: RoomSelectionProps) => (
  <ul style={{ listStyleType: "none", padding: 0 }}>
    {rooms.map((room: RoomConfigData) => (
      <li
        key={room.id}
        data-test-id={`room-selection-item-${room.id}`}
        style={{
          cursor: "pointer",
          textTransform: "uppercase",
          padding: "10px",
          backgroundColor:
            room.id === selectedRoomId ? "#b0c451" : "transparent",
          width: "100%",
          color: room.id === selectedRoomId ? "white" : "black",
          textAlign: "center",
        }}
        onClick={() => room.id && onSelect(room.id)}
      >
        {room.id}
      </li>
    ))}
  </ul>
);

export default RoomSelection;
