import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
const Map = () => {
  const navigate = useNavigate();

  return (
    <div>
      <NavBar />
      <h2>Map</h2>
      {/* Add your Map content here */}
    </div>
  );
};

export default Map;
