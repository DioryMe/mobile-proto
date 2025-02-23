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
import { getDioryInfo } from "../diographUtils/dioryInfo";

interface RoomContextType {
  setRoomId: (roomId: string) => void;
  setFocusId: (focusId: string) => void;
  diograph: Diograph | null;
}

interface DiosphereContextType {
  myDioryRoom: RoomContextType;
  browseRoom: RoomContextType;
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
  const [myDioryInfo, setMyDioryInfo] = useState<RoomContextType | {}>({});
  // Browse room
  const [browseFocusId, setBrowseFocusId] = useState<string>("/");
  const [browseDiograph, setBrowseDiograph] = useState<Diograph | null>(null);
  const [browseRoomId, setBrowseRoomId] = useState("demo");
  const [browseInfo, setBrowseInfo] = useState<RoomContextType | {}>({});

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
      setMyDioryInfo(getDioryInfo(myDioryDiographJson));
    }
  }, [myDioryDiographJson]);

  // Browse diograph
  useEffect(() => {
    if (browseDiographJson) {
      setBrowseDiograph(new Diograph(browseDiographJson));
      setBrowseInfo(getDioryInfo(browseDiographJson));
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
    myDioryRoom: {
      setRoomId: setMyDioryRoomId,
      setFocusId: setMyDioryFocusId,
      ...myDioryInfo,
    } as RoomContextType, // TODO: Remove me
    browseRoom: {
      setRoomId: setBrowseRoomId,
      setFocusId: setBrowseFocusId,
      ...browseInfo,
    } as RoomContextType, // TODO: Remove me
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
