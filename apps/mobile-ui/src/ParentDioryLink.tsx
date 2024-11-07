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
  return (
    <div style={{ display: "flex", gap: "8px", margin: "8px 0" }}>
      {Object.entries(diograph)
        .filter(([_, dioryData]) =>
          dioryData.links?.some((link) => link.id === dioryId)
        )
        .map(([parentId, parentData]) => (
          <button
            key={parentId}
            onClick={() => setDioryId(parentId)}
            style={{
              padding: "8px 16px",
              backgroundColor: "#f0f0f0",
              border: "1px solid #ddd",
              borderRadius: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>↑</span>
            <span>{parentData.text}</span>
          </button>
        ))}
    </div>
  );
};
