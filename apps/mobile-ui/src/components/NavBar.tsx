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
      <div className={styles.leftSection}>
        <button onClick={() => navigate("/browse")}>Browse</button>
        <button onClick={() => navigate("/add")}>Add</button>
        <button onClick={() => navigate("/copy")}>Copy</button>
        <button onClick={() => navigate("/search")}>Search</button>
      </div>
      <div className={styles.rightSection}>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default NavBar;
