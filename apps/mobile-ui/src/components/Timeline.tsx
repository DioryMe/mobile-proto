import { useNavigate } from "react-router-dom";

const Timeline = () => {
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate("/")}>Back to Home</button>
      <h2>Timeline</h2>
      {/* Add your Timeline content here */}
    </div>
  );
};

export default Timeline;
