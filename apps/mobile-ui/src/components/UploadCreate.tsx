import { Diory } from "@diograph/diograph";
import { useRoomContext } from "../contexts/RoomContext";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const UploadCreate = () => {
  const { diograph, setDiograph, dioryId } = useRoomContext();
  const navigate = useNavigate();
  const [dioryText, setDioryText] = useState("Superii");

  return (
    <div>
      <h2>Upload & Create</h2>
      <input
        type="text"
        value={dioryText}
        onChange={(e) => setDioryText(e.target.value)}
      />
      <button
        onClick={() => {
          diograph &&
            diograph.addDioryAndLink(new Diory({ text: dioryText }), {
              id: dioryId,
            });
          navigate("/diory-grid");
        }}
      >
        Create
      </button>
      <ul>
        <li>Checkbox to create without linking</li>
        <li></li>
        <li>Upload image or drag&drop file (triggers file-generator)</li>
        <li></li>
      </ul>
    </div>
  );
};

export default UploadCreate;
