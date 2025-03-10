import React, { useEffect, useState } from "react";
import Diory from "../Diory";
import { ParentDioryLink } from "../ParentDioryLink";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDiosphereContext } from "../contexts/DiosphereContext";
import { NavigationButton } from "../NavigationButton";

function DioryGrid() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const roomId = pathname.startsWith("/my-diory")
    ? "myDioryRoom"
    : "browseRoom";

  const {
    [roomId]: {
      setStoryId,
      setFocusId,
      focus,
      focusId,
      storyId,
      stories,
      diograph,
    },
  } = useDiosphereContext();

  const handleDioryClick = (dioryId: string) => {
    setFocusId && setFocusId(dioryId);
  };

  const handleStoryChange = (newStoryId: string) => {
    setStoryId && setStoryId(newStoryId);
  };

  return (
    <div>
      {stories.length !== 0 && storyId && (
        <div>
          <div style={{ display: "flex", gap: "8px", margin: "8px 0" }}>
            {
              <ParentDioryLink
                diograph={diograph}
                onClick={handleDioryClick}
                parentDiories={stories}
                parentId={storyId}
                onParentChange={handleStoryChange}
              />
            }
          </div>
          <div style={{ display: "flex", gap: "8px", margin: "8px 0" }}>
            <NavigationButton
              direction="prev"
              parentId={storyId}
              diograph={diograph}
              dioryId={focusId}
              onClick={handleDioryClick}
            />
            <NavigationButton
              direction="next"
              parentId={storyId}
              diograph={diograph}
              dioryId={focusId}
              onClick={handleDioryClick}
            />
          </div>
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <Diory
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
        onClick={() => navigate(`content?storyId=${storyId}`)}
      >
        See content
      </button>
    </div>
  );
}

export default DioryGrid;
