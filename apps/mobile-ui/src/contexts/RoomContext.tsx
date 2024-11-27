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
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export function RoomProvider({ children }: { children: ReactNode }) {
  const [dioryId, setDioryId] = useState<string>("/");
  const [diograph, setDiograph] = useState<Diograph | null>(null);
  const [roomId, setRoomId] = useState("demo");

  const diographJson = useFetchData<IDiographObject>(
    `/room/${roomId}/diograph`
  );

  useEffect(() => {
    if (diographJson) {
      setDiograph(new Diograph(diographJson));
    }
  }, [diographJson]);

  const value = {
    dioryId,
    setDioryId,
    diograph,
    setDiograph,
    roomId,
    setRoomId,
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
