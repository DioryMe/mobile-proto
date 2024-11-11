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
          Select room to browse & select diories
          <ul>
            <li>List of rooms for user</li>
            <li>Can be the same room too!</li>
          </ul>
        </li>
        <li>
          Browse that room with DioryGrid component in order to select diories
          <ul>
            <li>Button to stop browsing and start selecting</li>
            <li>After that onclick is select</li>
          </ul>
        </li>
        <li>
          Copy button to copy diory
          <ul>
            <li>
              Checkbox for copying also related contents to that other room
            </li>
            <li>Deep copy: number how deep to copy all linked diories</li>
            <li>Preview & summarize what will happen on submit</li>
          </ul>
        </li>
        <li>Link button to link diory</li>
        <li>
          On submit: modify diograph, copy contents & redirect to DioryGrid to
          see results
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
      </ul>
    </div>
  );
};

export default CopyLink;
