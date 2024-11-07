import React, { useState } from "react";
import Diory from "./Diory";
import diograph from "./diograph.json";

function DioryGrid() {
  const [dioryId, setDioryId] = useState<string>("/");

  return (
    <div>
      <h1>Diory Viewer</h1>
      <Diory
        dioryId={dioryId}
        setDioryId={setDioryId}
        diograph={diograph as any}
      />
    </div>
  );
}

export default DioryGrid;
