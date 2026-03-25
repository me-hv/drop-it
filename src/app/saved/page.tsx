"use client";

import { useEffect, useState } from "react";
import DropCard, { DropShape } from "@/app/components/DropCard";

export default function SavedPage() {
  const [drops, setDrops] = useState<DropShape[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSavedDrops();
  }, []);

  async function loadSavedDrops() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/drops/saved");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load saved drops");
      setDrops(data as DropShape[]);
    } catch (e: any) {
      setError(e.message || "Could not load bookmarks. Refresh or check server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/5 pb-0">
         <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-xl font-black tracking-tighter uppercase italic">SAVED SIGNALS</h1>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-primary" />
               <span className="text-[10px] font-black text-primary uppercase tracking-widest">Bookmarked Frequencies</span>
            </div>
         </div>
      </header>

      {/* Feed */}
      <div className="flex flex-col">
        {loading && (
          <div className="flex flex-col items-center justify-center p-12 gap-4">
             <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
             <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">Accessing Vault</p>
          </div>
        )}
        {error && <p className="text-red-500 p-8 text-center font-bold tracking-widest text-[10px] uppercase">{error}</p>}

        {!loading && drops.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 space-y-6 text-center mt-8">
             <div className="w-32 h-32 rounded-none bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center text-5xl shadow-2xl border border-white/5 opacity-40 backdrop-blur-sm grayscale">
               <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
             </div>
             <div>
               <p className="text-white/40 font-bold uppercase tracking-[0.3em] text-[10px] mb-2">The Archive is Empty</p>
               <p className="text-white/10 font-bold uppercase tracking-widest text-[8px]">Save signals from your feed to see them here.</p>
             </div>
          </div>
        ) : (
          drops.map((drop) => <DropCard key={drop.id} drop={drop} />)
        )}
      </div>
    </main>
  );
}
