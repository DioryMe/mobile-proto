import { useRoomContext } from "../contexts/RoomContext";
import NavBar from "./NavBar";
import smallDiograph from "../smallDiograph.json";
import { useNavigate } from "react-router-dom";
import { Diograph } from "@diograph/diograph";
import Diory from "../Diory";

const Search = () => {
  const { diograph, setDiograph, setDioryId } = useRoomContext();
  const navigate = useNavigate();

  const dateSearchResultMaaliskuu = () =>
    diograph &&
    diograph.queryDiographByDateAndGeo({
      dateStart: "2016-03-10",
      dateEnd: "2016-03-31",
    });

  const textSearchResult2016 = () =>
    diograph &&
    diograph.queryDiograph({
      text: "2016-1",
    });

  const geoSearchResultKangasala = () =>
    diograph &&
    diograph.queryDiographByDateAndGeo({
      latlngStart: "61.48587998183945, 23.96633387857436",
      latlngEnd: "61.385879805830584, 24.241258867230393",
    });

  return (
    <div>
      <h2>Search</h2>
      <button
        onClick={() => {
          setDiograph(new Diograph(smallDiograph));
          setDioryId("/");
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

      <div>
        <b>Maaliskuu:</b>
        <br />
        {Object.values(dateSearchResultMaaliskuu() || []).map((diory) => (
          <img
            key={`maalis-${diory.id}`}
            onClick={() => {
              setDioryId(diory.id);
              navigate("/diory-grid");
            }}
            width={100}
            src={diory.image}
            style={{ cursor: "pointer" }}
          />
        ))}
      </div>

      <div>
        <b>Text "2016":</b>
        {Object.values(textSearchResult2016() || []).map((diory) => (
          <div key={`text-${diory.id}`}>
            <img
              onClick={() => {
                setDioryId(diory.id);
                navigate("/diory-grid");
              }}
              width={100}
              src={diory.image}
              style={{ cursor: "pointer" }}
            />
            {diory.text}
          </div>
        ))}
      </div>
      <div>------------------------</div>
      <div>
        <b>Geo "Kangasala":</b>
        <br />
        {Object.values(geoSearchResultKangasala() || []).map((diory) => (
          <img
            key={`geo-${diory.id}`}
            onClick={() => {
              setDioryId(diory.id);
              navigate("/diory-grid");
            }}
            width={100}
            src={diory.image}
            style={{ cursor: "pointer" }}
          />
        ))}
      </div>
    </div>
  );
};

export default Search;
