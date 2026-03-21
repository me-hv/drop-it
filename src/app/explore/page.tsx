"use client";
import React, { useEffect, useState } from "react";
import DropCard, { DropShape } from "@/app/components/DropCard";

export default function ExplorePage() {
  const [trendingDrops, setTrendingDrops] = useState<DropShape[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    async function loadTrending() {
      try {
        const res = await fetch("/api/drops");
        if (res.ok) {
          const data: DropShape[] = await res.json();
          // Sort by saves + reDrops
          const sorted = data.sort((a, b) => (b.saves + b.reDrops) - (a.saves + a.reDrops));
          setTrendingDrops(sorted);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadTrending();
  }, []);

  const filtered = trendingDrops.filter(d => {
    const matchesSearch = 
      d.caption?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      d.text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.author.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.vibe.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (activeTab === "Audio") return d.mediaType === "audio";
    if (activeTab === "Video") return d.mediaType === "video";
    if (activeTab === "Images") return d.mediaType === "image";
    if (activeTab === "Text") return !d.mediaType && d.text;
    return true;
  });

  return (
    <div className="min-h-screen py-4 pb-24">
      <div className="px-4 mb-4 mt-2">
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
          <input 
            type="text" 
            placeholder="Search vibes, keywords, or creators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-12 pr-4 text-[15px] font-medium focus:bg-white/10 focus:border-primary outline-none transition-all placeholder:text-white/30 text-white shadow-inner"
          />
        </div>
      </div>

      {/* Explore Tabs */}
      <div className="flex border-b border-white/5 px-2 mb-6 overflow-x-auto no-scrollbar">
         {["All", "Audio", "Video", "Images", "Text"].map((tab) => (
           <div 
             key={tab} 
             onClick={() => setActiveTab(tab)}
             className={`flex-1 min-w-[75px] text-center py-4 font-black text-[11px] px-2 uppercase tracking-widest cursor-pointer hover:bg-white/5 transition-all relative ${activeTab === tab ? 'text-primary' : 'text-white/40'}`}
           >
              {tab}
              {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-lg shadow-[0_0_10px_rgba(29,155,240,0.5)]" />}
           </div>
         ))}
      </div>

      <div className="px-6 mb-4 flex items-center gap-3">
         <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-500 to-red-600 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.5)] border border-red-400/30">
           <svg viewBox="0 0 24 24" fill="none" className="w-[18px] h-[18px] stroke-white"><path strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>
         </div>
         <h2 className="text-xl font-black uppercase tracking-widest text-white">Trending {activeTab !== "All" ? activeTab : "Now"}</h2>
      </div>

      <div className="flex flex-col border-t border-white/5">
        {loading ? (
          <p className="text-primary p-8 text-center animate-pulse tracking-widest text-xs font-bold uppercase mt-8">Scanning global frequencies...</p>
        ) : filtered.length === 0 ? (
          <p className="text-white/40 p-12 text-center tracking-widest text-sm uppercase font-bold mt-8">No trending drops found</p>
        ) : (
          filtered.map((drop, idx) => (
             <div key={drop.id} className="relative">
                <div className="absolute top-4 right-4 z-10 font-black text-[50px] text-white/[0.04] leading-none pointer-events-none transition-transform hover:scale-110">
                  #{idx + 1}
                </div>
                <DropCard drop={drop} />
             </div>
          ))
        )}
      </div>
    </div>
  );
}
