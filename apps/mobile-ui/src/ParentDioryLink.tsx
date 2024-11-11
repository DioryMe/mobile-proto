import React from "react";
import { useRoomContext } from "./contexts/RoomContext";
import { IDioryObject } from "@diograph/diograph/types";

export const ParentDioryLink = ({
  parentDiories,
  parentId,
  onParentChange,
}: {
  parentDiories: [string, IDioryObject][];
  parentId: string;
  onParentChange: (parentId: string) => void;
}) => {
  const { dioryId, setDioryId, diograph } = useRoomContext();

  return (
    <div style={{ display: "flex", gap: "8px", margin: "8px 0" }}>
      <select
        value={parentId}
        onChange={(e) => {
          onParentChange(e.target.value);
        }}
        style={{
          padding: "8px 16px",
          backgroundColor: "#f0f0f0",
          border: "1px solid #ddd",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        {parentDiories.map(([parentId, parentData]) => (
          <option key={parentId} value={parentId}>
            {parentDiories.length} {parentData.text}
          </option>
        ))}
      </select>

      <button
        onClick={() => parentId && setDioryId(parentId)}
        disabled={!parentId}
        style={{
          padding: "8px 16px",
          backgroundColor: "#f0f0f0",
          border: "1px solid #ddd",
          borderRadius: "4px",
          cursor: parentId ? "pointer" : "not-allowed",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span>↑</span>
        <span>{diograph.getDiory({ id: parentId })?.text || "Parent"}</span>
      </button>
    </div>
  );
};
