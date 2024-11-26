import NavBar from "./NavBar";
import useFetchData from "../hooks/useFetchData";
import { RoomConfigData } from "@diograph/diograph/types";

const RoomAdmin = () => {
  const url = `/room/list`;
  const rooms = useFetchData<RoomConfigData[]>(url) || [];

  return (
    <div>
      <NavBar />
      <h2>Room Admin</h2>
      {rooms.map((room) => (
        <div key={room.id}>{room.id}</div>
      ))}
      <ul>
        <li>List of rooms for user</li>
        <li>
          Create new room
          <ul>
            <li>Input address, type, credentials</li>
            <li>Test connection</li>
          </ul>
        </li>
        <li>Save room to Redis database</li>
        <li>Remove room from user</li>
        <li>
          Destroy room and all its contents{" "}
          <ul>
            <li>Needs write access to room</li>
            <li>Error if read-only</li>
          </ul>
        </li>
        <li>Defrost archive room (or part of it)</li>
        <li>Search CIDs from room: show if available in multiple</li>
      </ul>
    </div>
  );
};

export default RoomAdmin;
