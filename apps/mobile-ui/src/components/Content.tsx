import React, { useEffect, useState } from "react";
import { useRoomContext } from "../contexts/RoomContext";
import { fetchContent } from "../hooks/useFetchData";

function Content() {
  const { diograph, dioryId } = useRoomContext();
  const [contentPayload, setContentPayload] = useState<any>(null);

  const diory = diograph && diograph.getDiory({ id: dioryId });
  const CID = diory && diory.data && diory.data[0].contentUrl;
  const mimeType = diory && diory.data && diory.data[0].encodingFormat;

  useEffect(() => {
    if (CID) {
      try {
        fetchContent(`/room/content?CID=${CID}&mime=${mimeType}`)
          .then((response: any) => response.blob())
          .then((blob) => {
            const url = URL.createObjectURL(blob);
            setContentPayload(url);
          });
      } catch (error) {
        console.log("error", error);
      }
    } else {
      setContentPayload(null);
    }
  }, [dioryId]);

  return (
    <div>
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
  );
}

export default Content;
