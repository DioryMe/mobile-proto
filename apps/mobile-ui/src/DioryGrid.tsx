import React, { useState } from "react";
import Diory, { DioryData } from "./Diory";
import diograph from "./diograph.json";
import { ParentDioryLink } from "./ParentDioryLink";

function DioryGrid() {
  const [dioryId, setDioryId] = useState<string>("/");

  return (
    <div>
      <h1>Diory Viewer</h1>
      {dioryId !== "/" && (
        <ParentDioryLink
          diograph={diograph as unknown as Record<string, DioryData>}
          dioryId={dioryId}
          setDioryId={setDioryId}
        />
      )}
      <Diory
        dioryId={dioryId}
        setDioryId={setDioryId}
        diograph={diograph as any}
      />
    </div>
  );
}

export default DioryGrid;
