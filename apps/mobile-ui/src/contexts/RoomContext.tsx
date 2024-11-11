import React, { createContext, useContext, useState, ReactNode } from "react";
import { DioryData } from "../Diory";
import diographJson from "../diograph.json";
import { Diograph } from "@diograph/diograph";

interface RoomContextType {
  dioryId: string;
  setDioryId: (id: string) => void;
  diograph: Diograph;
  setDiograph: (diograph: Diograph) => void;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export function RoomProvider({ children }: { children: ReactNode }) {
  const [dioryId, setDioryId] = useState<string>("/");
  const [diograph, setDiograph] = useState<Diograph>(
    new Diograph(diographJson)
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
