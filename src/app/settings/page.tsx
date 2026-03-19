"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type SettingItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  category?: string;
};

export default function SettingsPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const SETTINGS_OPTIONS: SettingItem[] = [
    { 
      id: "account", 
      label: "Account", 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> 
    },
    { 
      id: "privacy", 
      label: "Privacy and security", 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> 
    },
    { 
      id: "moderation", 
      label: "Moderation", 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg> 
    },
    { 
      id: "notifications", 
      label: "Notifications", 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> 
    },
    { 
      id: "content", 
      label: "Content and media", 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M21 12H3"/><path d="M12 3v18"/></svg> 
    },
    { 
      id: "appearance", 
      label: "Appearance", 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z"/></svg> 
    },
    { 
      id: "accessibility", 
      label: "Accessibility", 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/></svg> 
    },
    { 
      id: "languages", 
      label: "Languages", 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> 
    },
    { 
      id: "help", 
      label: "Help", 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> 
    },
    { 
      id: "about", 
      label: "About", 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg> 
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-10">
      {/* Settings Header */}
      <div className="px-4 py-4 flex items-center gap-6 border-b border-white/5 bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-white/5 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>
        <h1 className="text-xl font-bold">Settings</h1>
      </div>

      {/* Profile Section (Mockup Content) */}
      <div className="flex flex-col items-center py-8 px-4 border-b border-white/5">
        <div className="h-24 w-24 rounded-full bg-gray-300 overflow-hidden mb-4 border-2 border-white/10 shadow-xl">
           {/* Harry Verma avatar mockup */}
           <div className="w-full h-full bg-blue-500/20 flex items-center justify-center text-3xl font-bold">HV</div>
        </div>
        <h2 className="text-2xl font-black">Harry Verma</h2>
        <p className="text-muted-foreground text-[15px]">@harryverma.bsky.social</p>
        
        <button className="mt-6 flex items-center gap-2 text-primary hover:bg-primary/10 px-4 py-2 rounded-lg transition-all font-medium text-sm">
           <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/></svg>
           Add another account
        </button>
      </div>

      {/* Settings Options List */}
      <div className="py-2">
        {SETTINGS_OPTIONS.map((item) => (
          <div 
            key={item.id} 
            onClick={() => setActiveCategory(item.id)}
            className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-white/5 group transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="text-muted-foreground group-hover:text-primary transition-colors">
                {item.icon}
              </div>
              <span className="text-[17px] font-medium">{item.label}</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground group-hover:text-foreground transition-all"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        ))}
      </div>

      {/* Footer / Sign Out */}
      <div className="mt-4 border-t border-white/5 pt-2">
         <button className="w-full text-left px-6 py-4 text-red-500 font-bold hover:bg-white/5 transition-all">
           Sign out
         </button>
      </div>

      {/* Category Overlay (Partial Mockup implementation) */}
      {activeCategory && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-background animate-in slide-in-from-right duration-300">
           <div className="px-4 py-4 flex items-center gap-6 border-b border-white/5">
            <button onClick={() => setActiveCategory(null)} className="p-2 rounded-full hover:bg-white/5 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            </button>
            <h1 className="text-xl font-bold">{SETTINGS_OPTIONS.find(o => o.id === activeCategory)?.label}</h1>
          </div>
          <div className="p-8 flex-1 overflow-y-auto">
             {activeCategory === "appearance" ? (
               <div className="max-w-md mx-auto w-full space-y-6">
                 <div className="text-center mb-8">
                   <div className="inline-flex p-4 rounded-full bg-primary/10 text-primary mb-4">
                      {SETTINGS_OPTIONS.find(o => o.id === "appearance")?.icon}
                   </div>
                   <h2 className="text-2xl font-bold">Display</h2>
                   <p className="text-muted-foreground">Manage your color theme and font preferences.</p>
                 </div>
                 
                 <div className="space-y-4">
                   <div className="p-4 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between">
                     <div>
                       <p className="font-bold">Dark Mode</p>
                       <p className="text-sm text-muted-foreground">Force dark aesthetic across TXT.</p>
                     </div>
                     <div className="h-6 w-11 bg-primary rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full" />
                     </div>
                   </div>
                   
                   <div className="p-4 rounded-xl border border-white/10 hover:bg-white/5 flex items-center justify-between cursor-pointer transition-all">
                     <div>
                       <p className="font-bold">Light Mode</p>
                       <p className="text-sm text-muted-foreground">Classic high-contrast light theme.</p>
                     </div>
                     <div className="h-6 w-11 bg-gray-600 rounded-full relative">
                        <div className="absolute left-1 top-1 h-4 w-4 bg-white rounded-full" />
                     </div>
                   </div>
                 </div>

                 <div className="pt-10">
                    <p className="text-xs text-center text-muted-foreground px-10 uppercase tracking-widest font-bold">Draft Feature</p>
                 </div>
               </div>
             ) : (
               <div className="flex flex-col items-center justify-center h-full text-center max-w-sm mx-auto">
                 <div className="mb-4 p-4 rounded-full bg-primary/10 text-primary">
                    {SETTINGS_OPTIONS.find(o => o.id === activeCategory)?.icon}
                 </div>
                 <p className="text-xl font-bold mb-2">{SETTINGS_OPTIONS.find(o => o.id === activeCategory)?.label}</p>
                 <p className="text-muted-foreground">The {activeCategory} management panel is being finalized for the TXT platform.</p>
               </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
}
