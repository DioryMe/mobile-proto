import React, { useState } from "react";
import Diory from "./Diory";
import { ParentDioryLink } from "./ParentDioryLink";
import { NavigationButton } from "./NavigationButton";
import { useRoomContext } from "./contexts/RoomContext";

function DioryGrid() {
  const { diograph, dioryId } = useRoomContext();

  const parentDiories = Object.entries(diograph).filter(([_, dioryData]) =>
    dioryData.links?.some((link) => link.id === dioryId)
  );

  const parentDioryId = parentDiories[0]?.[0] || "";
  const [parentId, setParentId] = useState<string>(parentDioryId);

  const handleParentChange = (newParentId: string) => {
    setParentId(newParentId);
  };

  return (
    <div>
      <h1>Diory Viewer</h1>
      {dioryId !== "/" && (
        <ParentDioryLink
          parentDiories={parentDiories}
          parentId={parentId}
          onParentChange={handleParentChange}
        />
      )}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <NavigationButton direction="prev" parentId={parentId} />
        <Diory />
        <NavigationButton direction="next" parentId={parentId} />
      </div>
    </div>
  );
}

export default DioryGrid;
