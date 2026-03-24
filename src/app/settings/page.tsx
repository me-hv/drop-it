"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type UserData = {
  name: string;
  bio: string;
  location: string;
  handle: string;
};

export default function SettingsPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData>({
    name: "",
    bio: "",
    location: "",
    handle: ""
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

  // Mocked preferences
  const [prefs, setPrefs] = useState({
    theme: "black",
    accent: "blue",
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
            handle: data.handle || ""
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
    
    // Apply theme/accent logic if needed (e.g. adding classes to body)
    if (updated.theme === "black") {
      document.documentElement.classList.add("dark");
      document.body.style.backgroundColor = "#000000";
    } else {
      document.body.style.backgroundColor = "";
    }
  };

  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus("idle");
    try {
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
    { id: "account", label: "Account", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
    { id: "privacy", label: "Privacy & Safety", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> },
    { id: "appearance", label: "Appearance", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg> },
    { id: "notifications", label: "Notifications", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> },
  ];

  return (
    <div className="min-h-screen bg-black text-white pb-20 max-w-2xl mx-auto border-x border-white/10">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10 p-4 flex items-center gap-6">
        <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-full transition-all active:scale-90">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
        </button>
        <h1 className="text-xl font-black uppercase tracking-tight">Settings</h1>
      </div>

      {/* Main Settings List */}
      <div className="flex flex-col pt-2">
        {CATEGORIES.map((cat) => (
          <button 
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className="flex items-center justify-between p-6 hover:bg-white/5 transition-all group border-b border-line/5 ml-0"
          >
            <div className="flex items-center gap-5">
              <div className="text-white/40 group-hover:text-primary transition-colors">
                {cat.icon}
              </div>
              <span className="text-lg font-bold">{cat.label}</span>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white/20 group-hover:text-white transition-all"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        ))}
      </div>

      {/* Overlays */}
      {activeCategory && (
        <div className="fixed inset-0 z-[100] bg-black animate-in slide-in-from-right duration-300 flex flex-col max-w-2xl mx-auto border-x border-white/10">
          <div className="bg-black/80 backdrop-blur-xl border-b border-white/10 p-4 flex items-center gap-6">
            <button onClick={() => setActiveCategory(null)} className="p-2 hover:bg-white/10 rounded-full transition-all">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
            </button>
            <h1 className="text-xl font-black uppercase tracking-tight">
              {CATEGORIES.find(c => c.id === activeCategory)?.label}
            </h1>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {activeCategory === "account" && (
              <form onSubmit={handleUpdateAccount} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-primary ml-1">Display Name</label>
                    <input 
                      value={userData.name}
                      onChange={(e) => setUserData({...userData, name: e.target.value})}
                      placeholder="What should we call you?"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-primary transition-all font-bold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-primary ml-1">Bio</label>
                    <textarea 
                      value={userData.bio}
                      onChange={(e) => setUserData({...userData, bio: e.target.value})}
                      placeholder="Tell the flow about yourself..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-primary transition-all min-h-[120px] resize-none font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-primary ml-1">Location</label>
                    <input 
                      value={userData.location}
                      onChange={(e) => setUserData({...userData, location: e.target.value})}
                      placeholder="Where in the frequency are you?"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-primary transition-all font-bold"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-5 rounded-2xl bg-primary text-white font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                >
                  {isSaving ? "Syncing..." : "Update Frequency"}
                </button>

                {saveStatus === "success" && <p className="text-emerald-500 text-center font-black animate-bounce">Profile Synced Successfully!</p>}
                {saveStatus === "error" && <p className="text-red-500 text-center font-black">Sync Failed. Try again.</p>}
              </form>
            )}

            {activeCategory === "appearance" && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-4">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-primary">Background</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {["black", "dim", "dark"].map((t) => (
                      <button 
                        key={t}
                        onClick={() => savePrefs({ theme: t })}
                        className={`p-5 rounded-2xl border flex items-center justify-between transition-all ${prefs.theme === t ? 'border-primary bg-primary/5' : 'border-white/10 hover:border-white/20'}`}
                      >
                         <span className="font-bold capitalize">{t === "black" ? "Lights Out" : t}</span>
                         {prefs.theme === t && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-primary">Accent Color</h3>
                  <div className="flex justify-between items-center bg-white/5 p-6 rounded-[2rem] border border-white/10">
                    {["blue", "emerald", "rose", "amber"].map((c) => (
                      <button 
                        key={c}
                        onClick={() => savePrefs({ accent: c })}
                        className={`w-12 h-12 rounded-full transition-all active:scale-75 flex items-center justify-center ${
                          c === "blue" ? "bg-blue-500" :
                          c === "emerald" ? "bg-emerald-500" :
                          c === "rose" ? "bg-rose-500" : "bg-amber-500"
                        } ${prefs.accent === c ? 'ring-4 ring-white ring-offset-4 ring-offset-black' : ''}`}
                      >
                        {prefs.accent === c && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><path d="m5 12 5 5L20 7"/></svg>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeCategory === "privacy" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-black uppercase tracking-tight">Private Flow</p>
                      <p className="text-xs text-white/40 font-medium">Only approved frequencies can view your drops.</p>
                    </div>
                    <button 
                      onClick={() => savePrefs({ private: !prefs.private })}
                      className={`w-14 h-8 rounded-full relative transition-all ${prefs.private ? 'bg-primary' : 'bg-white/10'}`}
                    >
                      <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${prefs.private ? 'left-7' : 'left-1'}`} />
                    </button>
                 </div>
              </div>
            )}

            {activeCategory === "notifications" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-black uppercase tracking-tight">Vibrations</p>
                      <p className="text-xs text-white/40 font-medium">Get notified when someone interacts with your frequency.</p>
                    </div>
                    <button 
                      onClick={() => savePrefs({ notifications: !prefs.notifications })}
                      className={`w-14 h-8 rounded-full relative transition-all ${prefs.notifications ? 'bg-primary' : 'bg-white/10'}`}
                    >
                      <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${prefs.notifications ? 'left-7' : 'left-1'}`} />
                    </button>
                 </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
