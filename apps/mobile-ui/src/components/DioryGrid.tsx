import React, { useEffect, useState } from "react";
import Diory from "../Diory";
import { ParentDioryLink } from "../ParentDioryLink";
import { NavigationButton } from "../NavigationButton";
import { IDioryObject } from "@diograph/diograph/types";
import { OpenInNewWindow } from "./OpenInNewWindow";
import { Diograph } from "@diograph/diograph";
import { useNavigate } from "react-router-dom";

function DioryGrid({ diograph }: { diograph?: Diograph | null }) {
  const [dioryId, setDioryId] = useState("/");

  const [parentId, setParentId] = useState<string>("/");
  const [parentDiories, setParentDiories] = useState<[string, IDioryObject][]>(
    []
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (!diograph) {
      return;
    }

    const parentDiories = Object.entries(diograph.toObject()).filter(
      ([_, dioryData]) => dioryData.links?.some((link) => link.id === dioryId)
    );
    const parentDioryId = parentDiories[0]?.[0] || "/";
    setParentId(parentDioryId);
    setParentDiories(parentDiories);
  }, [diograph, dioryId]);

  const handleDioryClick = (dioryId: string) => {
    setDioryId(dioryId);
  };

  const handleParentChange = (newParentId: string) => {
    setParentId(newParentId);
  };

  let CID;
  try {
    const diory = diograph && diograph.getDiory({ id: dioryId });
    CID = diory && diory.data && diory.data[0].contentUrl;
  } catch {}

  return (
    <div>
      {dioryId !== "/" && (
        <div>
          <div style={{ display: "flex", gap: "8px", margin: "8px 0" }}>
            <ParentDioryLink
              diograph={diograph}
              onClick={handleDioryClick}
              parentDiories={parentDiories}
              parentId={parentId}
              onParentChange={handleParentChange}
            />
          </div>
          <div style={{ display: "flex", gap: "8px", margin: "8px 0" }}>
            <NavigationButton
              direction="prev"
              parentId={parentId}
              diograph={diograph}
              dioryId={dioryId}
              onClick={handleDioryClick}
            />
            <NavigationButton
              direction="next"
              parentId={parentId}
              diograph={diograph}
              dioryId={dioryId}
              onClick={handleDioryClick}
            />
            <OpenInNewWindow diograph={diograph} dioryId={dioryId} />
          </div>
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <Diory
          dioryId={dioryId}
          diograph={diograph}
          onClick={(id: string | undefined) => id && handleDioryClick(id)}
        />
      </div>
      {/* <ul>
        <li>Show and play video in "fullscreen"</li>
        <li>
          BUG: Parent diory should persist when navigating (now always selects
          the first story)
        </li>
      </ul> */}
      <button
        data-test-id="see-content"
        disabled={!(CID || false)}
        onClick={() => navigate("/content")}
      >
        See content
      </button>
    </div>
  );
}

export default DioryGrid;
