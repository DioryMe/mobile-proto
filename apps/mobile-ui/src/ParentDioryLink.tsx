import React from "react";
import { IDioryObject } from "@diograph/diograph/types";
import { Diograph } from "@diograph/diograph";

interface ParentDioryLinkProps {
  diograph: Diograph | null | undefined;
  onClick: (id: string) => void;
  parentDiories: [string, IDioryObject][];
  parentId: string;
  onParentChange: (parentId: string) => void;
}

export const ParentDioryLink: React.FC<ParentDioryLinkProps> = ({
  diograph,
  onClick,
  parentDiories,
  parentId,
  onParentChange,
}) => {
  return (
    <>
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
        onClick={() => parentId && onClick(parentId)}
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
        <span>{diograph?.getDiory({ id: parentId })?.text || "Parent"}</span>
      </button>
    </>
  );
};
