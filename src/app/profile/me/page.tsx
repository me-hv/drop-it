"use client";

import { useEffect, useState } from "react";
import DropCard, { DropShape } from "@/app/components/DropCard";
import ProfileHeader from "@/app/components/ProfileHeader";

export default function MyProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [drops, setDrops] = useState<DropShape[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    async function loadData() {
      try {
        const [userRes, dropsRes] = await Promise.all([
          fetch("/api/users/me"),
          fetch("/api/drops")
        ]);

        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData);
          
          if (dropsRes.ok) {
            const allDrops = await dropsRes.json();
            setDrops(allDrops.filter((d: DropShape) => d.author.handle === userData.handle));
          }
        }
      } catch (e) {
        console.error("Failed to load profile data:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center animate-pulse tracking-widest text-primary text-sm font-bold uppercase">Loading frequencies...</div>;
  if (!user) return <div className="min-h-screen flex items-center justify-center text-red-500">Error: Could not sync profile.</div>;

  const filteredDrops = drops.filter(d => {
    if (activeTab === "All") return true;
    if (activeTab === "Audio") return d.mediaType === "audio";
    if (activeTab === "Video") return d.mediaType === "video";
    if (activeTab === "Images") return d.mediaType === "image";
    if (activeTab === "Text") return !d.mediaType && d.text;
    return true;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <ProfileHeader initialUser={user} />

      {/* Stats Bar */}
      <div className="flex gap-8 px-6 py-4 bg-white/[0.02] border-y border-white/5 shadow-inner">
         <div className="flex flex-col">
            <span className="text-xl font-black text-white">{user.totalDrops || 0}</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Total Drops</span>
         </div>
         <div className="flex flex-col">
            <span className="text-xl font-black text-primary flex items-center gap-1">
               {user.streak || 0} 
               <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-0.5"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            </span>
            <span className="text-[10px] text-primary/70 uppercase tracking-widest font-black">Day Streak</span>
         </div>
      </div>

      {/* Profile Tabs */}
      <div className="flex border-b border-white/5 px-2 mt-2 overflow-x-auto no-scrollbar">
         {["All", "Audio", "Video", "Images", "Text"].map((tab) => (
           <div 
             key={tab} 
             onClick={() => setActiveTab(tab)}
             className={`flex-1 min-w-[75px] text-center py-4 font-black text-[11px] px-2 uppercase tracking-widest cursor-pointer hover:bg-white/5 transition-all relative ${activeTab === tab ? 'text-white' : 'text-muted-foreground/60'}`}
           >
              {tab}
              {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-lg shadow-[0_0_10px_rgba(29,155,240,0.5)]" />}
           </div>
         ))}
      </div>

      {/* Feed */}
      <div className="divide-y divide-white/5">
        {filteredDrops.length === 0 ? (
          <div className="p-12 text-center text-white/40 font-bold tracking-widest text-sm uppercase mt-4">
             No {activeTab.toLowerCase()} drops found
          </div>
        ) : (
          filteredDrops.map(drop => <DropCard key={drop.id} drop={drop} />)
        )}
      </div>
    </div>
  );
}
