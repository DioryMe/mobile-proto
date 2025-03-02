import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Diograph } from "@diograph/diograph";
import { IDiographObject } from "@diograph/diograph/types";
import useFetchData from "../hooks/useFetchData";
import { DioryInfo, getDioryInfo } from "../diographUtils/dioryInfo";
import { isAuthenticated } from "../App";
import { useLocation, useNavigate, useParams } from "react-router-dom";

interface RoomContextType extends DioryInfo {
  setRoomId: (roomId: string) => void;
  setFocusId: (focusId: string) => void;
  setStoryId: (storyId: string | null) => void;
}

type RoomIdType = "myDioryRoom" | "browseRoom";

interface DiosphereContextType {
  roomId: RoomIdType;
  myDioryRoom: RoomContextType;
  browseRoom: RoomContextType;
  loading: boolean;
  error: string | null;
  cancelFetch: () => void;
}

const defaultRoomContextValues: RoomContextType = {
  setRoomId: () => {},
  setFocusId: () => {},
  setStoryId: () => {},
  diograph: null,
  focusId: "/",
  storyId: null,
  story: null,
  stories: [],
  prev: null,
  next: null,
  focus: {
    text: null,
    image: null,
    latlng: null,
    date: null,
    links: [],
    linkedDiories: [],
    data: null,
  },
  focusDiory: null,
  relatedGeo: [],
  relatedTime: [],
  relatedStories: [],
  delete: () => {},
  link: () => {},
  edit: () => {},
};

const diosphereContextDefaultValues: DiosphereContextType = {
  roomId: "myDioryRoom",
  myDioryRoom: defaultRoomContextValues,
  browseRoom: defaultRoomContextValues,
  loading: false,
  error: null,
  cancelFetch: () => {},
};

const DiosphereContext = createContext<DiosphereContextType>(
  diosphereContextDefaultValues
);

