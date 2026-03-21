"use client";

import * as React from "react";
import { useUI } from "@/app/context/UIContext";

type TweetCardProps = {
  key?: string | number;
  post: {
    id: string;
    text: string;
    likes: number;
    mediaUrl?: string | null;
    mediaType?: string | null;
    pollOptions?: string | null;
    pollEndsAt?: string | null;
    metadata?: string | null;
    location?: string | null;
    pinned: boolean;
    createdAt: string | Date;
    author: { name: string; email: string; handle?: string | null };
  };
};

export default function TweetCard({ post }: TweetCardProps) {
  const { openPostModal } = useUI();
  const [showMenu, setShowMenu] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editText, setEditText] = React.useState(post.text);
  const [isDeleted, setIsDeleted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  
  const userHandle = typeof window !== "undefined" ? localStorage.getItem("drops_handle") : null;
  const isOwner = userHandle && (post.author.handle === userHandle || post.author.email.split('@')[0] === userHandle);
  
  const menuRef = React.useRef<HTMLDivElement>(null);
  const carouselRef = React.useRef<HTMLDivElement>(null);
 
  const nextMedia = (e: React.MouseEvent, max: number) => {
    e.stopPropagation();
    setCurrentIndex((currentIndex + 1) % max);
  };
 
  const prevMedia = (e: React.MouseEvent, max: number) => {
    e.stopPropagation();
    setCurrentIndex((currentIndex - 1 + max) % max);
  };

  // Interaction states
  const [liked, setLiked] = React.useState(false);
  const [reposted, setReposted] = React.useState(false);
  const [bookmarked, setBookmarked] = React.useState(false);
  const [likesCount, setLikesCount] = React.useState(post.likes);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  const createdTime = new Date(post.createdAt);
  const timeStr = createdTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = createdTime.toLocaleDateString([], { month: 'short', day: 'numeric' });
  
  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const newLiked = !liked;
    setLiked(newLiked);
    const newCount = newLiked ? likesCount + 1 : likesCount - 1;
    setLikesCount(newCount);
    
    try {
      await fetch(`/api/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likes: newCount })
      });
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
      if (res.ok) {
        setIsDeleted(true);
        setShowDeleteModal(false);
      }
    } catch (err) {
      alert("Failed to delete post.");
    } finally {
      setLoading(false);
    }
  };

  if (isDeleted) return null;

  return (
    <div className="relative border-b border-white/5 py-3 px-4 hover:bg-white/[0.02] transition-colors cursor-pointer group">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="h-10 w-10 rounded-full bg-gray-800 shrink-0 border border-white/5 overflow-hidden ring-1 ring-white/10">
          <div className="w-full h-full bg-blue-500/10 flex items-center justify-center text-sm font-bold text-primary">
            {post.author.name?.[0] || "?"}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-0.5">
            <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
              <span className="font-bold text-[15px] text-white hover:underline truncate">{post.author.name}</span>
              <span className="text-[14px] text-muted-foreground/60 truncate">@{post.author.email.split('@')[0]}</span>
              <span className="text-[14px] text-muted-foreground/40">·</span>
              <span className="text-[14px] text-muted-foreground/40 whitespace-nowrap">{dateStr}</span>
              {post.location && (
                <>
                  <span className="text-[14px] text-muted-foreground/40">·</span>
                  <span className="text-[13px] text-primary hover:underline cursor-pointer flex items-center gap-1 font-bold">
                    <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2.5" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    {post.location}
                  </span>
                </>
              )}
            </div>
          </div>

           {/* Content */}
          {isEditing ? (
            <div className="mt-2 mb-3">
              <textarea
                value={editText}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditText(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-[15px] text-white outline-none focus:border-primary min-h-[100px] resize-none"
                autoFocus
              />
              <div className="flex justify-end gap-2 mt-2">
                <button 
                  onClick={() => { setIsEditing(false); setEditText(post.text); }}
                  className="px-4 py-1.5 rounded-full border border-white/10 text-[13px] font-bold hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={async () => {
                    setLoading(true);
                    try {
                      const res = await fetch(`/api/posts/${post.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ text: editText })
                      });
                      if (res.ok) {
                        post.text = editText; // Optimistic update
                        setIsEditing(false);
                      }
                    } catch (err) {
                      alert("Failed to save changes");
                    } finally {
                      setLoading(false);
                    }
                  }}
                  disabled={loading}
                  className="px-4 py-1.5 rounded-full bg-primary text-white text-[13px] font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-[15px] leading-relaxed text-white/90 mb-3 whitespace-pre-wrap break-words">
               {post.text}
            </div>
          )}

          {/* MEDIA POSTS (Instagram-style Carousel) */}
          {post.mediaUrl && (() => {
             let mediaUrls: string[] = [];
             let isMulti = false;
             try {
               isMulti = post.mediaUrl.startsWith('[');
               mediaUrls = isMulti ? JSON.parse(post.mediaUrl) : [post.mediaUrl];
             } catch {
               mediaUrls = [post.mediaUrl];
             }
             
             if (mediaUrls.length === 0) return null;
             const currentUrl = mediaUrls[currentIndex] || mediaUrls[0];
 
             return (
               <div className="mt-2 w-full rounded-2xl overflow-hidden border border-white/10 shadow-lg relative bg-[#0a0a0a] flex flex-col group/carousel">
                 <div className="relative w-full flex items-center justify-center min-h-[200px]">
                   {/* Navigation Clicks (Overlay) */}
                   {mediaUrls.length > 1 && (
                     <div className="absolute inset-0 z-10 flex">
                       <div 
                         className="w-1/2 h-full cursor-w-resize" 
                         onClick={(e: React.MouseEvent) => prevMedia(e, mediaUrls.length)}
                       />
                       <div 
                         className="w-1/2 h-full cursor-e-resize" 
                         onClick={(e: React.MouseEvent) => nextMedia(e, mediaUrls.length)}
                       />
                     </div>
                   )}
 
                   {/* Arrows (Visible on hover) */}
                   {mediaUrls.length > 1 && (
                     <>
                      <button 
                        onClick={(e: React.MouseEvent) => prevMedia(e, mediaUrls.length)}
                        className="absolute left-3 z-20 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-black/80"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
                      </button>
                      <button 
                        onClick={(e: React.MouseEvent) => nextMedia(e, mediaUrls.length)}
                        className="absolute right-3 z-20 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-black/80"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
                      </button>
                     </>
                   )}
 
                   {/* Content Display */}
                   {post.mediaType === 'video' ? (
                    <video 
                      src={currentUrl} 
                      className="w-full h-auto max-h-[700px] object-contain block" 
                      controls 
                      playsInline 
                    />
                  ) : post.mediaType === 'audio' ? (
                     <div className="w-full aspect-video flex flex-col items-center justify-center bg-[#202327]">
                       <audio src={currentUrl} controls className="w-[90%]" onClick={(e: React.MouseEvent<HTMLAudioElement>) => e.stopPropagation()} />
                     </div>
                  ) : (
                    <img 
                      src={currentUrl} 
                      alt={`Post Media ${currentIndex + 1}`} 
                      className="w-full h-auto max-h-[700px] object-contain block" 
                      loading="lazy" 
                    />
                  )}
 
                   {/* Top Badge (e.g., Image Count) */}
                   {mediaUrls.length > 1 && (
                     <div className="absolute top-3 right-3 z-20 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                       <span className="text-[11px] font-bold text-white/90">{currentIndex + 1} / {mediaUrls.length}</span>
                     </div>
                   )}
                 </div>
 
                 {/* Dot Indicators */}
                 {mediaUrls.length > 1 && (
                   <div className="flex justify-center gap-1.5 py-3 bg-black/40 backdrop-blur-sm border-t border-white/5">
                     {mediaUrls.map((_, i: number) => (
                       <div 
                         key={i} 
                         className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-primary w-4' : 'bg-white/20'}`}
                       />
                     ))}
                   </div>
                 )}
               </div>
             );
          })()}

          {/* POLL POST */}
          {post.pollOptions && (
            <div className="flex flex-col mb-3">
              {JSON.parse(post.pollOptions).map((opt: string, i: number) => (
                <button 
                   key={i} 
                   onClick={(e: React.MouseEvent) => { e.stopPropagation(); alert("Voting coming soon!"); }}
                   className="relative w-full rounded-xl min-h-[44px] flex items-center px-4 cursor-pointer mt-2 bg-primary/10 hover:bg-primary/20 transition-colors border border-primary/20 text-left"
                >
                  <span className="relative z-10 text-[15px] font-bold text-primary leading-tight">{opt}</span>
                </button>
              ))}
              <div className="text-[13px] text-white/40 mt-3 font-medium tracking-wide">
                 {0} votes · {post.pollEndsAt ? (new Date(post.pollEndsAt) > new Date() ? 'Poll open' : 'Final results') : ''}
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between text-muted-foreground/50 max-w-sm mt-1 -ml-1.5">
            <button className="p-1.5 rounded-full hover:bg-primary/10 hover:text-primary transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-14 8.38 8.38 0 0 1 3.8.9L21 3z"/></svg>
            </button>
            <button 
              onClick={(e: React.MouseEvent) => { e.stopPropagation(); setReposted(!reposted); }}
              className={`p-1.5 rounded-full hover:bg-green-500/10 hover:text-green-500 transition-all ${reposted ? 'text-green-500' : ''}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
            </button>
            <button 
              onClick={handleLike}
              className={`flex items-center gap-1.5 p-1.5 rounded-full hover:bg-pink-500/10 hover:text-pink-500 transition-all ${liked ? 'text-pink-500' : ''}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              {likesCount > 0 && <span className="text-[12px] font-medium">{likesCount}</span>}
            </button>
            <button 
              onClick={(e: React.MouseEvent) => { e.stopPropagation(); setBookmarked(!bookmarked); }}
              className={`p-1.5 rounded-full hover:bg-blue-500/10 hover:text-blue-500 transition-all ${bookmarked ? 'text-blue-500' : ''}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
            </button>
            <button className="p-1.5 rounded-full hover:bg-primary/10 hover:text-primary transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            </button>
            
            {/* 3-dots trigger */}
            <div className="relative" ref={menuRef}>
              <button 
                onClick={(e: React.MouseEvent) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                className="p-1.5 rounded-full hover:bg-white/10 hover:text-white transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
              </button>

              {/* Redesigned 3-dot Menu */}
              {showMenu && (
                <div className="absolute bottom-full right-0 mb-2 w-64 bg-[#0a1219] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden py-1">
                  {[
                    { label: "Pin to your profile", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v8"/><path d="m16 7-4 4-4-4"/></svg> },
                    { label: "Translate", icon: "？" },
                    { label: "Copy post text", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> },
                    { divider: true },
                    { label: "Mute thread", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg> },
                    { label: "Mute words & tags", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg> },
                    { divider: true },
                    ...(isOwner ? [
                      { label: "Edit post", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>, isEdit: true },
                      { label: "Delete post", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>, isDelete: true }
                    ] : [
                      { label: "Report post", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg> }
                    ]),
                  ].map((item: any, idx) => (
                    item.divider ? (
                      <div key={idx} className="h-px bg-white/10 my-1 mx-2" />
                    ) : (
                      <button
                        key={idx}
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          setShowMenu(false);
                          if (item.isDelete) {
                            setShowDeleteModal(true);
                          } else if (item.isEdit) {
                            setIsEditing(true);
                          }
                        }}
                        className={`w-full px-4 py-3 text-left text-[14px] flex items-center justify-between hover:bg-white/5 transition-colors group ${item.isDelete ? 'text-red-500 hover:bg-red-500/10' : 'text-white/90'}`}
                      >
                        <span className="font-medium">{item.label}</span>
                        <span className="text-muted-foreground/60 group-hover:text-inherit transition-colors">
                           {item.icon}
                        </span>
                      </button>
                    )
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div 
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            className="w-full max-w-[320px] bg-[#0d161e] border border-white/10 rounded-[2rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200"
          >
            <h2 className="text-[22px] font-bold text-white mb-2 text-center">Delete this post?</h2>
            <p className="text-[15px] text-muted-foreground text-center mb-8 leading-relaxed">
              If you remove this post, you won't be able to recover it.
            </p>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={handleDelete}
                disabled={loading}
                className="w-full bg-[#ef1c5c] hover:bg-[#d41952] active:scale-[0.98] py-3 rounded-full text-white font-bold text-[16px] transition-all shadow-lg"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="w-full bg-[#202c39] hover:bg-[#2b3a49] active:scale-[0.98] py-3 rounded-full text-white font-bold text-[16px] transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
