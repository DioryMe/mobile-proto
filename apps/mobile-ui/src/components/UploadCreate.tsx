import { useNavigate } from "react-router-dom";

const UploadCreate = () => {
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate("/")}>Back to Home</button>
      <h2>Upload & Create</h2>
      {/* Add your UploadCreate content here */}
    </div>
  );
};

export default UploadCreate;
