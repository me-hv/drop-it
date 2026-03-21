"use client";

import React, { useState, useRef, useEffect } from "react";

export type DropShape = {
  id: string;
  text?: string | null;
  mediaUrl?: string | null;
  mediaType?: string | null;
  duration: number;
  vibe: string;
  caption: string;
  createdAt: string;
  saves: number;
  reDrops: number;
  tips: number;
  pollOptions?: string | null;
  pollEndsAt?: string | null;
  location?: string | null;
  isPinned: boolean;
  author: { name: string; id: string; handle: string };
};

export default function DropCard({ drop: initialDrop }: { drop: DropShape }) {
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(initialDrop.text || "");
  const [isPinned, setIsPinned] = useState(initialDrop.isPinned);
  const [currentText, setCurrentText] = useState(initialDrop.text || initialDrop.caption);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const carouselRef = useRef<HTMLDivElement>(null);

  const userHandle = typeof window !== "undefined" ? localStorage.getItem("drops_handle") : null;
  const isOwner = userHandle === initialDrop.author.handle;

  const nextMedia = (e: React.MouseEvent, max: number) => {
    e.stopPropagation();
    setCurrentIndex((currentIndex + 1) % max);
  };
 
  const prevMedia = (e: React.MouseEvent, max: number) => {
    e.stopPropagation();
    setCurrentIndex((currentIndex - 1 + max) % max);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to drop this from the timeline forever?")) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/drops/${initialDrop.id}`, { method: "DELETE" });
      if (res.ok) {
        window.location.reload(); 
      } else {
        const d = await res.json();
        alert(d.error || "Failed to delete post.");
        setIsDeleting(false);
      }
    } catch (err) {
      alert("Error deleting post.");
      setIsDeleting(false);
    }
  };

  const handleTogglePin = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const newPinnedStatus = !isPinned;
    setIsPinned(newPinnedStatus); // Optimistic UI
    setShowMenu(false);

    try {
      const res = await fetch(`/api/drops/${initialDrop.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPinned: newPinnedStatus })
      });
      if (!res.ok) {
        setIsPinned(!newPinnedStatus); // Revert on failure
        const d = await res.json();
        alert(d.error || "Failed to pin post.");
      }
    } catch (err) {
      setIsPinned(!newPinnedStatus);
      alert("Error pinning post.");
    }
  };

  const handleSaveEdit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/drops/${initialDrop.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: editText })
      });
      if (res.ok) {
        setCurrentText(editText);
        setIsEditing(false);
      } else {
        const d = await res.json();
        alert(d.error || "Failed to save changes");
      }
    } catch (err) {
      alert("Failed to save changes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 border-b border-white/5 p-5 hover:bg-white/[0.01] transition-all cursor-pointer group relative">
      {isPinned && (
        <div className="flex items-center gap-2 mb-[-8px] ml-9 text-muted-foreground transition-colors group-hover:text-primary">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c-4.411 0-8 3.589-8 8 0 5.493 8 12 8 12s8-6.507 8-12c0-4.411-3.589-8-8-8zm0 11c-1.654 0-3-1.346-3-3s1.346-3 3-3 3 1.346 3 3-1.346 3-3 3z"/></svg>
          <span className="text-[12px] font-bold tracking-tight">Pinned Drop</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
             <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-purple-600 shrink-0 flex items-center justify-center text-xs font-black text-white shadow-xl shadow-primary/10 border border-white/10 uppercase">
                {initialDrop.author?.name?.[0] || 'D'}
             </div>
             <div>
               <div className="flex items-center gap-1.5">
                 <span className="font-bold text-[15px] text-white hover:underline decoration-1">{initialDrop.author?.name || 'Anonymous'}</span>
                 <span className="text-muted-foreground/60 text-[14px]">@{initialDrop.author?.handle || 'anon'}</span>
               </div>
               <div className="flex items-center gap-2 mt-0.5">
                 <span className="text-[11px] text-muted-foreground/40 font-bold uppercase tracking-widest">{new Date(initialDrop.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
               </div>
             </div>
         </div>
         
         <div className="relative">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
              className="p-2 -mr-1 rounded-full hover:bg-primary/10 text-muted-foreground/40 hover:text-primary transition-all active:scale-95"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
            </button>

            {showMenu && (
              <div 
                className="absolute top-full right-0 mt-1 w-52 bg-[#020202] border border-white/10 rounded-2xl shadow-2xl z-[100] overflow-hidden py-1.5 animate-in fade-in zoom-in-95 duration-200 origin-top-right backdrop-blur-3xl"
                onMouseLeave={() => setShowMenu(false)}
              >
                 {isOwner ? (
                   <>
                     <button 
                       onClick={handleTogglePin}
                       className="w-full text-left px-4 py-2.5 text-[14px] font-bold text-white hover:bg-white/5 flex items-center gap-3 transition-colors"
                     >
                       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2c-4.411 0-8 3.589-8 8 0 5.493 8 12 8 12s8-6.507 8-12c0-4.411-3.589-8-8-8zm0 11c-1.654 0-3-1.346-3-3s1.346-3 3-3 3 1.346 3 3-1.346 3-3 3z"/></svg>
                       {isPinned ? "Unpin from profile" : "Pin to profile"}
                     </button>
                     <button 
                       onClick={(e) => { e.stopPropagation(); setShowMenu(false); setIsEditing(true); }}
                       className="w-full text-left px-4 py-2.5 text-[14px] font-bold text-white hover:bg-white/5 flex items-center gap-3 transition-colors"
                     >
                       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                       Edit Drop
                     </button>
                     <div className="h-px bg-white/5 mx-2 my-1" />
                     <button 
                       onClick={handleDelete}
                       disabled={isDeleting}
                       className="w-full text-left px-4 py-2.5 text-[14px] font-black text-red-500 hover:bg-red-500/10 flex items-center gap-3 transition-colors uppercase tracking-widest"
                     >
                       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                       {isDeleting ? "Dropping..." : "Delete Drop"}
                     </button>
                   </>
                 ) : (
                   <button 
                     onClick={(e) => { e.stopPropagation(); setShowMenu(false); alert("Reported!"); }}
                     className="w-full text-left px-4 py-2.5 text-[14px] font-bold text-white hover:bg-white/5 flex items-center gap-3 transition-colors"
                   >
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
                     Report Drop
                   </button>
                 )}
              </div>
            )}
         </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-3">
        {isEditing ? (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-[16px] text-white outline-none focus:border-primary/50 min-h-[120px] resize-none shadow-inner font-medium"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
            <div className="flex justify-end gap-2 mt-3">
              <button 
                onClick={(e) => { e.stopPropagation(); setIsEditing(false); setEditText(initialDrop.text || ""); }}
                className="px-5 py-2 rounded-full border border-white/10 text-[13px] font-black uppercase tracking-widest hover:bg-white/5 transition-all text-white/50"
              >
                Cancel
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); handleSaveEdit(); }}
                disabled={loading}
                className="px-6 py-2 rounded-full bg-primary text-white text-[13px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 disabled:opacity-30"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        ) : (
          currentText && (
            <p className={`text-white whitespace-pre-wrap break-words leading-relaxed ${initialDrop.mediaUrl ? 'text-[15px] font-medium' : 'text-[24px] font-black tracking-tight leading-tight'}`}>
               {currentText}
            </p>
          )
        )}

        {/* Location Tag */}
        {!isEditing && initialDrop.location && (
          <div className="flex items-center gap-1.5 text-primary text-[12px] font-black uppercase tracking-wider hover:underline cursor-pointer transition-all">
            <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="3" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            {initialDrop.location}
          </div>
        )}

        {/* Poll */}
        {initialDrop.pollOptions && (
          <div className="flex flex-col mt-1 gap-2">
            {JSON.parse(initialDrop.pollOptions).map((opt: string, i: number) => (
              <button 
                 key={i} 
                 onClick={(e) => { e.stopPropagation(); alert("Voting coming soon!"); }}
                 className="relative w-full rounded-2xl min-h-[46px] flex items-center px-4 cursor-pointer bg-white/5 hover:bg-white/10 transition-all border border-white/10 hover:border-primary/30 group/poll"
              >
                <span className="relative z-10 text-[15px] font-bold text-white group-hover/poll:text-primary transition-colors">{opt}</span>
              </button>
            ))}
            <div className="text-[12px] text-white/30 mt-1 font-bold uppercase tracking-widest font-mono">
               {0} VOTES · {initialDrop.pollEndsAt ? (new Date(initialDrop.pollEndsAt) > new Date() ? 'LIVE' : 'FINAL') : ''}
            </div>
          </div>
        )}

        {/* Media */}
        {initialDrop.mediaUrl && (() => {
           let mediaUrls: string[] = [];
           try {
             mediaUrls = initialDrop.mediaUrl.startsWith('[') ? JSON.parse(initialDrop.mediaUrl) : [initialDrop.mediaUrl];
           } catch { mediaUrls = [initialDrop.mediaUrl]; }
           
           if (mediaUrls.length === 0) return null;
           const currentUrl = mediaUrls[currentIndex];

           return (
             <div className="mt-1 w-full rounded-[2rem] overflow-hidden border border-white/5 relative bg-black flex flex-col group/carousel shadow-2xl">
               <div className="relative w-full flex items-center justify-center min-h-[300px] bg-gradient-to-b from-white/[0.02] to-transparent">
                 {mediaUrls.length > 1 && (
                    <div className="absolute inset-x-0 z-20 flex justify-between px-4 pointer-events-none opacity-0 group-hover/carousel:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => prevMedia(e, mediaUrls.length)}
                        className="p-3 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10 pointer-events-auto hover:bg-primary transition-all active:scale-90"
                      >
                         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M15 18l-6-6 6-6"/></svg>
                      </button>
                      <button 
                        onClick={(e) => nextMedia(e, mediaUrls.length)}
                        className="p-3 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10 pointer-events-auto hover:bg-primary transition-all active:scale-90"
                      >
                         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M9 18l6-6-6-6"/></svg>
                      </button>
                    </div>
                 )}

                 {initialDrop.mediaType === 'video' ? (
                   <video src={currentUrl} className="w-full max-h-[700px] object-contain block" controls playsInline />
                 ) : initialDrop.mediaType === 'audio' ? (
                    <div className="w-full aspect-video flex flex-col items-center justify-center bg-white/[0.02] relative">
                       <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 animate-pulse" />
                       <audio src={currentUrl} controls className="w-[80%] relative z-10" />
                    </div>
                 ) : (
                   <img src={currentUrl} alt="Drop Media" className="w-full max-h-[700px] object-contain block" loading="lazy" />
                 )}

                 {mediaUrls.length > 1 && (
                   <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-xl px-3 py-1.5 rounded-full border border-white/10">
                     <span className="text-[11px] font-black text-white/90 tracking-widest">{currentIndex + 1} / {mediaUrls.length}</span>
                   </div>
                 )}
               </div>

               {mediaUrls.length > 1 && (
                 <div className="flex justify-center gap-2 py-4 bg-white/[0.02] border-t border-white/5">
                   {mediaUrls.map((_, i) => (
                     <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${i === currentIndex ? 'bg-primary w-5 scale-110' : 'bg-white/10'}`} />
                   ))}
                 </div>
               )}
             </div>
           );
        })()}
      </div>

      {/* Interactions */}
      <div className="flex items-center justify-between text-muted-foreground mt-4 py-1.5 px-2 bg-white/[0.02] rounded-2xl border border-white/5 shadow-inner">
         <button className="flex-1 flex justify-center gap-2.5 items-center hover:text-primary transition-all hover:bg-primary/10 py-2.5 rounded-xl group/btn active:scale-95">
            <svg viewBox="0 0 24 24" fill="none" className="w-[18px] h-[18px] stroke-current group-hover/btn:fill-primary/20"><path strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
            <span className="text-[14px] font-black uppercase tracking-tight">{initialDrop.saves || 'Save'}</span>
         </button>
         <button className="flex-1 flex justify-center gap-2.5 items-center hover:text-emerald-400 transition-all hover:bg-emerald-400/10 py-2.5 rounded-xl border-x border-white/5 group/btn active:scale-95">
            <svg viewBox="0 0 24 24" fill="none" className="w-[18px] h-[18px] stroke-current"><path strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            <span className="text-[14px] font-black uppercase tracking-tight">{initialDrop.reDrops || 'Redrop'}</span>
         </button>
         <button className="flex-1 flex justify-center gap-2 items-center hover:text-yellow-400 transition-all hover:bg-yellow-400/10 py-2.5 rounded-xl group/btn active:scale-95">
            <svg viewBox="0 0 24 24" fill="none" className="w-[18px] h-[18px] stroke-current"><path strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M12 2v20m-5-5h10l-5-10m0 0v10"/></svg>
            <span className="text-[13px] font-black uppercase tracking-[0.2em] text-yellow-500/80">Tip</span>
         </button>
      </div>
    </div>
  );
}
