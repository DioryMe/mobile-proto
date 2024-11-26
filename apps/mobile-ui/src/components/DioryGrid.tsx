import React, { useEffect, useState } from "react";
import Diory from "../Diory";
import { ParentDioryLink } from "../ParentDioryLink";
import { NavigationButton } from "../NavigationButton";
import { useRoomContext } from "../contexts/RoomContext";
import NavBar from "./NavBar";
import { IDioryObject } from "@diograph/diograph/types";
import { OpenInNewWindow } from "./OpenInNewWindow";

function DioryGrid() {
  const { diograph, dioryId } = useRoomContext();

  const [parentId, setParentId] = useState<string>("/");
  const [parentDiories, setParentDiories] = useState<[string, IDioryObject][]>(
    []
  );

  useEffect(() => {
    if (!diograph) {
      return;
    }

    const parentDiories = Object.entries(diograph.toObject()).filter(
      ([_, dioryData]) => dioryData.links?.some((link) => link.id === dioryId)
    );
    const parentDioryId = parentDiories[0]?.[0] || "/";
    setParentId(parentDioryId);
    setParentDiories(parentDiories);
  }, [diograph, dioryId]);

  const handleParentChange = (newParentId: string) => {
    setParentId(newParentId);
  };

  return (
    <div>
      <NavBar />
      <h2>Diory Grid</h2>
      {dioryId !== "/" && (
        <div>
          <div style={{ display: "flex", gap: "8px", margin: "8px 0" }}>
            <ParentDioryLink
              parentDiories={parentDiories}
              parentId={parentId}
              onParentChange={handleParentChange}
            />
          </div>
          <div style={{ display: "flex", gap: "8px", margin: "8px 0" }}>
            <NavigationButton direction="prev" parentId={parentId} />
            <NavigationButton direction="next" parentId={parentId} />
            <OpenInNewWindow />
          </div>
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <Diory />
      </div>
      <ul>
        <li>Show and play video in "fullscreen"</li>
        <li>
          BUG: Parent diory should persist when navigating (now always selects
          the first story)
        </li>
      </ul>
    </div>
  );
}

export default DioryGrid;
