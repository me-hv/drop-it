"use client";
import React from "react";
import { useUI } from "@/app/context/UIContext";
import SideDock from "./SideDock";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { isSidebarCollapsed } = useUI();

  return (
    <div className="h-screen w-full bg-[#0a0a0c] text-white relative overflow-hidden flex">
      {/* 
          Left Column (Menu/Sidebar):
          25% width, Sharp Industrial Sidebar
      */}
      <header className="w-[25%] h-full p-2 hidden md:block border-r border-white/5 bg-transparent">
        <div className="h-full glass rounded-none overflow-y-auto no-scrollbar border-0">
          <SideDock />
        </div>
      </header>

      {/* 
          Middle Column (Main Feed / Releases):
          50% width, Clean Static Area
      */}
      <main className="w-full md:w-[50%] h-full overflow-y-auto no-scrollbar relative z-0 border-r border-white/5">
        <div className="min-h-full bg-transparent">
          {children}
        </div>
      </main>

      {/* 
          Right Column (Charts / Trending):
          25% width, Sharp Aside
      */}
      <aside className="w-[25%] h-full p-6 hidden lg:block bg-transparent">
        <div className="h-full overflow-y-auto no-scrollbar">
           <div className="sticky top-0 bg-transparent pb-6">
              <h3 className="font-bold text-xs mb-8 tracking-[0.4em] uppercase text-white/40">Chart Toppers</h3>
              <div className="space-y-8">
                 {[
                   { tag: "#FrequencyRevolution", category: "Global Chart", stats: "12.4K Drops", color: "text-primary" },
                   { tag: "#NewSingle", category: "Trending in Indie", stats: "8.2K Drops", color: "text-primary" },
                   { tag: "#StudioLife", category: "Artist Updates", stats: "5.1K Drops", color: "text-primary" },
                   { tag: "#VinylGems", category: "Collectors", stats: "2.9K Drops", color: "text-primary" }
                 ].map((item, i) => (
                   <div key={i} className="group cursor-pointer">
                      <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] mb-1.5">{item.category}</p>
                      <h4 className={`font-black text-lg group-hover:scale-105 transition-transform duration-300 origin-left ${item.color}`}>{item.tag}</h4>
                      <p className="text-[10px] text-white/20 uppercase mt-1 px-2 py-0.5 bg-white/5 rounded-full inline-block font-bold">🔥 {item.stats}</p>
                   </div>
                 ))}
              </div>
           </div>

           {/* Newsletter / Meta */}
           <div className="mt-12 pt-8 border-t border-white/5">
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-black text-white/10 uppercase tracking-tighter">
                 <span className="hover:text-primary cursor-pointer transition-colors">TOS</span>
                 <span className="hover:text-primary cursor-pointer transition-colors">Privacy</span>
                 <span className="hover:text-primary cursor-pointer transition-colors">Cookies</span>
                 <span className="hover:text-primary cursor-pointer transition-colors">Ads</span>
                 <span className="mt-4 block w-full text-white/[0.05]">© 2026 DROP IT - ALL RIGHTS RESERVED.</span>
              </div>
           </div>
        </div>
      </aside>
    </div>
  );
}
