import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";

const Search = () => {
  const navigate = useNavigate();

  return (
    <div>
      <NavBar />
      <h2>Search</h2>
      {/* Add your Search content here */}
    </div>
  );
};

export default Search;
