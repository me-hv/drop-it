"use client";

import React, { useEffect, useRef, useState } from "react";
import { useUI } from "@/app/context/UIContext";

type TweetCardProps = {
  key?: string | number;
  post: {
    id: string;
    text: string;
    likes: number;
    mediaUrl?: string | null;
    mediaType?: string | null;
    metadata?: string | null;
    pinned: boolean;
    createdAt: string | Date;
    author: { name: string; email: string };
  };
};

export default function TweetCard({ post }: TweetCardProps) {
  const { openPostModal } = useUI();
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(post.text);
  const [isDeleted, setIsDeleted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);

  // Interaction states
  const [liked, setLiked] = useState(false);
  const [reposted, setReposted] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);

  useEffect(() => {
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
              <span className="text-[14px] text-muted-foreground/60 truncate">@{post.author.email.split('@')[0]}.bsky.social</span>
              <span className="text-[14px] text-muted-foreground/40">·</span>
              <span className="text-[14px] text-muted-foreground/40 whitespace-nowrap">{dateStr}</span>
            </div>
          </div>

          {/* Content */}
          <div className="text-[15px] leading-relaxed text-white/90 mb-3 whitespace-pre-wrap break-words">
             {post.text}
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between text-muted-foreground/50 max-w-sm mt-1 -ml-1.5">
            <button className="p-1.5 rounded-full hover:bg-primary/10 hover:text-primary transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-14 8.38 8.38 0 0 1 3.8.9L21 3z"/></svg>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setReposted(!reposted); }}
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
              onClick={(e) => { e.stopPropagation(); setBookmarked(!bookmarked); }}
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
                onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
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
                    { label: "Edit interaction settings", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
                    { label: "Delete post", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>, isDelete: true },
                  ].map((item, idx) => (
                    item.divider ? (
                      <div key={idx} className="h-px bg-white/10 my-1 mx-2" />
                    ) : (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowMenu(false);
                          if (item.isDelete) {
                            setShowDeleteModal(true);
                          }
                        }}
                        className={`w-full px-4 py-2.5 text-left text-[14px] flex items-center justify-between hover:bg-white/5 transition-colors group ${item.isDelete ? 'text-red-500 hover:bg-red-500/10' : 'text-white/90'}`}
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
            onClick={(e) => e.stopPropagation()}
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
