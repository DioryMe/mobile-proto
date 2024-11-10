import { useNavigate } from "react-router-dom";

const Map = () => {
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate("/")}>Back to Home</button>
      <h2>Map</h2>
      {/* Add your Map content here */}
    </div>
  );
};

export default Map;
