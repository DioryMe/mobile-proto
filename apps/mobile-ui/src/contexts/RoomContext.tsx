import React, { createContext, useContext, useState, ReactNode } from "react";
import { DioryData } from "../Diory";
import diographJson from "../diograph.json";

interface RoomContextType {
  dioryId: string;
  setDioryId: (id: string) => void;
  diograph: Record<string, DioryData>;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export function RoomProvider({ children }: { children: ReactNode }) {
  const [dioryId, setDioryId] = useState<string>("/");

  const value = {
    dioryId,
    setDioryId,
    diograph: diographJson as unknown as Record<string, DioryData>,
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
