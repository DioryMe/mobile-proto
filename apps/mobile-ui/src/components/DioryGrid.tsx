import React, { useEffect, useState } from "react";
import Diory, { DioryData } from "../Diory";
import { ParentDioryLink } from "../ParentDioryLink";
import { NavigationButton } from "../NavigationButton";
import { useRoomContext } from "../contexts/RoomContext";
import { useNavigate } from "react-router-dom";

function DioryGrid() {
  const navigate = useNavigate();
  const { diograph, dioryId } = useRoomContext();
  const [parentId, setParentId] = useState<string>("");
  const [parentDiories, setParentDiories] = useState<[string, DioryData][]>([]);

  useEffect(() => {
    const parentDiories = Object.entries(diograph).filter(([_, dioryData]) =>
      dioryData.links?.some((link) => link.id === dioryId)
    );
    const parentDioryId = parentDiories[0]?.[0] || "";
    setParentId(parentDioryId);
    setParentDiories(parentDiories);
  }, [diograph, dioryId]);

  const handleParentChange = (newParentId: string) => {
    setParentId(newParentId);
  };

  return (
    <div>
      <button onClick={() => navigate("/")}>Back to Home</button>

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
