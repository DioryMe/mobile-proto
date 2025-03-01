import React, { useEffect, useState } from "react";
import { fetchContent } from "../hooks/fetchData";
import { useDiosphereContext } from "../contexts/DiosphereContext";

function Content({
  roomId = "myDioryRoom",
}: {
  roomId?: "myDioryRoom" | "browseRoom";
}) {
  const {
    [roomId]: { diograph, focusId },
  } = useDiosphereContext();
  const [contentPayload, setContentPayload] = useState<any>(null);
  const [loading, setLoading] = useState<any>(false);

  const diory = diograph && diograph.getDiory({ id: focusId });
  const CID = diory && diory.data && diory.data[0].contentUrl;
  const mimeType = diory && diory.data && diory.data[0].encodingFormat;

  useEffect(() => {
    if (CID) {
      try {
        setLoading(true);
        fetchContent(`/room/content?CID=${CID}&mime=${mimeType}`)
          .then((response: any) => response.blob())
          .then((blob) => {
            const url = URL.createObjectURL(blob);
            setContentPayload(url);
            setLoading(false);
          });
      } catch (error) {
        console.log("error", error);
      }
    } else {
      setContentPayload(null);
    }
  }, []);

  return contentPayload ? (
    <div data-test-id="content">
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {mimeType?.startsWith("image") && (
          <img src={contentPayload} width="200" />
        )}
        {mimeType?.startsWith("video") && (
          <video src={contentPayload} controls width="200" />
        )}
        {mimeType?.startsWith("audio") && (
          <audio src={contentPayload} controls />
        )}
      </div>
    </div>
  ) : loading ? (
    <img src="/loadicon.gif" width="32px"></img>
  ) : (
    <div data-test-id="no-content-available">No content available</div>
  );
}

export default Content;
