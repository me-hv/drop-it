"use client";

import React from "react";
import { useUI } from "@/app/context/UIContext";

export default function SimplifiedPostBox() {
  const { openPostModal } = useUI();

  return (
    <div 
      onClick={openPostModal}
      className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-white/5 transition-all border-b border-white/5 group"
    >
      {/* Avatar mockup */}
      <div className="h-10 w-10 rounded-full bg-gray-300 overflow-hidden shrink-0 border border-white/10">
         <div className="w-full h-full bg-blue-500/10 flex items-center justify-center text-xs font-bold text-primary">HV</div>
      </div>
      
      {/* Placeholder Text */}
      <div className="flex-1 text-muted-foreground/60 text-lg">
        What's up?
      </div>
      
      {/* Image Icon */}
      <div className="text-muted-foreground/40 group-hover:text-primary transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
      </div>
    </div>
  );
}
