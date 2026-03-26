"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CustomAudioPlayer from "./CustomAudioPlayer";

export interface DropShape {
  id: string;
  text?: string;
  caption?: string;
  mediaUrl?: string;
  mediaType?: "image" | "video" | "audio";
  createdAt: string;
  author: {
    name: string;
    handle: string;
    avatar?: string;
  };
  likes?: number;
  reposts?: number;
  comments?: number;
  quotedId?: string;
  quoted?: DropShape;
  isPinned?: boolean;
  isSaved?: boolean;
  vibe?: string;
}

interface DropCardProps {
  drop: DropShape;
  isDetail?: boolean;
}

export default function DropCard({ drop: initialDrop, isDetail = false }: DropCardProps) {
  const router = useRouter();
  const [isLiked, setIsLiked] = React.useState(false);
  const [isReposted, setIsReposted] = React.useState(false);
  const [isSaved, setIsSaved] = React.useState(initialDrop.isSaved || false);
  const [likes, setLikes] = React.useState<number>(initialDrop.likes || 0);
  const [reposts, setReposts] = React.useState<number>(initialDrop.reposts || 0);
  const [comments, setComments] = React.useState<number>(initialDrop.comments || 0);
  const [showMenu, setShowMenu] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editText, setEditText] = React.useState(initialDrop.text || initialDrop.caption || "");
  const [currentText, setCurrentText] = React.useState(initialDrop.text || initialDrop.caption || "");
  const [loading, setLoading] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [isPinned, setIsPinned] = React.useState(initialDrop.isPinned || false);
  const [showRepostMenu, setShowRepostMenu] = React.useState(false);
  const [showQuoteBox, setShowQuoteBox] = React.useState(false);
  const [quoteText, setQuoteText] = React.useState("");
  const [showCommentBox, setShowCommentBox] = React.useState(false);
  const [commentText, setCommentText] = React.useState("");
  const [localComments, setLocalComments] = React.useState<any[]>([]);
  const [toast, setToast] = React.useState<string | null>(null);
  const quoteRef = React.useRef<HTMLTextAreaElement>(null);

  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const userHandle = currentUser?.handle || (typeof window !== 'undefined' ? localStorage.getItem('drops_handle') : null);
  const isOwner = userHandle === initialDrop.author.handle;

  React.useEffect(() => {
    fetch('/api/users/me').then(res => res.json()).then(data => {
      if (!data.error) setCurrentUser(data);
    });
  }, []);

  React.useEffect(() => {
    if (showCommentBox) {
      fetchComments();
    }
  }, [showCommentBox]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/drops?quotedId=${initialDrop.id}`);
      if (res.ok) {
        const data = await res.json();
        setLocalComments(data || []);
      }
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikes((prev: number) => isLiked ? prev - 1 : prev + 1);
  };

  const handleRepost = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowRepostMenu(!showRepostMenu);
  };

  const handleRepostConfirm = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsReposted(true);
    setReposts((prev: number) => prev + 1);
    setShowRepostMenu(false);
    showToast("REPOSTED TO FREQUENCY");
  };

  const handleQuote = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowQuoteBox(true);
    setShowRepostMenu(false);
    setTimeout(() => quoteRef.current?.focus(), 100);
  };

  const handleQuoteSubmit = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    try {
      const res = await fetch("/api/drops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: quoteText,
          quotedId: initialDrop.id,
          authorHandle: userHandle || "anonymous"
        }),
      });
      if (res.ok) {
        showToast("QUOTE SIGNAL BROADCASTED");
        setShowQuoteBox(false);
        setQuoteText("");
      }
    } catch (err) {
      showToast("BROADCAST FAILED");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const newSavedState = !isSaved;
    setIsSaved(newSavedState);
    
    try {
      const res = await fetch(`/api/drops/${initialDrop.id}/save`, {
        method: "POST"
      });
      if (res.ok) {
        const data = await res.json();
        setIsSaved(data.saved);
        showToast(data.saved ? "SIGNAL SAVED TO VAULT" : "REMOVED FROM VAULT");
      } else {
        setIsSaved(!newSavedState);
        showToast("VAULT ACCESS FAILED");
      }
    } catch (err) {
      setIsSaved(!newSavedState);
      showToast("VAULT ACCESS FAILED");
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/drops/${initialDrop.id}`);
    showToast("LINK COPIED TO TERMINAL");
  };

  const handleComment = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowCommentBox(!showCommentBox);
  };

  const handleSubmitComment = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!commentText.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/drops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: commentText,
          quotedId: initialDrop.id,
          authorHandle: currentUser?.handle || userHandle || "anonymous",
          vibe: initialDrop.vibe || "Reply"
        }),
      });
      if (res.ok) {
        setCommentText("");
        setComments((prev: number) => prev + 1);
        fetchComments();
        showToast("REPLY DROPPED");
      }
    } catch (err) {
      showToast("REPLY FAILED");
    } finally {
      setLoading(false);
    }
  };

  const handleDropClick = () => {
    if (!isDetail) {
      router.push(`/drops/${initialDrop.id}`);
    }
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const cleanHandle = initialDrop.author.handle.replace(/^@/, "");
    router.push(`/profile/${cleanHandle}`);
  };

  const handleTogglePin = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPinned(!isPinned);
    setShowMenu(false);
    showToast(isPinned ? "SIGNAL UNPINNED" : "SIGNAL PINNED TO FREQUENCY");
  };

  const handleSaveEdit = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    try {
      const res = await fetch(`/api/drops/${initialDrop.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: editText }),
      });
      if (res.ok) {
        setCurrentText(editText);
        setIsEditing(false);
        showToast("SIGNAL MODIFIED");
      }
    } catch (err) {
      showToast("MODIFICATION FAILED");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      
      if (diffInSeconds < 60) return "just now";
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch (e) {
      return "just now";
    }
  };

  return (
    <div 
      className={`relative group bg-[#000000] border-b border-white/[0.05] p-4 transition-all hover:bg-white/[0.01] ${isDetail ? 'cursor-default border-none' : 'cursor-pointer'}`}
      onClick={!isDetail ? handleDropClick : undefined}
    >
      <div className="flex gap-4">
        {!isDetail && (
          <div className="flex flex-col items-center shrink-0">
              <Link 
                href={`/profile/${initialDrop.author.handle.replace('@', '')}`}
                onClick={(e) => e.stopPropagation()}
                className="h-10 w-10 bg-slate-800 rounded-none flex items-center justify-center text-xs font-black text-white border border-white/10 overflow-hidden hover:border-primary transition-all shadow-lg"
              >
                {initialDrop.author?.avatar ? <img src={initialDrop.author.avatar} className="w-full h-full object-cover" /> : (initialDrop.author?.name?.[0] || 'D')}
              </Link>
            <div className="w-px flex-1 bg-white/5 mt-2" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          {isDetail && (
            <div className="flex items-center gap-3 mb-4">
              <div 
                onClick={handleProfileClick}
                className="h-12 w-12 bg-slate-800 rounded-full flex items-center justify-center text-lg font-bold text-white border border-white/10 overflow-hidden cursor-pointer hover:border-primary/50 transition-colors shrink-0"
              >
                {initialDrop.author?.name?.[0] || 'D'}
              </div>
              <div className="flex flex-col">
                <Link 
                  href={`/profile/${initialDrop.author.handle.replace('@', '')}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1 group/name"
                >
                  <span className="text-[17px] font-black text-white hover:text-primary transition-colors leading-tight uppercase tracking-tight">
                    {initialDrop.author?.name}
                  </span>
                  <svg viewBox="0 0 24 24" width="16" height="16" className="text-primary"><path fill="currentColor" d="M22.5 12.5c0-1.58-.88-2.95-2.18-3.66c.15-.55.23-1.12.23-1.71c0-3.37-2.73-6.11-6.11-6.11c-.58 0-1.14.08-1.69.23C12.04 2.12 11.08 1.5 10 1.5c-1.5 0-2.73 1.08-2.97 2.5c-.5-.13-1.02-.2-1.56-.2C2.73 3.8 0 6.53 0 9.9c0 .59.08 1.16.23 1.71c-1.3.71-2.18 2.08-2.18 3.66c0 1.58.88 2.95 2.18 3.66c-.15.55-.23 1.12-.23 1.71c0 3.37 2.73 6.11 6.11 6.11c.58 0 1.14-.08 1.69-.23c.71 1.13 1.94 1.87 3.34 1.87c1.5 0 2.73-1.08 2.97-2.5c.5.13 1.02.2 1.56.2c3.37 0 6.11-2.73 6.11-6.11c0-.59-.08-1.16-.23-1.71c1.3-.71 2.18-2.08 2.18-3.66zM17.06 9L10 16.06L6.94 13L8.06 11.94L10 13.88l5.94-5.94L17.06 9z" /></svg>
                </Link>
                <span className="text-[12px] text-white/30 uppercase tracking-widest leading-tight font-black">
                  @{initialDrop.author?.handle}
                </span>
              </div>
              <div className="ml-auto relative">
                <div 
                  onClick={(e: React.MouseEvent) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                  className="p-2 hover:bg-white/5 text-white/20 hover:text-white transition-all cursor-pointer rounded-full"
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" /></svg>
                </div>
                {showMenu && (
                  <div className="absolute top-12 right-0 w-48 bg-[#121214] border border-white/10 z-[100] py-1 shadow-2xl">
                    {isOwner ? (
                      <>
                        <button onClick={handleTogglePin} className="w-full text-left px-4 py-3 text-[11px] font-black text-white hover:bg-white/5 uppercase tracking-widest transition-colors flex items-center justify-between">
                          {isPinned ? "Unpin Drop" : "Pin Drop"}
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 10V8a2 2 0 00-2-2h-1V3h-2v3h-8V3H8v3H7a2 2 0 00-2 2v2M7 10l5 5 5-5M12 15v6"/></svg>
                        </button>
                        <button onClick={(e: React.MouseEvent) => { e.stopPropagation(); setIsEditing(true); setShowMenu(false); }} className="w-full text-left px-4 py-3 text-[11px] font-black text-white hover:bg-white/5 uppercase tracking-widest transition-colors">
                          Edit Drop
                        </button>
                        <button onClick={(e: React.MouseEvent) => { e.stopPropagation(); setShowDeleteConfirm(true); setShowMenu(false); }} className="w-full text-left px-4 py-3 text-[11px] font-black text-red-500 hover:bg-red-500/10 uppercase tracking-widest transition-colors">
                          Delete
                        </button>
                      </>
                    ) : (
                      <button className="w-full text-left px-4 py-3 text-[11px] font-black text-white hover:bg-white/5 uppercase tracking-widest transition-colors">Report Signal</button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {!isDetail && (
            <div className="flex items-center gap-2 mb-1">
              <Link 
                href={`/profile/${initialDrop.author.handle.replace('@', '')}`}
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                className="flex items-center gap-1 group/name"
              >
                <span className="text-[14px] font-black text-white hover:text-primary transition-colors uppercase tracking-tight">
                  {initialDrop.author.name}
                </span>
                <span className="text-[12px] text-white/20 uppercase tracking-widest font-black">
                  @{initialDrop.author.handle}
                </span>
              </Link>
              <span className="text-[14px] text-white/10">•</span>
              <span className="text-[14px] text-white/20">
                {formatDate(initialDrop.createdAt)}
              </span>
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <div 
                  onClick={(e: React.MouseEvent) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                  className="p-1.5 hover:bg-white/5 text-white/20 hover:text-white transition-all cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" /></svg>
                </div>
              </div>
            </div>
          )}

          <div className="relative">
            {isEditing ? (
              <div className="mt-2" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                <textarea
                  value={editText}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditText(e.target.value)}
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
                <p className={`${isDetail ? 'text-[21px] font-medium leading-[1.3] text-white tracking-tight py-2' : 'text-[15px] font-medium text-white leading-normal'} whitespace-pre-wrap break-words`}>
                  {currentText}
                </p>
              )
            )}
          </div>

          {initialDrop.quoted && (
             <div className="mt-3 border border-white/10 rounded-xl overflow-hidden bg-white/[0.02] flex flex-col group/quoted">
                <div className="p-3 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center text-[9px] font-black text-white/40 border border-white/5">
                      {initialDrop.quoted.author.name[0].toUpperCase()}
                    </div>
                    <span className="font-black text-[12px] text-white uppercase tracking-tight">{initialDrop.quoted.author.name}</span>
                    <span className="text-white/20 font-bold text-[10px] tracking-widest uppercase">@{initialDrop.quoted.author.handle}</span>
                  </div>
                  <p className="text-[14px] text-white/90 leading-normal font-medium">
                    {initialDrop.quoted.text || initialDrop.quoted.caption}
                  </p>
                </div>
             </div>
          )}

          {initialDrop.mediaUrl && (
            <div className={`mt-3 overflow-hidden ${isDetail ? 'rounded-2xl border border-white/[0.05]' : 'rounded-xl border border-white/[0.05]'}`}>
               {initialDrop.mediaType === 'audio' ? (
                 <CustomAudioPlayer src={initialDrop.mediaUrl} text={initialDrop.text || initialDrop.caption} />
               ) : initialDrop.mediaType === 'video' ? (
                 <video src={initialDrop.mediaUrl} className="w-full max-h-[500px] object-contain bg-black" controls />
               ) : (
                 <img src={initialDrop.mediaUrl} alt="Drop Media" className="w-full max-h-[512px] object-cover" loading="lazy" />
               )}
            </div>
          )}

          {isDetail && (
            <div className="flex items-center gap-2 py-4 border-b border-white/[0.05] text-[15px] text-white/40 font-bold mt-4">
              <span>{new Date(initialDrop.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <span>•</span>
              <span>{new Date(initialDrop.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              <span>•</span>
              <span className="text-white">11.9M <span className="text-white/40">Views</span></span>
            </div>
          )}

          <div className={`flex items-center justify-between mt-3 text-white/30 ${isDetail ? 'py-2 border-b border-white/[0.05] mb-2 px-4' : 'max-w-md'}`}>
             <button onClick={handleComment} className="flex items-center gap-2 hover:text-primary transition-all group/btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                {!isDetail && <span className="text-[11px] font-bold">{comments || ''}</span>}
             </button>
             
             <div className="relative">
               <button onClick={handleRepost} className={`flex items-center gap-2 transition-all ${isReposted ? 'text-primary' : 'hover:text-[#00ba7c]'}`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 1l4 4-4 4m6 0a11 11 0 10-18 8m10-1h-6"/></svg>
                  {!isDetail && <span className="text-[11px] font-bold">{reposts || ''}</span>}
               </button>
               {showRepostMenu && (
                 <div className="absolute bottom-full left-0 mb-2 w-32 bg-[#121214] border border-white/10 z-[110] py-1 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
                   <button onClick={handleRepostConfirm} className="w-full text-left px-4 py-3 text-[11px] font-black text-white hover:bg-[#00ba7c]/10 hover:text-[#00ba7c] uppercase tracking-widest flex items-center gap-2">
                     Repost
                   </button>
                   <button onClick={handleQuote} className="w-full text-left px-4 py-3 text-[11px] font-black text-white hover:bg-white/5 uppercase tracking-widest">
                     Quote
                   </button>
                 </div>
               )}
             </div>

             <button onClick={handleLike} className={`flex items-center gap-2 transition-all ${isLiked ? 'text-primary' : 'hover:text-[#f91880]'}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                {!isDetail && <span className="text-[11px] font-bold">{likes || ''}</span>}
             </button>

             <button onClick={handleSave} className={`flex items-center gap-2 transition-all ${isSaved ? 'text-primary' : 'hover:text-primary'}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
             </button>

             <button onClick={handleShare} className="flex items-center gap-2 hover:text-white transition-all">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8m-4-6l-4-4-4 4m4-4v13"/></svg>
             </button>
          </div>

          {showQuoteBox && (
            <div className="mt-4 pt-4 border-t border-white/5" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
               <textarea
                 ref={quoteRef}
                 value={quoteText}
                 onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setQuoteText(e.target.value)}
                 placeholder="Add your frequency..."
                 className="w-full bg-[#0d0d0f] border border-white/5 p-4 text-sm text-white outline-none focus:border-primary/30 min-h-[100px] resize-none font-bold mb-3"
               />
               <div className="flex justify-end">
                 <button onClick={handleQuoteSubmit} className="px-6 py-2 bg-primary text-black text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">
                   Post Quote
                 </button>
               </div>
            </div>
          )}

          {showCommentBox && (
            <div className="mt-4" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
              <div className="flex gap-3">
                 <div className="h-9 w-9 bg-white/5 rounded-full flex items-center justify-center text-[10px] font-bold text-white/40 border border-white/10 shrink-0 overflow-hidden">
                    {currentUser?.avatar ? <img src={currentUser.avatar} className="w-full h-full object-cover" /> : (userHandle?.[0]?.toUpperCase() || 'U')}
                 </div>
                 <div className="flex-1 flex flex-col gap-3">
                    <textarea
                      value={commentText}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCommentText(e.target.value)}
                      placeholder="Drop a reply..."
                      className="w-full bg-transparent border-none p-0 text-[15px] text-white placeholder-white/20 outline-none resize-none font-medium min-h-[24px]"
                      autoFocus
                    />
                    <div className="flex justify-end">
                      <button 
                        onClick={handleSubmitComment} 
                        disabled={!commentText.trim()}
                        className="px-5 py-1.5 bg-white text-black text-[11px] font-black uppercase tracking-widest hover:scale-105 disabled:opacity-20 transition-all"
                      >
                        Post
                      </button>
                    </div>
                 </div>
              </div>
              
              <div className="mt-6 flex flex-col gap-6">
                {localComments.map((c: any) => (
                  <div key={c.id} className="flex gap-3">
                    <div className="h-8 w-8 bg-white/10 rounded-full flex items-center justify-center text-[9px] font-black text-white/40 border border-white/5 shrink-0">
                      {c.author?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] font-bold text-white">{c.author?.name}</span>
                        <span className="text-[13px] text-white/20">@{c.author?.handle}</span>
                      </div>
                      <p className="text-[15px] text-white/90 mt-1">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[300] bg-white text-black px-6 py-3 font-black text-[10px] tracking-widest uppercase shadow-2xl animate-in fade-in slide-in-from-bottom-4">
           {toast}
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)}>
           <div className="bg-[#121214] border border-white/10 p-8 max-w-[320px] w-full flex flex-col items-center gap-6" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
              <h3 className="text-xl font-black uppercase tracking-tighter">Delete Signal?</h3>
              <p className="text-white/40 text-sm">This can't be undone and will be removed from your profile.</p>
              <div className="flex flex-col w-full gap-3">
                 <button onClick={async (e: React.MouseEvent) => { e.stopPropagation(); setLoading(true); await fetch(`/api/drops/${initialDrop.id}`, { method: 'DELETE' }); window.location.reload(); }} className="w-full py-3 bg-red-600 text-white font-black uppercase text-xs tracking-widest hover:bg-red-700 transition-colors">Delete</button>
                 <button onClick={(e: React.MouseEvent) => { e.stopPropagation(); setShowDeleteConfirm(false); }} className="w-full py-3 border border-white/10 text-white font-black uppercase text-xs tracking-widest hover:bg-white/5 transition-colors">Cancel</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
