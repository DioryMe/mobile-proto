import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";

const UploadCreate = () => {
  const navigate = useNavigate();

  return (
    <div>
      <NavBar />
      <h2>Upload & Create</h2>
      {/* Add your UploadCreate content here */}
    </div>
  );
};

export default UploadCreate;
