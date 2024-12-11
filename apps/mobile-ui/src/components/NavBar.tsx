import { useNavigate } from "react-router-dom";
import styles from "./NavBar.module.css";
import { useRoomContext } from "../contexts/RoomContext";

const NavBar = () => {
  const navigate = useNavigate();
  const { loading } = useRoomContext();
  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  const isDevelopment = process.env.NODE_ENV === "development";

  return (
    <nav className={styles.navbar}>
      {loading ? (
        <img src="/loadicon.gif" width="32px"></img>
      ) : (
        <img
          src="https://avatars.githubusercontent.com/u/7499267  "
          alt="Diograph Logo"
          style={{ width: "32px", height: "32px", cursor: "pointer" }}
          onClick={() => navigate("/")}
        />
      )}
      {isDevelopment && (
        <div className={styles.leftSection}>
          <button onClick={() => navigate("/diory-grid")}>DioryGrid</button>
          <button onClick={() => navigate("/room-admin")}>Rooms</button>
          <button onClick={() => navigate("/search")}>Search</button>
          <button onClick={() => navigate("/timeline")}>Timeline</button>
          <button onClick={() => navigate("/map")}>Map</button>
          <button onClick={() => navigate("/edit-delete")}>Edit/Delete</button>
          <button onClick={() => navigate("/upload-create")}>
            Upload/Create
          </button>
          <button onClick={() => navigate("/endpoint-test")}>
            Endpoint Test
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
