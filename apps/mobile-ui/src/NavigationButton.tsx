import React from "react";
import { Diograph } from "@diograph/diograph";

interface NavigationButtonProps {
  direction: "prev" | "next";
  parentId: string;
  diograph: Diograph | null | undefined;
  dioryId: string;
  onClick: (id: string) => void;
}

export const NavigationButton: React.FC<NavigationButtonProps> = ({
  direction,
  parentId,
  diograph,
  dioryId,
  onClick,
}) => {
  if (!parentId || !diograph) return null;

  const parentData = diograph.getDiory({ id: parentId });
  const currentLinkIndex =
    parentData.links?.findIndex((link) => link.id === dioryId) ?? -1;

  const targetIndex =
    direction === "prev" ? currentLinkIndex - 1 : currentLinkIndex + 1;

  const disabled =
    !parentData.links ||
    targetIndex < 0 ||
    targetIndex >= parentData.links.length;

  const handleClick = () => {
    if (!disabled) {
      onClick(parentData.links![targetIndex].id);
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{
        padding: "8px",
        backgroundColor: "#f0f0f0",
        border: "1px solid #ddd",
        borderRadius: "4px",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
      }}
      disabled={disabled}
    >
      {direction === "prev" ? "←" : "→"}
    </button>
  );
};
