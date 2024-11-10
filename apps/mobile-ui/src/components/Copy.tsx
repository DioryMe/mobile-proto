import { useNavigate } from "react-router-dom";
import { useRoomContext } from "../contexts/RoomContext";

const Copy = () => {
  const navigate = useNavigate();
  const { dioryId } = useRoomContext();

  return (
    <div>
      <button onClick={() => navigate("/")}>Back to Home</button>
      <h2>Copy</h2>
      <p>Diory ID: {dioryId}</p>
    </div>
  );
};

export default Copy;
