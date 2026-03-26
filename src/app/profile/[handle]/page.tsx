"use client";

import { useEffect, useState } from "react";
import DropCard, { DropShape } from "@/app/components/DropCard";
import ProfileHeader from "@/app/components/ProfileHeader";
import { useParams } from "next/navigation";

export default function UserProfilePage() {
  const params = useParams();
  const handle = params.handle as string;
  const [user, setUser] = useState<any>(null);
  const [drops, setDrops] = useState<DropShape[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    async function loadData() {
      if (!handle) return;
      try {
        const res = await fetch(`/api/users/${handle}`);
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setDrops(data.drops || []);
        } else {
          console.error("Failed to load user profile:", await res.text());
        }
      } catch (e) {
        console.error("Failed to load profile data:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [handle]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="animate-pulse tracking-widest text-primary text-sm font-black uppercase">Syncing Frequency...</div>
    </div>
  );
  
  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white/40 font-black uppercase tracking-widest">
      Signal Lost: User Not Found
    </div>
  );

  const filteredDrops = drops.filter(d => {
    if (activeTab === "All") return true;
    if (activeTab === "Audio") return d.mediaType === "audio";
    if (activeTab === "Video") return d.mediaType === "video";
    if (activeTab === "Images") return d.mediaType === "image";
    if (activeTab === "Text") return !d.mediaType && d.text;
    return true;
  });

  return (
    <div className="min-h-screen bg-black pb-20">
      <ProfileHeader initialUser={user} />

      {/* Stats Bar */}
      <div className="flex gap-8 px-6 py-5 bg-white/[0.02] border-y border-white/5">
         <div className="flex flex-col">
            <span className="text-xl font-black text-white">{user._count?.drops || 0}</span>
            <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-black">Signals</span>
         </div>
         <div className="flex flex-col border-l border-white/5 pl-8">
            <span className="text-xl font-black text-white">{user._count?.followers || 0}</span>
            <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-black">Nodes</span>
         </div>
      </div>

      {/* Profile Tabs */}
      <div className="flex border-b border-white/5 px-2 bg-black/50 backdrop-blur-md sticky top-0 z-20 overflow-x-auto no-scrollbar">
         {["All", "Audio", "Video", "Images", "Text"].map((tab) => (
           <div 
             key={tab} 
             onClick={() => setActiveTab(tab)}
             className={`flex-1 min-w-[80px] text-center py-4 font-black text-[11px] px-2 uppercase tracking-widest cursor-pointer hover:bg-white/5 transition-all relative ${activeTab === tab ? 'text-white' : 'text-white/20'}`}
           >
              {tab}
              {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-primary shadow-[0_0_15px_rgba(255,85,0,0.5)]" />}
           </div>
         ))}
      </div>

      {/* Feed */}
      <div className="divide-y divide-white/5">
        {filteredDrops.length === 0 ? (
          <div className="p-20 text-center text-white/10 font-black tracking-[0.3em] text-xs uppercase">
             No {activeTab.toLowerCase()} signals detected
          </div>
        ) : (
          filteredDrops.map(drop => <DropCard key={drop.id} drop={drop} />)
        )}
      </div>
    </div>
  );
}
