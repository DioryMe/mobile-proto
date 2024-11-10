import { useNavigate } from "react-router-dom";
import { useRoomContext } from "../contexts/RoomContext";
import NavBar from "./NavBar";

const Copy = () => {
  const navigate = useNavigate();
  const { dioryId } = useRoomContext();

  return (
    <div>
      <NavBar />
      <h2>Copy</h2>
      <p>Diory ID: {dioryId}</p>
    </div>
  );
};

export default Copy;
