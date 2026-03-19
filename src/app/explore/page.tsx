"use client";

import React from "react";

const TRENDING_ITEMS = [
  { id: 1, title: "Miami RedHawks", category: "Sports", time: "Hot", images: ["/avatar1.png", "/avatar2.png"] },
  { id: 2, title: "Survivor 50", category: "Entertainment", time: "9h ago", images: ["/avatar3.png", "/avatar4.png"] },
  { id: 3, title: "Mina Shirakawa", category: "Sports", time: "8h ago", images: ["/avatar1.png", "/avatar3.png"] },
  { id: 4, title: "AEW Dynamite", category: "Entertainment", time: "9h ago", images: ["/avatar2.png", "/avatar4.png"] },
  { id: 5, title: "Liverpool FC", category: "Sports", time: "13h ago", images: ["/avatar1.png", "/avatar4.png"] },
];

export default function ExplorePage() {
  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full max-w-[1000px] mx-auto py-6">
      {/* Middle Column: Feed & Search */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Search Bar */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground/60 group-focus-within:text-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
          <input 
            type="text" 
            placeholder="Search for posts, users, or feeds"
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-[15px] focus:bg-white/[0.05] focus:border-primary outline-none transition-all placeholder:text-muted-foreground/40"
          />
        </div>

        {/* Trending List */}
        <div className="flex flex-col border border-white/5 rounded-2xl bg-white/[0.01] overflow-hidden">
          {TRENDING_ITEMS.map((item, idx) => (
            <div 
              key={item.id} 
              className={`p-4 flex items-center justify-between hover:bg-white/[0.03] cursor-pointer transition-colors ${idx !== TRENDING_ITEMS.length - 1 ? 'border-b border-white/5' : ''}`}
            >
              <div className="flex items-start gap-4">
                <span className="text-muted-foreground/40 font-black text-lg mt-0.5">{item.id}.</span>
                <div className="flex flex-col">
                  <span className="font-bold text-[16px] group-hover:underline">{item.title}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex -space-x-2">
                       <div className="h-4 w-4 rounded-full bg-gray-500 border border-black" />
                       <div className="h-4 w-4 rounded-full bg-gray-400 border border-black" />
                    </div>
                    <span className="text-xs text-muted-foreground/60">{item.category}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                {item.time === "Hot" ? (
                  <span className="bg-red-500/10 text-red-500 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c-.017 1.13-.062 1.956-.169 3.016a7.513 7.513 0 0 0-4.665 4.665C6.111 11.737 6 12.87 6 14a6 6 0 0 0 12 0c0-1.13-.111-2.263-1.166-4.319a7.513 7.513 0 0 0-4.665-4.665C12.062 3.956 12.017 3.13 12 2z"/></svg>
                    Hot
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground/40 font-medium">{item.time}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Discover New Feeds Header */}
        <div className="flex items-center justify-between mt-4">
           <div className="flex items-center gap-2">
              <div className="text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 21 1.9-1.9"/><path d="M20.9 5a8 8 0 0 0-11-2.9L8.2 3a8 8 0 0 0-3 11l1.9 1.9"/><circle cx="16" cy="16" r="3"/><path d="m19.8 19.8 1.9 1.9"/></svg>
              </div>
              <h2 className="text-lg font-bold">Discover new feeds</h2>
           </div>
           <button className="text-muted-foreground hover:text-foreground">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
           </button>
        </div>

        {/* Feed Preview Item */}
        <div className="p-5 border border-white/5 rounded-2xl bg-white/[0.01] hover:bg-white/[0.03] transition-colors cursor-pointer flex flex-col gap-3 group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z"/><path d="m12 6-3 3 3 3 3-3-3-3z"/><path d="m12 18-3-3 3-3 3 3-3 3z"/></svg>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[17px] group-hover:underline">404 Media</span>
                <span className="text-sm text-muted-foreground/60">Feed by @jasonkoebler.bsky.social</span>
              </div>
            </div>
            <button className="bg-primary hover:opacity-90 px-4 py-1.5 rounded-full text-white text-sm font-bold flex items-center gap-2 transition-all shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m12 2 3 5h6l-4.5 4.5L18 18l-6-3.5L6 18l1.5-6.5L3 7h6l3-5z"/></svg>
              Pin feed
            </button>
          </div>
          <p className="text-[14px] text-muted-foreground/80 leading-relaxed font-medium">
            Articles, videos, podcasts and conversations posted by 404 Media's journalists
          </p>
        </div>
      </div>

      {/* Right Column: Navigation */}
      <div className="hidden lg:flex flex-col gap-8 w-64 shrink-0">
        <div className="flex flex-col gap-1">
          {[
            { icon: "🔥", label: "Discover", active: true },
            { icon: "👥", label: "Following", active: false },
            { icon: "📺", label: "Video", active: false },
          ].map((nav) => (
            <button 
              key={nav.label}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-bold text-[15px] ${nav.active ? 'bg-primary/10 text-primary' : 'hover:bg-white/5 text-muted-foreground hover:text-foreground'}`}
            >
              <span className="text-lg">{nav.icon}</span>
              {nav.label}
            </button>
          ))}
          <button className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/5 text-muted-foreground hover:text-foreground transition-all font-bold text-[15px]">
            <span className="text-lg text-muted-foreground/40">+</span>
            More feeds
          </button>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-2 px-4 text-[13px] text-muted-foreground/40 font-medium whitespace-nowrap">
          <a href="#" className="hover:underline">Feedback</a>
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">Terms</a>
          <a href="#" className="hover:underline">Help</a>
        </div>
      </div>
    </div>
  );
}
