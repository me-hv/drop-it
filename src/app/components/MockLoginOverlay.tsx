"use client";
import { useState, useEffect } from "react";

export default function MockLoginOverlay() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [handle, setHandle] = useState("");
  const [password, setPassword] = useState("");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle.trim()) return;
    
    setLoading(true);
    try {
      // Mock auth logic remains handle-based for simplicity
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#08080a] px-4 overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--primary)_0%,_transparent_70%)] opacity-10 animate-pulse" />
         <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="w-full max-w-4xl flex flex-col md:flex-row bg-black border border-white/10 shadow-[0_0_50px_rgba(0,0,0,1)] relative z-10 overflow-hidden">
        
        {/* Left Side: Brand Visuals */}
        <div className="w-full md:w-1/2 p-12 bg-primary flex flex-col justify-between relative overflow-hidden group">
           <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
           
           <div className="relative z-10">
              <div className="w-16 h-16 bg-black border border-white/10 flex items-center justify-center mb-8 shadow-2xl">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="3">
                  <path d="M12 2v20m-5-5h10l-5-10m0 0v10"/>
                </svg>
              </div>
              <h1 className="text-6xl font-black tracking-tighter text-black uppercase leading-none italic">DROP<br/>IT</h1>
              <p className="mt-4 text-black/60 font-black tracking-[0.4em] text-[10px] uppercase">Join the Global Frequency</p>
           </div>

           <div className="relative z-10 mt-20 md:mt-0">
              <div className="flex gap-1 h-8 items-end">
                {Array.from({length: 20}).map((_, i) => (
                  <div key={i} className="flex-1 bg-black/20" style={{ height: `${20 + Math.random() * 80}%` }} />
                ))}
              </div>
              <p className="mt-4 text-[9px] font-black text-black/40 uppercase tracking-widest border-t border-black/10 pt-4">Authenticating Musician Protocol_v4.2</p>
           </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center bg-[#0c0c0e] relative">
           <div className="mb-10 flex justify-between items-end border-b border-white/5 pb-6">
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">
                {isLogin ? "Welcome Back" : "Join Flow"}
              </h2>
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary font-black text-[10px] tracking-widest uppercase hover:opacity-100 opacity-60 transition-opacity"
              >
                {isLogin ? "Register Account" : "Return to Log In"}
              </button>
           </div>

           <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black tracking-[0.3em] text-white/30 uppercase ml-1 transition-colors group-focus-within:text-primary">E-Mail Address</label>
                  <input 
                    type="email" 
                    placeholder="artist@flow.io" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-none border border-white/5 bg-white/[0.02] p-4 text-white placeholder-white/10 outline-none focus:border-primary/40 focus:bg-white/[0.04] transition-all font-medium"
                    required={!isLogin}
                  />
                </div>
              )}

              <div className="space-y-2 group">
                <label className="text-[10px] font-black tracking-[0.3em] text-white/30 uppercase ml-1 transition-colors group-focus-within:text-primary">
                   {isLogin ? "Username or Email" : "Choose Username"}
                </label>
                <input 
                  type="text" 
                  placeholder={isLogin ? "handle@flow.io" : "min_handle"} 
                  value={handle}
                  onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  className="w-full rounded-none border border-white/5 bg-white/[0.02] p-4 text-white placeholder-white/10 outline-none focus:border-primary/40 focus:bg-white/[0.04] transition-all font-medium"
                  required
                />
              </div>

              <div className="space-y-2 group">
                <label className="text-[10px] font-black tracking-[0.3em] text-white/30 uppercase ml-1 transition-colors group-focus-within:text-primary">Security Frequency (Password)</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-none border border-white/5 bg-white/[0.02] p-4 text-white placeholder-white/10 outline-none focus:border-primary/40 focus:bg-white/[0.04] transition-all font-medium"
                  required
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-primary p-5 font-black text-black uppercase tracking-[0.3em] text-xs transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,85,0,0.3)] active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-primary/10"
                >
                  {loading ? "Decrypting..." : isLogin ? "Release Dashboard" : "Sync With Flow"}
                </button>
              </div>

              {isLogin && (
                <div className="mt-6 flex justify-center">
                   <button type="button" className="text-[9px] font-black text-white/10 uppercase tracking-widest hover:text-white/40 transition-colors">Forgot Access Keys?</button>
                </div>
              )}
           </form>

           {/* Scanline Effect Overlay for the Form Panel */}
           <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]" />
        </div>
      </div>

      {/* Decorative Corner Elements */}
      <div className="absolute bottom-10 right-10 flex gap-4 opacity-10">
         <div className="w-12 h-1 bg-white" />
         <div className="w-2 h-1 bg-white" />
      </div>
    </div>
  );
}
