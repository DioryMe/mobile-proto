import { Diory } from "@diograph/diograph";
import { useRoomContext } from "../contexts/RoomContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ImportTestForm from "./ImportTestForm";

const Add = () => {
  const { diograph, dioryId } = useRoomContext();
  const navigate = useNavigate();
  const [dioryText, setDioryText] = useState("Superii");

  const handleImportResponse = (data: any) => {
    navigate("/home");
  };

  return (
    <div>
      <ImportTestForm onResponse={handleImportResponse} />

      <h2>Create</h2>
      <input
        type="text"
        value={dioryText}
        onChange={(e) => setDioryText(e.target.value)}
        disabled
      />
      <button
        onClick={() => {
          diograph &&
            diograph.addDioryAndLink(new Diory({ text: dioryText }), {
              id: dioryId,
            });
          navigate("/home");
        }}
        disabled
      >
        Create
      </button>
    </div>
  );
};

export default Add;
