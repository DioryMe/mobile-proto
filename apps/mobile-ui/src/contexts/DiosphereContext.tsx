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

interface DiosphereContextType {}

const DiosphereContext = createContext<DiosphereContextType | undefined>(
  undefined
);

export function DiosphereProvider({ children }: { children: ReactNode }) {
  // My Diory room
  const [myDioryFocusId, setMyDioryFocusId] = useState<string>("/");
  const [myDioryDiograph, setMyDioryDiograph] = useState<Diograph | null>(null);
  const [myDioryRoomId, setMyDioryRoomId] = useState("native");
  const [myDioryInfo, setMyDioryInfo] = useState({});
  // Browse room
  const [browseFocusId, setBrowseFocusId] = useState<string>("/");
  const [browseDiograph, setBrowseDiograph] = useState<Diograph | null>(null);
  const [browseRoomId, setBrowseRoomId] = useState("demo");
  const [browseInfo, setBrowseInfo] = useState({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    result: myDioryDiographJson,
    loading: myDioryDiographLoading,
    error: myDioryDiographError,
    cancelFetch: cancelMyDioryDiographFetch,
  } = useFetchData<IDiographObject>(`/room/${myDioryRoomId}/diograph`);

  const {
    result: browseDiographJson,
    loading: browseDiographLoading,
    error: browseDiographError,
    cancelFetch: cancelBrowseDiographFetch,
  } = useFetchData<IDiographObject>(`/room/${browseRoomId}/diograph`);

  const value = {
    myDioryRoom: {
      setRoomId: setMyDioryRoomId,
      setFocusId: setMyDioryFocusId,
      ...myDioryInfo,
    },
    browseRoom: {
      setRoomId: setBrowseRoomId,
      setFocusId: setBrowseFocusId,
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
