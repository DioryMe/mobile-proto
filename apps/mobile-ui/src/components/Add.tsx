import { Diory } from "@diograph/diograph";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ImportTestForm from "./ImportTestForm";
import { useDiosphereContext } from "../contexts/DiosphereContext";

const Add = () => {
  const {
    myDioryRoom: { diograph, focusId },
  } = useDiosphereContext();
  const navigate = useNavigate();
  const [dioryText, setDioryText] = useState("Superii");

  const handleImportResponse = (data: any) => {
    navigate("/my-diory");
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
              id: focusId,
            });
          navigate("/my-diory");
        }}
        disabled
      >
        Create
      </button>
    </div>
  );
};

export default Add;
