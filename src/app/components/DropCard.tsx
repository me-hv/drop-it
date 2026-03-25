"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";

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
  quoted?: DropShape | null;
};

const CustomAudioPlayer = ({ src, text }: { src: string; text: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [trackName, artistName] = text.includes(" - ") 
    ? text.split(" - ").map(s => s.trim()) 
    : [text, "Unknown Artist"];

  const togglePlay = (e: any) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    isPlaying ? audioRef.current.pause() : audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const seek = (e: any) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    audioRef.current.currentTime = (x / rect.width) * audioRef.current.duration;
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-[#0a0a0c] border border-white/5 p-4 flex flex-col gap-4 relative overflow-hidden group/player">
      <audio 
        ref={audioRef} 
        src={src} 
        onTimeUpdate={onTimeUpdate} 
        onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="flex items-center justify-between z-10">
        <div className="flex flex-col min-w-0">
          <h4 className="text-lg font-black text-white uppercase tracking-tight truncate">{trackName}</h4>
          <p className="text-primary font-bold text-[10px] uppercase tracking-widest truncate">{artistName}</p>
        </div>
        <button 
          onClick={togglePlay}
          className="w-10 h-10 bg-primary text-black flex items-center justify-center shrink-0 hover:scale-105 active:scale-95 transition-all"
        >
          {isPlaying ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="ml-1"><path d="M8 5v14l11-7z"/></svg>
          )}
        </button>
      </div>

      <div className="relative group/wave-container">
        <div className="h-12 w-full flex items-end gap-[2px] cursor-pointer z-10" onClick={seek}>
          {Array.from({ length: 40 }).map((_, i) => {
            const seed = (Math.sin(i * 0.3) + 1) / 2;
            const height = 30 + seed * 70;
            const isActive = (i / 40) * 100 <= progress;
            return (
              <div 
                key={i}
                style={{ height: `${height}%` }}
                className={`flex-1 transition-all ${isActive ? 'bg-primary' : 'bg-white/10'}`}
              />
            );
          })}
        </div>
        <div className="flex justify-between mt-2 text-[9px] font-black text-white/20 tracking-widest uppercase">
          <span className={progress > 0 ? "text-primary" : ""}>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Expanded Interaction States
  const [likes, setLikes] = useState<number>(initialDrop.saves || 0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [reposts, setReposts] = useState<number>(initialDrop.reDrops || 0);
  const [isReposted, setIsReposted] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [comments, setComments] = useState<number>(0);
  
  // Comment UI States
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [localComments, setLocalComments] = useState<Array<{id: string, author: string, handle: string, text: string}>>([]);

  // Repost Menu State
  const [showRepostMenu, setShowRepostMenu] = useState(false);

  // Interaction Feedback & Quote States
  const [toast, setToast] = useState<string | null>(null);
  const [showQuoteBox, setShowQuoteBox] = useState(false);
  const [quoteText, setQuoteText] = useState("");
  const quoteRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (showQuoteBox && quoteRef.current) {
      quoteRef.current.focus();
    }
  }, [showQuoteBox]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const userHandle = typeof window !== "undefined" ? localStorage.getItem("drops_handle") : null;
  const isOwner = userHandle === initialDrop.author.handle;

  const handleTogglePin = async (e: any) => {
    e.stopPropagation();
    setIsPinned(!isPinned);
    setShowMenu(false);
    await fetch(`/api/drops/${initialDrop.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPinned: !isPinned })
    });
  };

  const handleSaveEdit = async () => {
    if (!editText.trim()) return;
    setLoading(true);
    const res = await fetch(`/api/drops/${initialDrop.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: editText })
    });
    if (res.ok) {
      setCurrentText(editText);
      setIsEditing(false);
    }
    setLoading(false);
  };

  // Interaction Handlers
  const handleLike = (e: any) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
  };

  const handleRepost = (e: any) => {
    e.stopPropagation();
    setShowRepostMenu(!showRepostMenu);
    setShowCommentBox(false); // Close other box
  };

  const handleRepostConfirm = (e: any) => {
    e.stopPropagation();
    setIsReposted(!isReposted);
    if (isReposted) {
      setReposts(reposts - 1);
    } else {
      setReposts(reposts + 1);
    }
    setShowRepostMenu(false);
  };

  const handleComment = (e: any) => {
    e.stopPropagation();
    setShowCommentBox(!showCommentBox);
  };

  const handleSubmitComment = (e: any) => {
    e.stopPropagation();
    if (!commentText.trim()) return;
    
    const newComment = {
      id: Date.now().toString(),
      author: 'You',
      handle: userHandle || 'user',
      text: commentText
    };
    
    setLocalComments([newComment, ...localComments]);
    setComments(comments + 1);
    setCommentText("");
  };

  const handleQuote = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    setShowQuoteBox(!showQuoteBox);
    setShowRepostMenu(false);
    setShowCommentBox(false);
  };

  const handleQuoteSubmit = async (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    if (!quoteText.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch("/api/drops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: quoteText,
          vibe: "Draft", 
          quotedId: initialDrop.id
        })
      });

      if (response.ok) {
        setToast("RE-FREQUENCY BROADCASTED");
        setQuoteText("");
        setShowQuoteBox(false);
        setReposts(reposts + 1);
        setIsReposted(true);
      } else {
        setToast("SIGNAL INTERRUPTED");
      }
    } catch (err) {
      setToast("CONNECTION FAILED");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: any) => {
    e.stopPropagation();
    const prevSaved = isSaved;
    setIsSaved(!isSaved);
    
    try {
      const response = await fetch(`/api/drops/${initialDrop.id}/save`, {
        method: "POST"
      });
      if (response.ok) {
        setToast(!prevSaved ? "SIGNAL BOOKMARKED" : "SIGNAL ARCHIVED");
      } else {
        setIsSaved(prevSaved);
        setToast("SYNC FAILED");
      }
    } catch (err) {
      setIsSaved(prevSaved);
      setToast("OFFLINE MODE");
    }
  };

  const handleShare = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      navigator.clipboard.writeText(`${window.location.origin}/drops/${initialDrop.id}`);
      setToast("FLOW LINK COPIED");
    } catch (err) {
      setToast("SHARE FAILED");
    }
  };

  return (
    <div className="flex gap-4 bg-black/10 p-4 border-b border-white/5 hover:bg-white/[0.02] cursor-pointer group relative">
      <div className="flex flex-col items-center shrink-0">
        <div className="h-10 w-10 bg-slate-800 flex items-center justify-center text-xs font-bold text-white border border-white/10 overflow-hidden">
          {initialDrop.author?.name?.[0] || 'D'}
        </div>
        <div className="w-px flex-1 bg-white/5 mt-2" />
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-black text-[13px] text-white uppercase tracking-tight truncate">{initialDrop.author?.name || 'Anonymous'}</span>
            <span className="text-white/20 font-bold text-[10px] tracking-widest truncate">@{initialDrop.author?.handle || 'anon'}</span>
            <span className="text-white/10 text-[10px] font-bold">•</span>
            <span className="text-white/20 text-[10px] font-bold">1h</span>
          </div>
          
          <div className="relative">
            <button 
              onClick={(e: any) => { e.stopPropagation(); setShowMenu(!showMenu); }}
              className="text-white/20 hover:text-white transition-all p-1"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
            </button>
            {showMenu && (
              <div 
                className="absolute top-full right-0 mt-1 w-40 bg-[#121214] border border-white/10 z-[100] py-1 shadow-2xl"
                onMouseLeave={() => setShowMenu(false)}
              >
                 {isOwner ? (
                   <>
                     <button onClick={handleTogglePin} className="w-full text-left px-4 py-2 text-[10px] font-black text-white hover:bg-white/5 uppercase tracking-widest">
                       {isPinned ? "Unpin Drop" : "Pin Drop"}
                     </button>
                     <button onClick={(e: any) => { e.stopPropagation(); setIsEditing(true); setShowMenu(false); }} className="w-full text-left px-4 py-2 text-[10px] font-black text-white hover:bg-white/5 uppercase tracking-widest">
                       Edit Drop
                     </button>
                     <button onClick={(e: any) => { e.stopPropagation(); setShowDeleteConfirm(true); setShowMenu(false); }} className="w-full text-left px-4 py-2 text-[10px] font-black text-red-500 hover:bg-red-500/10 uppercase tracking-widest">
                       Delete
                     </button>
                   </>
                 ) : (
                   <button className="w-full text-left px-4 py-2 text-[10px] font-black text-white hover:bg-white/5 uppercase tracking-widest">Report</button>
                 )}
              </div>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="mt-2" onClick={(e: any) => e.stopPropagation()}>
            <textarea
              value={editText}
              onChange={(e: any) => setEditText(e.target.value)}
              className="w-full bg-white/5 border border-white/10 p-4 text-sm text-white outline-none focus:border-primary/20 min-h-[100px] resize-none font-bold"
              autoFocus
            />
            <div className="flex justify-end gap-2 mt-2">
              <button onClick={() => setIsEditing(false)} className="px-3 py-1 text-[9px] font-black uppercase text-white/30 hover:text-white">Cancel</button>
              <button onClick={handleSaveEdit} disabled={loading} className="px-4 py-1 bg-primary text-black text-[9px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                {loading ? "..." : "Save"}
              </button>
            </div>
          </div>
        ) : (
          currentText && (
            <p className="text-[15px] font-medium text-white/90 leading-normal tracking-wide whitespace-pre-wrap break-words">
              {currentText}
            </p>
          )
        )}

        {/* Quoted Content Preview */}
        {initialDrop.quoted && (
           <div className="mt-2 border-l-2 border-primary bg-white/[0.02] p-4 flex flex-col gap-2 group/quoted">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-white/10 flex items-center justify-center text-[8px] font-black text-white/40 border border-white/5">
                  {initialDrop.quoted.author.name[0].toUpperCase()}
                </div>
                <span className="font-black text-[10px] text-white/50 uppercase tracking-tight">{initialDrop.quoted.author.name}</span>
                <span className="text-white/20 font-bold text-[8px] tracking-widest uppercase">@{initialDrop.quoted.author.handle}</span>
              </div>
              <p className="text-[13px] text-white/80 leading-relaxed font-medium">
                {initialDrop.quoted.text || initialDrop.quoted.caption}
              </p>
              {initialDrop.quoted.mediaUrl && initialDrop.quoted.mediaType === 'audio' && (
                <div className="mt-2 p-2 border border-white/5 bg-black/20 flex items-center gap-3">
                   <div className="w-6 h-6 bg-primary/20 flex items-center justify-center text-primary">
                     <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                   </div>
                   <span className="text-[9px] font-black uppercase text-white/30 tracking-widest">Audio Frequency Attached</span>
                </div>
              )}
           </div>
        )}

        {initialDrop.mediaUrl && (
          <div className="mt-2 border border-white/5 bg-black/20 overflow-hidden">
             {initialDrop.mediaType === 'audio' ? (
               <CustomAudioPlayer src={initialDrop.mediaUrl} text={initialDrop.text || initialDrop.caption} />
             ) : initialDrop.mediaType === 'video' ? (
               <video src={initialDrop.mediaUrl} className="w-full max-h-[500px] object-contain" controls />
             ) : (
               <img src={initialDrop.mediaUrl} alt="Drop Media" className="w-full max-h-[500px] object-cover" loading="lazy" />
             )}
          </div>
        )}

        <div className="flex items-center justify-between mt-4 pt-2 -ml-1 pr-4 max-w-[400px]">
           <button onClick={handleComment} className="flex items-center gap-2 text-white/20 hover:text-white transition-all group/btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
              <span className="text-[9px] font-black tracking-widest uppercase">{comments || ''}</span>
           </button>
           <div className="relative">
             <button onClick={handleRepost} className={`flex items-center gap-2 transition-all group/btn ${isReposted ? 'text-primary' : 'text-white/20 hover:text-[#00ba7c]'}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88z" /><path d="M16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z" />
                </svg>
                <span className="text-[9px] font-black tracking-widest uppercase">{reposts || ''}</span>
             </button>
             {showRepostMenu && (
               <div className="absolute bottom-full left-0 mb-2 w-32 bg-[#121214] border border-white/10 z-[110] py-1 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200" onMouseLeave={() => setShowRepostMenu(false)}>
                 <button onClick={handleRepostConfirm} className="w-full text-left px-4 py-3 text-[10px] font-black text-white hover:bg-[#00ba7c]/10 hover:text-[#00ba7c] uppercase tracking-widest flex items-center gap-2">
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M17 1l4 4-4 4m6 0a11 11 0 10-18 8m10-1h-6"/></svg>Repost
                 </button>
                 <button onClick={handleQuote} className="w-full text-left px-4 py-3 text-[10px] font-black text-white hover:bg-white/5 uppercase tracking-widest flex items-center gap-2">
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>Quote
                 </button>
               </div>
             )}
           </div>
           <button onClick={handleLike} className={`flex items-center gap-2 transition-all group/btn ${isLiked ? 'text-primary' : 'text-white/20 hover:text-white'}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
              <span className="text-[9px] font-black tracking-widest uppercase">{likes || ''}</span>
           </button>
           <button onClick={handleSave} className={`flex items-center gap-2 transition-all group/btn ${isSaved ? 'text-primary' : 'text-white/20 hover:text-white'}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
           </button>
           <button onClick={handleShare} className="flex items-center gap-2 text-white/20 hover:text-white transition-all group/btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
           </button>
        </div>

        {showQuoteBox && (
          <div className="mt-4 pt-4 border-t border-white/5 animate-in fade-in slide-in-from-top-2 duration-300" onClick={(e: any) => e.stopPropagation()}>
             <div className="flex items-center justify-between mb-4">
               <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Sampling This Flow</span>
               <button onClick={() => setShowQuoteBox(false)} className="text-white/20 hover:text-white uppercase text-[9px] font-black p-1">Close</button>
             </div>
             
             <div className="flex gap-4">
               <div className="h-8 w-8 bg-white/5 border border-white/10 shrink-0 flex items-center justify-center text-[10px] font-black text-white/20">
                 {userHandle?.[0].toUpperCase() || 'U'}
               </div>
               <div className="flex-1 flex flex-col gap-3">
                  <textarea
                    ref={quoteRef}
                    value={quoteText}
                    onChange={(e: any) => setQuoteText(e.target.value)}
                    placeholder="Add your frequency..."
                    className="w-full bg-[#0d0d0f] border border-white/5 p-4 text-sm text-white outline-none focus:border-primary/30 min-h-[100px] resize-none font-bold italic"
                  />
                  <div className="border-l-2 border-primary bg-white/[0.02] p-3 flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-[10px] text-white/50 uppercase tracking-tight">{initialDrop.author?.name}</span>
                      <span className="text-white/20 font-bold text-[8px] tracking-widest uppercase">@{initialDrop.author?.handle}</span>
                    </div>
                    <p className="text-[12px] text-white/40 line-clamp-2 italic">{currentText}</p>
                  </div>
                  <div className="flex justify-end pt-2">
                    <button onClick={handleQuoteSubmit} className="px-8 py-2.5 bg-primary text-black text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,85,0,0.1)]">
                      Post Quote
                    </button>
                  </div>
               </div>
             </div>
          </div>
        )}

        {showCommentBox && (
          <div className="mt-4 border-l-2 border-primary/20 pl-4 py-2 flex flex-col gap-3" onClick={(e: any) => e.stopPropagation()}>
            <div className="flex gap-3">
              <div className="h-8 w-8 bg-white/5 flex items-center justify-center text-[10px] font-bold text-white/40 border border-white/10 shrink-0">
                {userHandle?.[0].toUpperCase() || 'U'}
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <textarea
                  value={commentText}
                  onChange={(e: any) => setCommentText(e.target.value)}
                  placeholder="Drop a reply..."
                  className="w-full bg-[#0a0a0c] border border-white/10 p-3 text-[13px] text-white outline-none focus:border-primary/40 min-h-[60px] resize-none font-bold"
                  autoFocus
                />
                <div className="flex justify-end">
                  <button onClick={handleSubmitComment} className="px-6 py-2 bg-primary text-black text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                    Drop Reply
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-2 flex flex-col gap-3">
              {localComments.map((c: any) => (
                <div key={c.id} className="flex gap-2 group/comment">
                  <div className="flex flex-col items-center"><div className="w-px h-2 bg-white/10" /><div className="text-[9px] font-black text-white/10 tracking-widest uppercase mb-1">LOG</div></div>
                  <div className="flex-1"><div className="flex items-center gap-2"><span className="text-[11px] font-black text-white/50 uppercase tracking-tight">{c.author}</span><span className="text-[9px] font-bold text-white/10">@{c.handle}</span></div><p className="text-[12px] text-white/80 leading-tight mt-1">{c.text}</p></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[300] bg-white text-black px-6 py-3 font-black text-[10px] tracking-[0.3em] uppercase shadow-[0_0_30px_rgba(255,255,255,0.1)] border border-white/20 animate-in fade-in slide-in-from-bottom-4 duration-300">
           {toast}
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" onClick={() => setShowDeleteConfirm(false)}>
           <div className="bg-[#121214] border border-white/10 p-8 max-w-[300px] w-full flex flex-col items-center text-center gap-6" onClick={(e: any) => e.stopPropagation()}>
              <div className="w-12 h-12 bg-red-500/10 flex items-center justify-center text-red-500">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </div>
              <h3 className="text-xl font-black italic uppercase tracking-tighter">DROPPING FOREVER?</h3>
              <div className="flex flex-col w-full gap-3">
                 <button onClick={async () => { setLoading(true); await fetch(`/api/drops/${initialDrop.id}`, { method: 'DELETE' }); window.location.reload(); }} className="w-full py-4 bg-red-600 text-white font-black uppercase text-xs tracking-widest">Delete Flow</button>
                 <button onClick={() => setShowDeleteConfirm(false)} className="w-full py-4 border border-white/10 text-white/40 font-black uppercase text-[10px] tracking-widest hover:text-white">Cancel</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
