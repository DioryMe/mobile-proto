import { useNavigate } from "react-router-dom";

const NewRoom = () => {
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate("/")}>Back to Home</button>
      <h2>New Room</h2>
      {/* Add your NewRoom content here */}
    </div>
  );
};

export default NewRoom;
