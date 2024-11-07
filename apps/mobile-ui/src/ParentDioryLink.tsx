import React from "react";
import { DioryData } from "./Diory";

export const ParentDioryLink = ({
  diograph,
  dioryId,
  setDioryId,
}: {
  diograph: Record<string, DioryData>;
  dioryId: string;
  setDioryId: (id: string) => void;
}) => {
  const parentDiories = Object.entries(diograph).filter(([_, dioryData]) =>
    dioryData.links?.some((link) => link.id === dioryId)
  );

  const [selectedParentId, setSelectedParentId] = React.useState<string>(
    parentDiories[0]?.[0] || ""
  );

  return (
    <div style={{ display: "flex", gap: "8px", margin: "8px 0" }}>
      <select
        value={selectedParentId}
        onChange={(e) => setSelectedParentId(e.target.value)}
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
        onClick={() => selectedParentId && setDioryId(selectedParentId)}
        disabled={!selectedParentId}
        style={{
          padding: "8px 16px",
          backgroundColor: "#f0f0f0",
          border: "1px solid #ddd",
          borderRadius: "4px",
          cursor: selectedParentId ? "pointer" : "not-allowed",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span>↑</span>
        <span>{diograph[selectedParentId]?.text || "Parent"}</span>
      </button>
    </div>
  );
};
