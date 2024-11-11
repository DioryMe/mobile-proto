import React, { createContext, useContext, useState, ReactNode } from "react";
import { DioryData } from "../Diory";
import diographJson from "../diograph.json";

interface RoomContextType {
  dioryId: string;
  setDioryId: (id: string) => void;
  diograph: Record<string, DioryData>;
  setDiograph: (diograph: Record<string, DioryData>) => void;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export function RoomProvider({ children }: { children: ReactNode }) {
  const [dioryId, setDioryId] = useState<string>("/");
  const [diograph, setDiograph] = useState<Record<string, DioryData>>(
    diographJson as unknown as Record<string, DioryData>
  );

  const value = {
    dioryId,
    setDioryId,
    diograph,
    setDiograph,
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
