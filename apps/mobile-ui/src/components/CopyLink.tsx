import { useRoomContext } from "../contexts/RoomContext";
import NavBar from "./NavBar";

const CopyLink = () => {
  const { dioryId } = useRoomContext();

  return (
    <div>
      <NavBar />
      <h2>Copy</h2>
      <p>Diory ID: {dioryId}</p>
      <ul>
        <li>
          Own DioryGrid component for selecting diories
          <ul>
            <li>Button to stop browsing and start selecting</li>
            <li>After that onclick is select</li>
          </ul>
        </li>
        <li>Copy button to copy diory</li>
        <li>Link button to link diory</li>
        <li>
          On submit: modify diograph & redirect to DioryGrid to see results
        </li>
        <li></li>
        <li>
          Collect list of selected diories
          <ul>
            <li>Own/persistent state for selection grid to RoomContext?</li>
            <li>Hand?</li>
          </ul>
        </li>
        <li></li>
        <li>Deep copy: with all linked diories (how deep?)</li>
      </ul>
    </div>
  );
};

export default CopyLink;
