"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DropCard, { DropShape } from "@/app/components/DropCard";

export default function DropDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [drop, setDrop] = useState<DropShape | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDrop() {
      try {
        const res = await fetch(`/api/drops/${params.id}`);
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to load drop");
        }
        const data = await res.json();
        setDrop(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDrop();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-24 gap-4">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">Decoding Signal</p>
      </div>
    );
  }

  if (error || !drop) {
    return (
      <div className="p-12 text-center flex flex-col items-center gap-6">
        <div className="text-4xl">📡</div>
        <h2 className="text-xl font-black uppercase italic tracking-tighter">Signal Lost</h2>
        <p className="text-white/40 text-xs font-bold uppercase tracking-widest">{error || "Drop not found in this frequency"}</p>
        <button 
          onClick={() => router.back()}
          className="px-8 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
        >
          Return to Feed
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-6 px-6 py-4">
          <button 
            onClick={() => router.back()}
            className="text-white/40 hover:text-white transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-black tracking-tighter uppercase italic">DROP DETAIL</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto border-x border-white/5 min-h-screen bg-black">
        <DropCard drop={drop} isDetail={true} />
      </div>
    </main>
  );
}
