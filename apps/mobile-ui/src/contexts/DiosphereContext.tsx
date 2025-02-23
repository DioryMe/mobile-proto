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

interface Diograph {
  new (diographJson: IDiographObject): Diograph;
}

interface DiosphereContextType {
  myDioryRoom: {
    setRoomId: (roomId: string) => void;
    setFocusId: (focusId: string) => void;
  };
  browseRoom: {
    setRoomId: (roomId: string) => void;
    setFocusId: (focusId: string) => void;
  };
  loading: boolean;
  error: string | null;
  cancelFetch: () => void;
}

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

  // My Diory diograph
  useEffect(() => {
    if (myDioryDiographJson) {
      setMyDioryDiograph(new Diograph(myDioryDiographJson));
      // TODO: myDioryInfo
    }
  }, [myDioryDiographJson]);

  // Browse diograph
  useEffect(() => {
    if (browseDiographJson) {
      setBrowseDiograph(new Diograph(browseDiographJson));
      // TODO: browseInfo
    }
  }, [browseDiographJson]);

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
    if (myDioryDiographError) {
      setError(
        (error || "") + " myDioryDiograph:(" + myDioryDiographError + ") "
      );
    }
    if (browseDiographError) {
      setError((error || "") + " browseDiograph:(" + browseDiographError);
    }
    if (!browseDiographError && !myDioryDiographError) {
      setError(null);
    }
  }, [browseDiographError, myDioryDiographError]);

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
