import { useNavigate } from "react-router-dom";
import styles from "./NavBar.module.css";

const NavBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.leftSection}>
        <button onClick={() => navigate("/")}>Home</button>
        <button onClick={() => navigate("/diory-grid")}>DioryGrid</button>
        <button onClick={() => navigate("/search")}>Search</button>
        <button onClick={() => navigate("/timeline")}>Timeline</button>
        <button onClick={() => navigate("/map")}>Map</button>
        <button onClick={() => navigate("/edit-delete")}>Edit/Delete</button>
        <button onClick={() => navigate("/upload-create")}>
          Upload/Create
        </button>
        <button onClick={() => navigate("/new-room")}>NewRoom</button>
        <button onClick={() => navigate("/copy")}>Copy</button>
      </div>
      <div className={styles.rightSection}>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default NavBar;
