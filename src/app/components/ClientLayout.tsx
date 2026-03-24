"use client";
import React from "react";
import { useUI } from "@/app/context/UIContext";
import SideDock from "./SideDock";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { isSidebarCollapsed } = useUI();

  return (
    <div className="min-h-screen w-full bg-background flex justify-start pl-2 lg:pl-6">
      {/* 
          Left-Aligned Master Container:
          Locking Sidebar, Feed, and Widgets to the far left corner.
      */}
      <div className="flex justify-start max-w-full">
        
        {/* 
            Left Column (Sidebar Gutter):
            Fixed width to prevent feed shift. 
            Aligned to the right to hug the feed.
        */}
        <header className="flex-1 lg:flex-none lg:w-[275px] h-screen sticky top-0 z-40 flex justify-start border-r border-white/5 bg-black lg:bg-transparent">
          <div className={`h-full transition-all duration-300 flex flex-col bg-black border-r border-white/5 lg:border-none ${
            isSidebarCollapsed ? "w-[72px]" : "w-[275px]"
          }`}>
            <SideDock />
          </div>
        </header>

        {/* 
            Middle Column (Main Feed):
            Stationary fixed width, restored to wide (600px) as requested.
        */}
        <main className="w-full max-w-[600px] min-h-screen border-x border-white/5 bg-background relative z-0">
          {children}
        </main>

        {/* 
            Right Column (Widgets):
            Balanced whitespace on larger screens.
        */}
        <div className="hidden xl:block w-[350px] p-4 flex-shrink-0">
          <div className="sticky top-4">
             {/* Trending Section Concept */}
             <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-md">
                <h3 className="font-black text-lg mb-4 italic tracking-tight">LIVE UPDATES</h3>
                <div className="space-y-4 opacity-40">
                   <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse" />
                   <div className="h-4 bg-white/10 rounded w-1/2 animate-pulse" />
                   <div className="h-4 bg-white/10 rounded w-5/6 animate-pulse" />
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
