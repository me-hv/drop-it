"use client";
import React from "react";
import { useUI } from "@/app/context/UIContext";
import PostBox from "./PostBox";

export default function PostModal() {
  const { isPostModalOpen, closePostModal } = useUI();

  if (!isPostModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={closePostModal}
      />
      
      <div className="relative w-full max-w-[600px] bg-background rounded-[1.5rem] shadow-2xl animate-in fade-in zoom-in-95 duration-200 border border-white/10">
        <div className="px-6 py-4 flex items-center justify-between border-b border-white/5">
          <button onClick={closePostModal} className="text-[15px] font-medium text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
          <span className="font-extrabold text-[17px]">New Thread</span>
          <div className="w-12"></div>
        </div>
        
        <div className="p-6">
            <PostBox isModal />
        </div>
      </div>
    </div>
  );
}
