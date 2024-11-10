import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";

const NewRoom = () => {
  const navigate = useNavigate();

  return (
    <div>
      <NavBar />
      <h2>New Room</h2>
      {/* Add your NewRoom content here */}
    </div>
  );
};

export default NewRoom;
