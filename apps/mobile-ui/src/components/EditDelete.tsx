import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
const EditDelete = () => {
  const navigate = useNavigate();

  return (
    <div>
      <NavBar />
      <h2>Edit & Delete</h2>
      {/* Add your EditDelete content here */}
    </div>
  );
};

export default EditDelete;
