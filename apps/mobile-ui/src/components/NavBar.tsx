import { useNavigate } from "react-router-dom";
import styles from "./NavBar.module.css";
import { useDiosphereContext } from "../contexts/DiosphereContext";

const NavBar = () => {
  const navigate = useNavigate();
  const { loading } = useDiosphereContext();
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
          data-test-id="nav-home"
        />
      )}
      <div className={styles.leftSection}>
        <button data-test-id="nav-browse" onClick={() => navigate("/browse")}>
          Browse
        </button>
        <button data-test-id="nav-add" onClick={() => navigate("/add")}>
          Add
        </button>
        <button data-test-id="nav-copy" onClick={() => navigate("/copy")}>
          Copy
        </button>
        <button data-test-id="nav-search" onClick={() => navigate("/search")}>
          Search
        </button>
      </div>
      <div className={styles.rightSection}>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default NavBar;