export function DiosphereProvider({ children }: { children: ReactNode }) {
  // TODO: This doesn't work...only in Browse.tsx
  const { focusId } = useParams();

  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const query = new URLSearchParams(search);
  const storyId = query.get("storyId");

  // Room
  const [roomId, setRoomId] = useState<RoomIdType | null>(null);

  // My Diory room
  const [myDioryFocusId, setMyDioryFocusId] = useState<string>("/");
  const [myDioryDiograph, setMyDioryDiograph] = useState<Diograph | null>(null);
  const [myDioryRoomId, setMyDioryRoomId] = useState("native");
  const [myDioryInfo, setMyDioryInfo] = useState<DioryInfo>(
    diosphereContextDefaultValues.myDioryRoom
  );
  const [myDioryStoryId, setMyDioryStoryId] = useState<string | null>(null);
  // Browse room
  const [browseFocusId, setBrowseFocusId] = useState<string>("/");
  const [browseDiograph, setBrowseDiograph] = useState<Diograph | null>(null);
  const [browseRoomId, setBrowseRoomId] = useState("demo");
  const [browseInfo, setBrowseInfo] = useState<DioryInfo>(
    diosphereContextDefaultValues.myDioryRoom
  );
  const [browseStoryId, setBrowseStoryId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Custom setter functions to update state and URL
  const updateMyDioryFocusId = (focusId: string) => {
    setMyDioryFocusId(focusId);
    navigate(
      `/my-diory/${focusId}${myDioryStoryId ? `?storyId=${myDioryStoryId}` : ""}`
    );
  };

  const updateBrowseFocusId = (focusId: string) => {
    setBrowseFocusId(focusId);
    navigate(
      `/browse/${focusId}${browseStoryId ? `?storyId=${browseStoryId}` : ""}`
    );
  };

  // Load My Diory room
  const {
    result: myDioryDiographJson,
    loading: myDioryDiographLoading,
    error: myDioryDiographError,
    // fetch: fetchMyDioryDiograph,
    cancelFetch: cancelMyDioryDiographFetch,
  } = useFetchData<IDiographObject>(`/room/${myDioryRoomId}/diograph`);

  // Load Browse room
  const {
    result: browseDiographJson,
    loading: browseDiographLoading,
    error: browseDiographError,
    // fetch: fetchBrowseDiograph,
    cancelFetch: cancelBrowseDiographFetch,
  } = useFetchData<IDiographObject>(`/room/${browseRoomId}/diograph`);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }

    if (pathname.startsWith("/my-diory")) {
      setRoomId("myDioryRoom");
      if (focusId) {
        setMyDioryFocusId(focusId);
      }
      if (storyId) {
        setMyDioryStoryId(storyId);
      }
    }

    if (pathname.startsWith("/browse")) {
      setRoomId("browseRoom");
      if (focusId) {
        setBrowseFocusId(focusId);
      }
      if (storyId) {
        setBrowseStoryId(storyId);
      }
    }
  }, [pathname, search]);

  // My Diory diograph
  useEffect(() => {
    if (myDioryDiographJson && Object.keys(myDioryDiographJson).length > 0) {
      setMyDioryDiograph(new Diograph(myDioryDiographJson));
    }
  }, [myDioryDiographJson]);

  // My Diory diory info
  useEffect(() => {
    if (myDioryDiograph) {
      try {
        setMyDioryInfo(
          getDioryInfo(myDioryDiograph, myDioryFocusId, myDioryStoryId)
        );
      } catch (error) {
        console.log("getDioryInfo failed: ", error);
        setMyDioryInfo(getDioryInfo(myDioryDiograph, "/"));
        navigate("/my-diory");
      }
    }
  }, [myDioryDiograph, myDioryFocusId, myDioryStoryId]);

  // Browse diograph
  useEffect(() => {
    if (browseDiographJson && Object.keys(browseDiographJson).length > 0) {
      setBrowseDiograph(new Diograph(browseDiographJson));
    }
  }, [browseDiographJson]);

  // Browse diory info
  useEffect(() => {
    if (browseDiograph) {
      try {
        setBrowseInfo(
          getDioryInfo(browseDiograph, browseFocusId, browseStoryId)
        );
      } catch (error) {
        console.log("getDioryInfo failed: ", error);
        setBrowseInfo(getDioryInfo(browseDiograph, "/"));
        navigate("/browse");
      }
    }
  }, [browseDiograph, browseFocusId, browseStoryId]);

  // Loading
  useEffect(() => {
    if (browseDiographLoading || myDioryDiographLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [browseDiographLoading, myDioryDiographLoading]);

  // Error
  useEffect(() => {
    if (!browseDiographError && !myDioryDiographError) {
      setError(null);
    }

    const myDioryErrorText = `myDioryDiograph: ${myDioryDiographError}`;
    const browseErrorText = `browseDiograph: ${browseDiographError}`;
    let errorText;
    if (myDioryDiographError && browseDiographError) {
      errorText = `${myDioryErrorText}, ${browseErrorText}`;
    } else if (myDioryDiographError) {
      errorText = myDioryErrorText;
    } else if (browseDiographError) {
      errorText = browseErrorText;
    }
    setError(errorText || null);
  }, [browseDiographError, myDioryDiographError]);

  const value = {
    roomId,
    myDioryRoom: {
      setRoomId: setMyDioryRoomId,
      setFocusId: updateMyDioryFocusId,
      setStoryId: setMyDioryStoryId,
      ...myDioryInfo,
    },
    browseRoom: {
      setRoomId: setBrowseRoomId,
      setFocusId: updateBrowseFocusId,
      setStoryId: setBrowseStoryId,
      ...browseInfo,
    },
    loading,
    error,
    cancelFetch: () => {
      cancelMyDioryDiographFetch();
      cancelBrowseDiographFetch();
    },
  };

  return (
    <DiosphereContext.Provider value={value}>
      {children}
    </DiosphereContext.Provider>
  );
}

export function useDiosphereContext() {
  const context = useContext(DiosphereContext);
  if (context === undefined) {
    throw new Error(
      "useDiosphereContext must be used within a DiosphereProvider"
    );
  }
  return context;
}
