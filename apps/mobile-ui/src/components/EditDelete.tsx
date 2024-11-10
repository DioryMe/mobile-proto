import { useNavigate } from "react-router-dom";

const EditDelete = () => {
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate("/")}>Back to Home</button>
      <h2>Edit & Delete</h2>
      {/* Add your EditDelete content here */}
    </div>
  );
};

export default EditDelete;
