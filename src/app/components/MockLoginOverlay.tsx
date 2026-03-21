"use client";
import { useState, useEffect } from "react";

export default function MockLoginOverlay() {
  const [handle, setHandle] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("drops_handle");
    if (!saved) {
      setIsLoggedIn(false);
    }
  }, []);

  if (!mounted || isLoggedIn) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle.trim()) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/auth/mock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle }),
      });
      
      if (res.ok) {
        localStorage.setItem("drops_handle", handle);
        setIsLoggedIn(true);
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent transform transition-all duration-700 hover:scale-105">DROP IT</h1>
          <p className="text-muted-foreground font-bold tracking-widest text-[11px] uppercase">Drop anything. Anytime.</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70 ml-1">Choose a minimal username</label>
            <input 
              type="text" 
              placeholder="e.g. thecreator" 
              value={handle}
              onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white placeholder-white/30 outline-none focus:border-purple-500 transition-colors"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full rounded-xl mt-2 bg-gradient-to-r from-purple-600 to-blue-600 p-4 font-bold text-white transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/20 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Entering..." : "Drop In"}
          </button>
        </form>
      </div>
    </div>
  );
}
