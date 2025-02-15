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

interface RoomContextType {
  dioryId: string;
  setDioryId: (id: string) => void;
  nativeDiograph: Diograph | null;
  nativeDiographError: string | null;
  diograph: Diograph | null;
  setDiograph: (diograph: Diograph) => void;
  roomId: string;
  setRoomId: (id: string) => void;
  setLoading: (loading: boolean) => void;
  loading: boolean;
  setError: (error: string | null) => void;
  error: string | null;
  cancelFetch: () => void;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export function RoomProvider({ children }: { children: ReactNode }) {
  const [dioryId, setDioryId] = useState<string>("/");
  const [diograph, setDiograph] = useState<Diograph | null>(null);
  const [nativeDiograph, setNativeDiograph] = useState<Diograph | null>(null);
  const [roomId, setRoomId] = useState("demo");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    result: diographJson,
    loading: diographLoading,
    error: diographError,
    cancelFetch,
  } = useFetchData<IDiographObject>(`/room/${roomId}/diograph`);

  const {
    result: nativeDiographJson,
    loading: nativeDiographLoading,
    error: nativeDiographError,
  } = useFetchData<IDiographObject>(`/room/native/diograph`);

  useEffect(() => {
    if (diographJson) {
      setLoading(false);
      setDiograph(new Diograph(diographJson));
    }
  }, [diographJson]);

  useEffect(() => {
    if (nativeDiographJson) {
      setLoading(false);
      setNativeDiograph(new Diograph(nativeDiographJson));
    }
  }, [nativeDiographJson]);

  useEffect(() => {
    if (diographLoading) {
      setLoading(true);
      setError(null);
    }
    if (diographError) {
      setLoading(false);
      setError("diographError: " + JSON.stringify(diographError));
    }
  }, [diographLoading, diographError]);

  const value = {
    dioryId,
    setDioryId,
    diograph,
    setDiograph,
    nativeDiograph,
    nativeDiographError,
    roomId,
    setRoomId,
    loading,
    setLoading,
    error,
    setError,
    cancelFetch,
  };

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
}

export function useRoomContext() {
  const context = useContext(RoomContext);
  if (context === undefined) {
    throw new Error("useRoomContext must be used within a RoomProvider");
  }
  return context;
}
