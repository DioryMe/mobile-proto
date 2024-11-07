import React from "react";

export interface DioryData {
  text: string;
  image?: string;
  links?: { id: string }[];
  created: string;
  modified: string;
  id: string;
}

export interface DioryProps {
  dioryId: string;
  setDioryId: (id: string) => void;
  diograph: { [key: string]: DioryData };
}

const Diory = ({ dioryId, setDioryId, diograph }: DioryProps) => {
  // Get diory data based on dioryId
  const dioryData = diograph[dioryId];

  // Check if dioryData exists
  if (!dioryData) {
    return <div>Diory not found</div>;
  }

  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "10px",
        margin: "10px",
        borderRadius: "8px",
        textAlign: "center" as const,
      }}
    >
      {/* Main content */}
      <div style={{ marginBottom: "10px" }}>
        {dioryData.image && (
          <img
            src={dioryData.image}
            alt={dioryData.text}
            style={{
              width: "50px",
              height: "50px",
              objectFit: "cover" as const,
              borderRadius: "50%",
            }}
          />
        )}
        <h3>{dioryData.text}</h3>
      </div>

      {/* Links */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          flexWrap: "wrap" as const,
        }}
      >
        {dioryData.links?.map((link) => (
          <button key={link.id} onClick={() => setDioryId(link.id)}>
            {diograph[link.id].text}
          </button>
        ))}
      </div>
    </div>
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
