import { Diograph } from "@diograph/diograph";

export const OpenInNewWindow = ({
  diograph,
  dioryId,
}: {
  diograph: Diograph | null | undefined;
  dioryId: string;
}) => {
  return (
    diograph && (
      <button
        onClick={() => {
          const img = diograph.getDiory({ id: dioryId }).image;
          const html = `
                      <html>
                        <body style="margin:0;display:flex;justify-content:center;align-items:center;background:#000">
                          <img src="${img}" style="max-width=100vw;height:90vh;object-fit:contain">
                        </body>
                      </html>
                    `;
          const newWindow = window.open();
          newWindow?.document.write(html);
        }}
        style={{
          padding: "8px 16px",
          backgroundColor: "#f0f0f0",
          border: "1px solid #ddd",
          borderRadius: "4px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
        }}
      >
        <span>⤢</span>
      </button>
    )
  );
};
