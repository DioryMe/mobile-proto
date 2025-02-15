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
      <h2>Create</h2>
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
          navigate("/home");
        }}
      >
        {" "}
        Create{" "}
      </button>

      <ImportTestForm onResponse={handleImportResponse} />
    </div>
  );
};

export default Add;
