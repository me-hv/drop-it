"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import DropCard from "@/app/components/DropCard";
import Link from "next/link";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [results, setResults] = useState<{ users: any[], drops: any[] }>({ users: [], drops: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "people" | "drops">("all");

  useEffect(() => {
    if (query) {
      fetchResults();
    }
  }, [query]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query || "")}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      }
    } catch (err) {
      console.error("Search fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Scanning Frequency...</p>
      </div>
    );
  }

  const hasResults = results.users.length > 0 || results.drops.length > 0;

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Header / Tabs */}
      <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-xl border-b border-white/[0.05]">
        <div className="px-6 py-4">
          <h1 className="text-xl font-black uppercase tracking-tighter">Results for "{query}"</h1>
        </div>
        <div className="flex px-2">
          {["all", "people", "drops"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${
                activeTab === tab ? "text-primary" : "text-white/20 hover:text-white/40"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
        {!hasResults ? (
          <div className="flex flex-col items-center justify-center p-20 text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/[0.05] flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-white/10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-black uppercase tracking-tight">No signals found</h2>
              <p className="text-[11px] text-white/20 uppercase font-black tracking-widest mt-1">Try searching for something else</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.05]">
            {(activeTab === "all" || activeTab === "people") && results.users.length > 0 && (
              <div className="py-4">
                {activeTab === "all" && (
                   <div className="px-6 py-2 mb-2">
                     <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">People</h2>
                   </div>
                )}
                <div className="divide-y divide-white/[0.03]">
                  {results.users.map((user) => (
                    <Link 
                      key={user.id} 
                      href={`/profile/${user.handle.replace('@', '')}`}
                      className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors group"
                    >
                      <div className="w-12 h-12 rounded-full bg-slate-800 border border-white/10 overflow-hidden shrink-0">
                        {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : (user.name?.[0] || 'U')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <h3 className="font-black text-white group-hover:text-primary transition-colors truncate uppercase tracking-tight">{user.name}</h3>
                          <svg viewBox="0 0 24 24" width="14" height="14" className="text-primary shrink-0"><path fill="currentColor" d="M22.5 12.5c0-1.58-.88-2.95-2.18-3.66c.15-.55.23-1.12.23-1.71c0-3.37-2.73-6.11-6.11-6.11c-.58 0-1.14.08-1.69.23C12.04 2.12 11.08 1.5 10 1.5c-1.5 0-2.73 1.08-2.97 2.5c-.5-.13-1.02-.2-1.56-.2C2.73 3.8 0 6.53 0 9.9c0 .59.08 1.16.23 1.71c-1.3.71-2.18 2.08-2.18 3.66c0 1.58.88 2.95 2.18 3.66c-.15.55-.23-1.12-.23-1.71c0 3.37 2.73 6.11 6.11 6.11c.58 0 1.14-.08 1.69-.23c.71 1.13 1.94 1.87 3.34 1.87c1.5 0 2.73-1.08 2.97-2.5c.5.13 1.02.2 1.56.2c3.37 0 6.11-2.73 6.11-6.11c0-.59-.08-1.16-.23-1.71c1.3-.71 2.18-2.08 2.18-3.66zM17.06 9L10 16.06L6.94 13L8.06 11.94L10 13.88l5.94-5.94L17.06 9z" /></svg>
                        </div>
                        <p className="text-[11px] text-white/30 uppercase font-black tracking-widest truncate">@{user.handle}</p>
                      </div>
                      <button className="px-5 py-2 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all rounded-full">
                        Follow
                      </button>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {(activeTab === "all" || activeTab === "drops") && results.drops.length > 0 && (
              <div className="py-4">
                {activeTab === "all" && (
                   <div className="px-6 py-2 mb-2">
                     <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Drops</h2>
                   </div>
                )}
                <div>
                  {results.drops.map((drop) => (
                    <DropCard key={drop.id} drop={drop} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <React.Suspense fallback={
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Initializing Search...</p>
      </div>
    }>
      <SearchContent />
    </React.Suspense>
  );
}
