import { useNavigate } from "react-router-dom";

const Search = () => {
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate("/")}>Back to Home</button>
      <h2>Search</h2>
      {/* Add your Search content here */}
    </div>
  );
};

export default Search;
