"use client";
import * as React from "react";
import { createContext, useContext, useState } from "react";

type UIContextType = {
  isPostModalOpen: boolean;
  openPostModal: () => void;
  closePostModal: () => void;
};

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  const openPostModal = () => setIsPostModalOpen(true);
  const closePostModal = () => setIsPostModalOpen(false);

  return (
    <UIContext.Provider value={{ isPostModalOpen, openPostModal, closePostModal }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
}
