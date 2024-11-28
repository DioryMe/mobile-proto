import { RoomConfigData } from "@diograph/diograph/types";

interface RoomSelectionProps {
  rooms: RoomConfigData[];
  onSelect: (roomId: string) => void;
}

const RoomSelection = ({ rooms, onSelect }: RoomSelectionProps) => (
  <>
    {rooms.map((room: RoomConfigData) => (
      <div
        key={room.id}
        style={{ cursor: "pointer" }}
        onClick={() => room.id && onSelect(room.id)}
      >
        {room.id}
      </div>
    ))}
  </>
);

export default RoomSelection;
