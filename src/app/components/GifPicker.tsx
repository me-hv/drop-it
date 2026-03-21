"use client";
import React, { useState, useEffect } from "react";

const FALLBACK_GIFS = [
  "https://media.tenor.com/ZtwYw5JbbQQAAAAC/excited-cheer.gif",
  "https://media.tenor.com/kSBEA58FDEkAAAAC/laughing-duck.gif",
  "https://media.tenor.com/mO2HqBms3H8AAAAC/vibing-cat.gif",
  "https://media.tenor.com/ZKGq4n8BfCEAAAAC/sunglasses-cool.gif",
  "https://media.tenor.com/P4E2nN0lD9UAAAAC/mind-blown-explosion.gif",
  "https://media.tenor.com/nJgqC0oT8-sAAAAC/nod-yes.gif",
  "https://media.tenor.com/m27G3P6G01wAAAAC/typing-cat.gif",
  "https://media.tenor.com/Qh0c1zO0E44AAAAC/popcorn-eating.gif",
  "https://media.tenor.com/Gf33qiCGnI0AAAAC/thumbs-up-ryan.gif",
  "https://media.tenor.com/9aAwO8Q5d9MAAAAC/surprised-pikachu.gif"
].map((url, i) => ({ id: String(i), preview: url, original: url }));

export default function GifPicker({ onSelect, onClose }: { onSelect: (url: string) => void, onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [gifs, setGifs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTrending();
  }, []);

  const formatTenorResults = (results: any[]) => {
     if (!results || !Array.isArray(results) || results.length === 0) return FALLBACK_GIFS;
     return results.map((g: any) => ({
        id: g.id,
        preview: g.media[0]?.tinygif?.url || g.media[0]?.gif?.url || FALLBACK_GIFS[0].preview,
        original: g.media[0]?.gif?.url || FALLBACK_GIFS[0].original
     }));
  };

  const fetchTrending = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://g.tenor.com/v1/trending?key=LIVDSRZULELA&limit=24`);
      if (!res.ok) throw new Error("API Limit");
      const data = await res.json();
      setGifs(formatTenorResults(data.results));
    } catch(e) { 
      console.warn("Using fallback GIFs due to API limit.");
      setGifs(FALLBACK_GIFS);
    }
    setLoading(false);
  }

  const handleSearch = async (q: string) => {
    setQuery(q);
    if (!q.trim()) return fetchTrending();
    setLoading(true);
    try {
      const res = await fetch(`https://g.tenor.com/v1/search?q=${encodeURIComponent(q)}&key=LIVDSRZULELA&limit=24`);
      if (!res.ok) throw new Error("API Limit");
      const data = await res.json();
      setGifs(formatTenorResults(data.results));
    } catch(e) {
      console.warn("Using fallback GIFs due to API limit.");
      setGifs(FALLBACK_GIFS);
    }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#15181c] border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] h-[580px]">
        {/* Header */}
        <div className="flex items-center gap-4 p-4 border-b border-white/10">
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white bg-black/50">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          <div className="flex-1 relative">
            <input 
              type="text" 
              autoFocus
              placeholder="Search for GIFs..." 
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-white/5 text-white outline-none placeholder-white/40 font-bold px-5 py-3 rounded-full border border-white/10 focus:border-primary transition-colors focus:ring-2 focus:ring-primary/50" 
            />
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-3 no-scrollbar bg-black/20">
          {loading ? (
             <div className="flex justify-center items-center h-full"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
          ) : (
             <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
               {gifs.map(g => (
                 <img 
                   key={g.id} 
                   src={g.preview} 
                   alt="gif" 
                   onClick={() => onSelect(g.original)}
                   className="w-full h-[120px] object-cover cursor-pointer rounded-lg border-2 border-transparent hover:border-primary transition-all duration-200 hover:scale-[1.02]"
                 />
               ))}
             </div>
          )}
        </div>
        <div className="p-3 text-center text-[10px] text-white/40 font-black tracking-widest uppercase bg-black/60 flex items-center justify-center gap-2 border-t border-white/10">
           <span>⚡ Powered by Tenor</span>
        </div>
      </div>
    </div>
  );
}
