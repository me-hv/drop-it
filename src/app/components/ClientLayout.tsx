"use client";
import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUI } from "@/app/context/UIContext";
import SideDock from "./SideDock";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { isSidebarCollapsed } = useUI();
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const isMessagesPage = pathname === "/messages";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="h-screen w-full bg-[#000000] text-white relative overflow-hidden flex">
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
          50% width normally, 75% on messages
      */}
      <main className={`${isMessagesPage ? 'md:w-[75%]' : 'md:w-[50%]'} w-full h-full overflow-y-auto no-scrollbar relative z-0 border-r border-white/5 transition-all duration-500`}>
        <div className="min-h-full bg-transparent">
          {children}
        </div>
      </main>

      {/* 
          Right Column (Charts / Trending):
          25% width, Hidden on messages
      */}
      {!isMessagesPage && (
        <aside className="w-[25%] h-full p-4 lg:p-6 hidden lg:block bg-transparent animate-in slide-in-from-right duration-500 overflow-y-auto no-scrollbar">
          <div className="h-full space-y-6">
            {/* Global Search Bar */}
            <form onSubmit={handleSearch} className="sticky top-0 bg-[#000000]/80 backdrop-blur-xl pb-4 z-10 -mx-6 px-6">
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-primary transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="SEARCH DROP IT..." 
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-none py-2.5 pl-11 pr-4 text-[10px] font-black tracking-[0.1em] placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all uppercase"
                />
              </div>
            </form>

            {/* Trending Section */}
            <div className="glass-card rounded-none p-6 bg-transparent border border-white/[0.05]">
              <h3 className="font-black text-[10px] mb-6 tracking-[0.4em] uppercase text-white/40 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-none bg-primary animate-pulse"></span>
                What's Happening
              </h3>
              
              <div className="space-y-6">
                {[
                  { tag: "#FrequencyRevolution", category: "Global Chart", stats: "12.4K Drops", sub: "Trending in EDM" },
                  { tag: "#NewSingle", category: "Trending in Indie", stats: "8.2K Drops", sub: "Artist Update" },
                  { tag: "#StudioLife", category: "Artist Updates", stats: "5.1K Drops", sub: "Live Session" },
                  { tag: "#VinylGems", category: "Collectors", stats: "2.9K Drops", sub: "Marketplace" }
                ].map((item, i) => (
                  <div key={i} className="group cursor-pointer border-b border-white/[0.03] last:border-0 pb-4 last:pb-0">
                    <div className="flex justify-between items-start mb-0.5">
                      <p className="text-[8px] text-white/20 font-black uppercase tracking-[0.1em]">{item.category}</p>
                      <button className="text-white/10 hover:text-white/40 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                        </svg>
                      </button>
                    </div>
                    <h4 className="font-black text-sm text-white group-hover:text-primary transition-colors tracking-tight">{item.tag}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-[9px] text-white/30 uppercase font-bold tracking-tighter shrink-0">{item.stats}</p>
                      <span className="w-[2px] h-[2px] rounded-none bg-white/10"></span>
                      <p className="text-[9px] text-white/10 uppercase font-medium tracking-tighter truncate italic">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 pt-4 border-t border-white/[0.03] text-[9px] font-black text-primary hover:text-primary/70 uppercase tracking-widest text-left transition-colors">
                Show more
              </button>
            </div>

            {/* Newsletter / Meta */}
            <div className="px-6 py-4">
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-[8px] font-black text-white/10 uppercase tracking-tighter">
                <span className="hover:text-primary cursor-pointer transition-colors">TOS</span>
                <span className="hover:text-primary cursor-pointer transition-colors">Privacy</span>
                <span className="hover:text-primary cursor-pointer transition-colors">Cookies</span>
                <span className="hover:text-primary cursor-pointer transition-colors">Ads</span>
                <span className="mt-4 block w-full text-white/[0.03] font-medium tracking-normal select-none capitalize italic">© 2026 DROP IT - ALL RIGHTS RESERVED.</span>
              </div>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
