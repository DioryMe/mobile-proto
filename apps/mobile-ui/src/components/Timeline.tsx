import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
const Timeline = () => {
  const navigate = useNavigate();

  return (
    <div>
      <NavBar />
      <h2>Timeline</h2>
      {/* Add your Timeline content here */}
    </div>
  );
};

export default Timeline;
