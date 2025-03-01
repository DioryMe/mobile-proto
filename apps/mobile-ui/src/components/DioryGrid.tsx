import React, { useEffect, useState } from "react";
import Diory from "../Diory";
import { ParentDioryLink } from "../ParentDioryLink";
import { useNavigate } from "react-router-dom";
import { useDiosphereContext } from "../contexts/DiosphereContext";

function DioryGrid({ roomId }: { roomId: "myDioryRoom" | "browseRoom" }) {
  const {
    [roomId]: {
      setStoryId,
      setFocusId,
      focusId,
      focus,
      storyId,
      stories,
      diograph,
    },
  } = useDiosphereContext();

  const navigate = useNavigate();

  const handleDioryClick = (dioryId: string) => {
    setFocusId(dioryId);
  };

  const handleStoryChange = (newStoryId: string) => {
    setStoryId(newStoryId);
  };

  return (
    <div>
      {stories.length !== 0 && (
        <div>
          <div style={{ display: "flex", gap: "8px", margin: "8px 0" }}>
            {storyId && (
              <ParentDioryLink
                diograph={diograph}
                onClick={handleDioryClick}
                parentDiories={stories}
                parentId={storyId}
                onParentChange={handleStoryChange}
              />
            )}
          </div>
          <div style={{ display: "flex", gap: "8px", margin: "8px 0" }}>
            {/* <NavigationButton
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
            /> */}
          </div>
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <Diory
          dioryId={focusId}
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
        disabled={!(focus.data?.contentUrl || false)}
        onClick={() => navigate("/content")}
      >
        See content
      </button>
    </div>
  );
}

export default DioryGrid;
