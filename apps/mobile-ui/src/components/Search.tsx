import { useRoomContext } from "../contexts/RoomContext";
import NavBar from "./NavBar";
import smallDiograph from "../smallDiograph.json";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const { diograph, setDiograph } = useRoomContext();
  const navigate = useNavigate();
  return (
    <div>
      <NavBar />
      <h2>Search</h2>
      <button
        onClick={() => {
          setDiograph(smallDiograph as any);
          navigate("/diory-grid");
        }}
      >
        Submit search
      </button>
      <ul>
        <li>Add setDiograph and create mock search result diograph</li>
        <li>X button to navbar to revert complete diograph & its focus</li>
        <li></li>
        <li>Text search:Add search input & button</li>
        <li>Request to search endpoint (create it first to backend)</li>
        <li>Display search results (how it differs from DioryGrid?)</li>
        <li></li>
        <li>Timeline search: start & end dates</li>
        <li>
          Map search
          <ul>
            <li>point & radius</li>
            <li>two points for rectangle</li>
          </ul>
        </li>
        <li></li>
        <li>Type filter: add dropdown</li>
        <li></li>
        <li>On submit: set diograph & redirect to DioryGrid to see results</li>
      </ul>
    </div>
  );
};

export default Search;
