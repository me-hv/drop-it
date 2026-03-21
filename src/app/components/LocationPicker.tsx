"use client";
import React, { useState } from "react";

export default function LocationPicker({ onClose, onConfirm }: { onClose: () => void, onConfirm: (location: string) => void }) {
  const [search, setSearch] = useState("");
  
  // Fake list of locations for demo
  const locations = [
    "New York, NY", "Los Angeles, CA", "London, UK", "Tokyo, Japan", 
    "Paris, France", "Sydney, Australia", "Mumbai, India", "Toronto, Canada",
    "San Francisco, CA", "Berlin, Germany", "Amsterdam, Netherlands"
  ].filter(l => l.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[200] flex justify-center items-center bg-white/10 backdrop-blur-sm p-4">
       <div className="bg-[#15181c] w-full max-w-[500px] rounded-2xl flex flex-col shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden border border-white/20 h-[500px]">
          
          {/* Header */}
          <div className="flex items-center gap-6 px-4 py-3 border-b border-white/10">
             <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
             </button>
             <h2 className="text-[20px] font-bold text-white">Tag Location</h2>
          </div>

          <div className="p-4 flex-1 flex flex-col">
             <div className="relative mb-4">
                <svg viewBox="0 0 24 24" width="18" height="18" className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" stroke="currentColor" strokeWidth="2.5" fill="none"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Search places" 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-[#202327] text-white placeholder-white/40 rounded-full py-2.5 pl-10 pr-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary border border-transparent transition-colors text-[15px]" 
                />
             </div>

             <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
                {search && (
                   <button onClick={() => onConfirm(search)} className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors border-b border-white/5 text-left">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0 text-white">
                         <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                      </div>
                      <div className="flex flex-col">
                         <span className="text-white font-bold text-[15px]">Use "{search}"</span>
                         <span className="text-white/40 text-[13px]">Custom location</span>
                      </div>
                   </button>
                )}
                {locations.map(loc => (
                   <button key={loc} onClick={() => onConfirm(loc)} className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors border-b border-white/5 text-left">
                      <div className="w-10 h-10 rounded-full bg-[#202327] flex items-center justify-center shrink-0 text-white/80">
                         <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                      </div>
                      <div className="flex flex-col">
                         <span className="text-white font-bold text-[15px]">{loc}</span>
                      </div>
                   </button>
                ))}
             </div>
          </div>
       </div>
    </div>
  );
}
