import React, { useEffect, useState } from "react";
import { useDiosphereContext } from "./contexts/DiosphereContext";
import { useLocation } from "react-router-dom";
import { IDiory, IDioryObject } from "@diograph/diograph/types";

interface DioryProps {
  onClick: any;
}

const Diory = ({ onClick }: DioryProps) => {
  const { pathname } = useLocation();
  const roomId = pathname.startsWith("/my-diory")
    ? "myDioryRoom"
    : "browseRoom";

  const [diory, setDiory] = useState<any | null>(null);

  const {
    [roomId]: { focus },
  } = useDiosphereContext();

  useEffect(() => {
    console.log("BOO", focus);
    setDiory(focus);
  }, [focus]);

  return (
    diory && (
      <div
        style={{
          border: "1px solid #ddd",
          padding: "20px",
          margin: "10px",
          borderRadius: "8px",
          textAlign: "center" as const,
          backgroundImage: diory.image ? `url(${diory.image})` : "none",
          minHeight: "330px",
          width: "450px",
          position: "relative",
        }}
      >
        {/* Main content */}
        <div
          style={{
            marginBottom: "10px",
            position: "relative",
            zIndex: 1,
            color: "white",
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          <h3>{diory.text}</h3>
        </div>

        {/* Add a semi-transparent overlay to ensure text readability */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: "8px",
          }}
        />

        {/* Links */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            flexWrap: "wrap" as const,
            position: "relative",
            zIndex: 1,
          }}
        >
          {diory.linkedDiories.map((link) => (
            <button
              key={link.id}
              data-test-id={`diory-link-${link.id}`}
              onClick={() => onClick(link.id)}
              style={{
                backgroundImage: link.image ? `url(${link.image})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundColor: "rgba(255,255,255,0.9)",
                padding: "5px 10px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                minWidth: "100px",
                minHeight: "50px",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0,0,0,0.3)",
                  borderRadius: "4px",
                }}
              />
              <span
                style={{
                  position: "relative",
                  zIndex: 1,
                  color: "white",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                }}
              >
                {link.text}
              </span>
            </button>
          ))}
        </div>
      </div>
    )
  );
};

// Styling (for demonstration; adjust as needed)
const styles = {
  dioryContainer: {
    border: "1px solid #ddd",
    padding: "10px",
    margin: "10px",
    borderRadius: "8px",
    textAlign: "center",
  },
  mainContent: {
    marginBottom: "10px",
  },
  linksContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  image: {
    width: "50px",
    height: "50px",
    objectFit: "cover",
    borderRadius: "50%",
  },
  linkItem: {
    cursor: "pointer", // Indicate the link is clickable
    border: "1px solid #aaa",
    borderRadius: "5px",
    padding: "5px",
    transition: "transform 0.1s",
  },
};

export default Diory;
