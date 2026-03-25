"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type UserData = {
  name: string;
  bio: string;
  location: string;
  handle: string;
  email: string;
  address: string;
};

export default function SettingsPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData>({
    name: "",
    bio: "",
    location: "",
    handle: "",
    email: "",
    address: ""
  });
  const [password, setPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

  // Mocked preferences
  const [prefs, setPrefs] = useState({
    theme: "black",
    accent: "orange",
    private: false,
    notifications: true
  });

  useEffect(() => {
    // Fetch real user data
    fetch("/api/users/me")
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setUserData({
            name: data.name || "",
            bio: data.bio || "",
            location: data.location || "",
            handle: data.handle || "",
            email: data.email || `${data.handle}@flow.io`,
            address: data.address || ""
          });
        }
      });

    // Load local prefs
    const savedPrefs = localStorage.getItem("user_prefs");
    if (savedPrefs) {
      setPrefs(JSON.parse(savedPrefs));
    }
  }, []);

  const savePrefs = (newPrefs: any) => {
    const updated = { ...prefs, ...newPrefs };
    setPrefs(updated);
    localStorage.setItem("user_prefs", JSON.stringify(updated));
  };

  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus("idle");
    try {
      // Mocking update with new fields
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      });
      if (res.ok) {
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        setSaveStatus("error");
      }
    } catch (err) {
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  const CATEGORIES = [
    { id: "account", label: "Protocol: Identity", desc: "Sync email, location & keys", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
    { id: "security", label: "Security: Encryption", desc: "Manage access frequencies", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="0" ry="0"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> },
    { id: "appearance", label: "Aesthetic: Interface", desc: "Visual sync & accents", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg> },
    { id: "privacy", label: "Signal: Privacy", desc: "Approved frequencies only", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
  ];

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-slate-200 pb-20 max-w-2xl mx-auto border-x border-white/5 relative overflow-hidden">
      {/* Aesthetic Background Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#0c0c0e]/80 backdrop-blur-md border-b border-white/5 p-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button onClick={() => router.back()} className="hover:text-primary transition-colors active:scale-90">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
          </button>
          <div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter">SETTINGS</h1>
            <p className="text-[10px] font-black tracking-[0.4em] text-white/20 uppercase mt-1">Configure System_v4.2</p>
          </div>
        </div>
        <div className="w-10 h-10 bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black italic">!</div>
      </div>

      {/* Main Settings List */}
      <div className="flex flex-col">
        {CATEGORIES.map((cat) => (
          <button 
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className="flex items-center justify-between p-8 hover:bg-white/[0.02] transition-all group border-b border-white/5 relative"
          >
            <div className="flex items-center gap-6 relative z-10">
              <div className="w-12 h-12 bg-white/[0.03] border border-white/5 flex items-center justify-center text-white/20 group-hover:text-primary group-hover:border-primary/20 transition-all">
                {cat.icon}
              </div>
              <div className="text-left">
                <span className="block text-lg font-black uppercase italic tracking-tight group-hover:text-white transition-colors">{cat.label}</span>
                <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{cat.desc}</span>
              </div>
            </div>
            <div className="w-8 h-8 flex items-center justify-center text-white/10 group-hover:text-primary transition-all group-hover:translate-x-1">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m9 18 6-6-6-6"/></svg>
            </div>
            {/* Hover bar */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-center" />
          </button>
        ))}
      </div>

      {/* Notification Area */}
      <div className="m-8 p-6 bg-primary/5 border border-primary/10 relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-24 h-24 bg-primary opacity-[0.05] blur-3xl rounded-full" />
         <div className="relative z-10">
            <h4 className="text-[10px] font-black text-primary tracking-[0.4em] uppercase mb-2">SYSTEM ALERT</h4>
            <p className="text-xs font-bold text-white/60 leading-relaxed uppercase tracking-tight">Ensure your frequency is synced across all authorized studio devices for maximum protocol efficiency.</p>
         </div>
         <div className="absolute bottom-4 right-4 flex gap-1 items-end h-4">
            {Array.from({length: 8}).map((_, i) => (
              <div key={i} className="w-0.5 bg-primary/20" style={{ height: `${20 + Math.random() * 80}%` }} />
            ))}
         </div>
      </div>

      {/* Overlays */}
      {activeCategory && (
        <div className="fixed inset-0 z-[100] bg-[#0c0c0e] animate-in slide-in-from-right duration-300 flex flex-col max-w-2xl mx-auto border-x border-white/5 shadow-2xl shadow-black relative overflow-hidden">
          {/* Scanline pattern for overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]" />
          
          <div className="bg-[#0c0c0e]/80 backdrop-blur-md border-b border-white/5 p-6 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-6">
              <button onClick={() => setActiveCategory(null)} className="hover:text-primary transition-colors active:scale-90">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
              </button>
              <h1 className="text-xl font-black italic uppercase tracking-tighter">
                {CATEGORIES.find(c => c.id === activeCategory)?.label}
              </h1>
            </div>
            <div className="text-[9px] font-black tracking-widest text-primary bg-primary/10 px-2 py-1 uppercase italic border border-primary/20">LIVE_MODE</div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 relative z-10 scrollbar-thin scrollbar-thumb-white/10">
            {activeCategory === "account" && (
              <form onSubmit={handleUpdateAccount} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2 group">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-1 group-focus-within:text-primary transition-colors">Handle</label>
                      <input 
                        value={userData.handle}
                        disabled
                        className="w-full bg-white/[0.02] border border-white/5 rounded-none p-4 text-white/40 font-bold uppercase tracking-tight cursor-not-allowed"
                      />
                    </div>
                    <div className="space-y-2 group">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-1 group-focus-within:text-primary transition-colors">Display Name</label>
                      <input 
                        value={userData.name}
                        onChange={(e) => setUserData({...userData, name: e.target.value})}
                        placeholder="System_alias"
                        className="w-full bg-white/[0.02] border border-white/5 rounded-none p-4 text-white outline-none focus:border-primary/20 focus:bg-white/[0.04] transition-all font-bold uppercase tracking-tight"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-1 group-focus-within:text-primary transition-colors">E-Mail Frequency</label>
                    <input 
                      type="email"
                      value={userData.email}
                      onChange={(e) => setUserData({...userData, email: e.target.value})}
                      placeholder="artist@flow.io"
                      className="w-full bg-white/[0.02] border border-white/5 rounded-none p-4 text-white outline-none focus:border-primary/20 focus:bg-white/[0.04] transition-all font-bold tracking-tight"
                    />
                  </div>

                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-1 group-focus-within:text-primary transition-colors">Artist Bio</label>
                    <textarea 
                      value={userData.bio}
                      onChange={(e) => setUserData({...userData, bio: e.target.value})}
                      placeholder="Transmission details..."
                      className="w-full bg-white/[0.02] border border-white/5 rounded-none p-4 text-white outline-none focus:border-primary/20 focus:bg-white/[0.04] transition-all min-h-[120px] resize-none font-medium uppercase tracking-tight leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2 group">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-1 group-focus-within:text-primary transition-colors">Location Signal</label>
                      <input 
                        value={userData.location}
                        onChange={(e) => setUserData({...userData, location: e.target.value})}
                        placeholder="Studio_geo"
                        className="w-full bg-white/[0.02] border border-white/5 rounded-none p-4 text-white outline-none focus:border-primary/20 focus:bg-white/[0.04] transition-all font-bold uppercase tracking-tight"
                      />
                    </div>
                    <div className="space-y-2 group">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-1 group-focus-within:text-primary transition-colors">Physical Address</label>
                      <input 
                        value={userData.address}
                        onChange={(e) => setUserData({...userData, address: e.target.value})}
                        placeholder="123 Studio Ln"
                        className="w-full bg-white/[0.02] border border-white/5 rounded-none p-4 text-white outline-none focus:border-primary/20 focus:bg-white/[0.04] transition-all font-bold uppercase tracking-tight"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="w-full py-5 rounded-none bg-primary text-black font-black uppercase tracking-[0.3em] text-xs shadow-xl shadow-primary/10 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {isSaving ? "SYNCING..." : "UPDATE FREQUENCY"}
                  </button>
                  {saveStatus === "success" && <p className="mt-4 text-emerald-500 text-center font-black animate-pulse uppercase text-[10px] tracking-widest">Protocol Updated Successfully</p>}
                  {saveStatus === "error" && <p className="mt-4 text-red-500 text-center font-black uppercase text-[10px] tracking-widest">Update Failed_Retrying</p>}
                </div>
              </form>
            )}

            {activeCategory === "security" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-8 border border-white/5 bg-white/[0.01] relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-12 h-1 bg-primary/20" />
                   <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-6 italic">Security Frequency</h3>
                   <div className="space-y-6">
                     <div className="space-y-2 group">
                       <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-1 group-focus-within:text-primary transition-colors">Rotate Password</label>
                       <input 
                         type="password"
                         value={password}
                         onChange={(e) => setPassword(e.target.value)}
                         placeholder="New_Access_Key"
                         className="w-full bg-white/[0.02] border border-white/5 rounded-none p-4 text-white outline-none focus:border-primary/20 transition-all font-bold tracking-[0.3em]"
                       />
                     </div>
                     <button className="w-full py-4 border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white/5 transition-all">Update Encryption Keys</button>
                   </div>
                </div>

                <div className="p-8 border border-white/5 bg-white/[0.01]">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-4">Authorized Logins</h3>
                   <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-white/[0.02] border border-white/5">
                         <div className="flex items-center gap-4">
                            <div className="w-8 h-8 bg-primary/10 flex items-center justify-center text-primary font-black italic text-xs">W</div>
                            <div>
                               <p className="text-xs font-black uppercase tracking-tight">Windows _Chrome</p>
                               <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Last active: Just now</p>
                            </div>
                         </div>
                         <button className="text-[9px] font-black text-red-500/40 hover:text-red-500 uppercase tracking-widest transition-colors">Revoke</button>
                      </div>
                   </div>
                </div>
              </div>
            )}

            {activeCategory === "appearance" && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary italic">Interface_Base</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {["black", "dim", "dark"].map((t) => (
                      <button 
                        key={t}
                        onClick={() => savePrefs({ theme: t })}
                        className={`p-6 rounded-none border flex items-center justify-between transition-all relative ${prefs.theme === t ? 'border-primary bg-primary/5 text-primary' : 'border-white/5 bg-white/[0.01] hover:border-white/10 text-white/40 hover:text-white'}`}
                      >
                         <span className="font-black uppercase tracking-widest italic">{t === "black" ? "Lights Out" : t}</span>
                         {prefs.theme === t && (
                            <div className="flex gap-1 items-end h-4">
                               {[1,2,3].map(i => <div key={i} className="w-1 bg-primary" style={{height: `${40 + i*20}%`}} />)}
                            </div>
                         )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary italic">Accent_Signal</h3>
                  <div className="flex justify-between items-center bg-white/[0.01] p-8 border border-white/5">
                    {["orange", "blue", "emerald", "rose"].map((c) => (
                      <button 
                        key={c}
                        onClick={() => savePrefs({ accent: c })}
                        className={`w-14 h-14 rounded-none transition-all active:scale-75 flex items-center justify-center relative ${
                          c === "orange" ? "bg-primary" :
                          c === "blue" ? "bg-blue-500" :
                          c === "emerald" ? "bg-emerald-500" : "bg-rose-500"
                        }`}
                      >
                        {prefs.accent === c && (
                           <div className="absolute inset-2 border-2 border-black/40" />
                        )}
                        {prefs.accent === c && <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[8px] font-black text-white uppercase tracking-widest">ACTIVE</div>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeCategory === "privacy" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <div className="p-8 bg-white/[0.01] border border-white/5 flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="font-black uppercase italic tracking-tighter text-lg leading-none">PRYVACY_PROTOCOL</p>
                      <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest leading-relaxed max-w-[200px]">Only authorized orbital frequencies can sync with your drops.</p>
                    </div>
                    <button 
                      onClick={() => savePrefs({ private: !prefs.private })}
                      className={`w-16 h-4 group relative flex items-center ${prefs.private ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className="absolute inset-0 border border-white/10" />
                      <div className={`w-8 h-8 rounded-none transition-all shadow-xl flex items-center justify-center font-black text-[10px] ${prefs.private ? 'bg-primary text-black' : 'bg-white/10 text-white/20'}`}>
                         {prefs.private ? "ON" : "OFF"}
                      </div>
                    </button>
                 </div>

                 <div className="p-8 border border-white/5 bg-white/[0.01] opacity-40">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-4 italic">Signal_Isolation</p>
                    <p className="text-xs font-bold leading-relaxed uppercase tracking-tight">Additional privacy layers are currently being calibrated for Musician_System_v4.5. Requesting early access is currently disabled.</p>
                 </div>
              </div>
            )}
          </div>
          
          {/* Footer Decoration */}
          <div className="p-6 border-t border-white/5 bg-black flex justify-between items-center opacity-20">
             <div className="text-[8px] font-black tracking-widest uppercase">Encryption: AES-256-GCM</div>
             <div className="flex gap-1 h-3 items-end">
                {Array.from({length: 12}).map((_, i) => (
                  <div key={i} className="w-1 bg-white" style={{ height: `${20 + Math.random() * 80}%` }} />
                ))}
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
