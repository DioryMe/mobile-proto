import React from "react";
import { DioryData } from "./Diory";

export const NavigationButton = ({
  direction,
  dioryId,
  parentId,
  diograph,
  setDioryId,
}: {
  direction: "prev" | "next";
  dioryId: string;
  parentId: string;
  diograph: Record<string, DioryData>;
  setDioryId: (id: string) => void;
}) => {
  if (!parentId) return null;

  const parentData = diograph[parentId];
  const currentLinkIndex =
    parentData.links?.findIndex((link) => link.id === dioryId) ?? -1;

  const targetIndex =
    direction === "prev" ? currentLinkIndex - 1 : currentLinkIndex + 1;

  const disabled =
    !parentData.links ||
    targetIndex < 0 ||
    targetIndex >= parentData.links.length;

  const handleClick = () => {
    setDioryId(parentData.links![targetIndex].id);
  };

  return (
    <button
      onClick={handleClick}
      style={{
        padding: "8px",
        backgroundColor: "#f0f0f0",
        border: "1px solid #ddd",
        borderRadius: "4px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
      }}
      {...(disabled ? { disabled } : {})}
    >
      {direction === "prev" ? "←" : "→"}
    </button>
  );
};
