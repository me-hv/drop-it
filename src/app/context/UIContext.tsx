"use client";
import React from "react";

type UIContextType = {
  isPostModalOpen: boolean;
  openPostModal: () => void;
  closePostModal: () => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
};

const UIContext = React.createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [isPostModalOpen, setIsPostModalOpen] = React.useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(true);

  const openPostModal = () => setIsPostModalOpen(true);
  const closePostModal = () => setIsPostModalOpen(false);
  const toggleSidebar = () => setIsSidebarCollapsed((prev: boolean) => !prev);

  return (
    <UIContext.Provider value={{ isPostModalOpen, openPostModal, closePostModal, isSidebarCollapsed, toggleSidebar }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = React.useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
}
