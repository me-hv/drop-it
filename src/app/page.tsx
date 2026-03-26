"use client";

import { useEffect, useState } from "react";
import DropCard, { DropShape } from "@/app/components/DropCard";
import PostBox from "@/app/components/PostBox";

export default function HomePage() {
  const [drops, setDrops] = useState<DropShape[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDrops();
  }, []);

  async function loadDrops() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/drops");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load drops");
      setDrops(data as DropShape[]);
    } catch (e: any) {
      setError(e.message || "Could not load feed. Refresh or check server.");
    } finally {
      setLoading(false);
    }
  }

  // Simple feed showing all drops
  const filteredDrops = drops;

  return (
    <main className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/5 pb-0">
         <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-xl font-black tracking-tighter uppercase italic">NEW DROPS</h1>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
               <span className="text-[10px] font-black text-primary uppercase tracking-widest">Live Releases</span>
            </div>
         </div>
      </header>

      <div className="border-b border-white/5">
        <PostBox />
      </div>

      <div className="h-2 bg-gradient-to-b from-white/[0.02] to-transparent border-y border-white/5" />

      {/* Feed */}
      <div className="flex flex-col">
        {loading && (
          <div className="flex flex-col items-center justify-center p-12 gap-4">
             <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
             <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">Processing Frequencies</p>
          </div>
        )}
        {error && <p className="text-red-500 p-8 text-center font-bold">{error}</p>}

        {!loading && filteredDrops.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 space-y-4 text-center mt-8">
             <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center text-4xl shadow-inner border border-white/5 opacity-80 backdrop-blur-sm">🎧</div>
             <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">The flow is currently empty</p>
          </div>
        ) : (
          filteredDrops.map((drop) => <DropCard key={drop.id} drop={drop} />)
        )}
      </div>
    </main>
  );
}
