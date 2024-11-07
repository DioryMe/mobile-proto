import React, { useState } from "react";
import Diory, { DioryData } from "./Diory";
import diograph from "./diograph.json";
import { ParentDioryLink } from "./ParentDioryLink";
import { NavigationButton } from "./NavigationButton";

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
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <NavigationButton
          direction="prev"
          dioryId={dioryId}
          diograph={diograph as unknown as Record<string, DioryData>}
          setDioryId={setDioryId}
        />

        <Diory
          dioryId={dioryId}
          setDioryId={setDioryId}
          diograph={diograph as any}
        />

        <NavigationButton
          direction="next"
          dioryId={dioryId}
          diograph={diograph as unknown as Record<string, DioryData>}
          setDioryId={setDioryId}
        />
      </div>
    </div>
  );
}

export default DioryGrid;
