import { useNavigate } from "react-router-dom";
import styles from "./NavBar.module.css";
import { useRoomContext } from "../contexts/RoomContext";
import diographJson from "../diograph.json";
// import diographJson from "../ignored/diograph.json";
import { Diograph } from "@diograph/diograph";
import { IDiographObject } from "@diograph/diograph/types";

const NavBar = () => {
  const navigate = useNavigate();
  const { diograph, setDiograph, setDioryId } = useRoomContext();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  const isDevelopment = process.env.NODE_ENV === "development";

  return (
    <nav className={styles.navbar}>
      <img
        src="https://avatars.githubusercontent.com/u/7499267  "
        alt="Diograph Logo"
        style={{ width: "32px", height: "32px", cursor: "pointer" }}
        onClick={() => navigate("/")}
      />
      {isDevelopment && (
        <div className={styles.leftSection}>
          <div
            style={{ cursor: "pointer" }}
            onClick={() => {
              setDioryId("/");
              setDiograph(new Diograph(diographJson as IDiographObject));
            }}
          >
            {diograph ? Object.keys(diograph.toObject()).length : "-"}
          </div>
          <button onClick={() => navigate("/diory-grid")}>DioryGrid</button>
          <button onClick={() => navigate("/room-admin")}>Rooms</button>
          <button onClick={() => navigate("/search")}>Search</button>
          <button onClick={() => navigate("/timeline")}>Timeline</button>
          <button onClick={() => navigate("/map")}>Map</button>
          <button onClick={() => navigate("/edit-delete")}>Edit/Delete</button>
          <button onClick={() => navigate("/upload-create")}>
            Upload/Create
          </button>
          <button onClick={() => navigate("/copy")}>Copy</button>
        </div>
      )}
      <div className={styles.rightSection}>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default NavBar;
