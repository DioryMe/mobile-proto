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
  diograph: Diograph | null;
  setDiograph: (diograph: Diograph) => void;
  roomId: string;
  setRoomId: (id: string) => void;
  setLoading: (loading: boolean) => void;
  loading: boolean;
  setError: (error: string | null) => void;
  error: string | null;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export function RoomProvider({ children }: { children: ReactNode }) {
  const [dioryId, setDioryId] = useState<string>("/");
  const [diograph, setDiograph] = useState<Diograph | null>(null);
  const [roomId, setRoomId] = useState("demo");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    result: diographJson,
    loading: diographLoading,
    error: diographError,
  } = useFetchData<IDiographObject>(`/room/${roomId}/diograph`);

  useEffect(() => {
    if (diographJson) {
      setLoading(false);
      setDiograph(new Diograph(diographJson));
    }
  }, [diographJson]);

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
    roomId,
    setRoomId,
    loading,
    setLoading,
    error,
    setError,
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
