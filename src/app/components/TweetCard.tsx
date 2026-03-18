import { useState } from "react";
import axios from "axios";

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
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(post.text);
  const [isDeleted, setIsDeleted] = useState(false);
  const [loading, setLoading] = useState(false);

  const created = new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  const metadata = post.metadata ? JSON.parse(post.metadata) : null;

  async function handleDelete() {
    if (!confirm("Delete post?")) return;
    setLoading(true);
    try {
      await axios.delete(`/api/posts/${post.id}`);
      setIsDeleted(true);
    } catch (e) {
      alert("Failed to delete.");
    } finally {
      setLoading(false);
      setShowMenu(false);
    }
  }

  async function handleUpdate() {
    setLoading(true);
    try {
      await axios.patch(`/api/posts/${post.id}`, { text: editText });
      post.text = editText;
      setIsEditing(false);
    } catch (e) {
      alert("Failed to update.");
    } finally {
      setLoading(false);
    }
  }

  function handleCopyLink() {
    const url = `${window.location.origin}/post/${post.id}`;
    navigator.clipboard.writeText(url);
    setShowMenu(false);
  }

  async function handleTogglePin() {
    setLoading(true);
    try {
      await axios.patch(`/api/posts/${post.id}`, { pinned: !post.pinned });
      post.pinned = !post.pinned;
      setShowMenu(false);
      window.location.reload(); 
    } catch (e) {
      alert("Failed to pin.");
    } finally {
      setLoading(false);
    }
  }

  if (isDeleted) return null;

  return (
    <article className="border-b border-border bg-black p-4 transition-colors hover:bg-white/[0.03] relative cursor-pointer">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-purple-400 shrink-0" />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 group/header">
            <span className="font-bold text-[15px] hover:underline truncate text-white">{post.author.name}</span>
            <span className="text-[15px] text-muted-foreground truncate">@{post.author.email.split('@')[0]}</span>
            <span className="text-[15px] text-muted-foreground">·</span>
            <span className="text-[15px] text-muted-foreground hover:underline">{created}</span>
            
            {/* Options Button */}
            <div className="ml-auto relative">
              <button 
                onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                className="p-2 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
              </button>
              
              {showMenu && (
                <div className="absolute right-0 top-0 w-max min-w-[180px] bg-black border border-border rounded-xl shadow-[0_4px_20px_rgb(255,255,255,0.1)] z-50 overflow-hidden py-2 animate-in fade-in zoom-in-95 duration-100">
                  <button onClick={handleTogglePin} className="w-full px-4 py-3 text-left text-[15px] font-bold hover:bg-white/5 transition-colors flex items-center gap-3">
                    {post.pinned ? "Unpin from profile" : "Pin to profile"}
                  </button>
                  <button onClick={() => { setIsEditing(true); setShowMenu(false); }} className="w-full px-4 py-3 text-left text-[15px] font-bold hover:bg-white/5 transition-colors flex items-center gap-3">
                    Edit post
                  </button>
                  <button onClick={handleCopyLink} className="w-full px-4 py-3 text-left text-[15px] font-bold hover:bg-white/5 transition-colors flex items-center gap-3">
                    Copy link
                  </button>
                  <button onClick={handleDelete} className="w-full px-4 py-3 text-left text-[15px] font-bold hover:bg-white/5 text-destructive transition-colors flex items-center gap-3">
                    Delete post
                  </button>
                </div>
              )}
            </div>
          </div>

          {post.pinned && (
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground mb-1 -mt-5">
               <svg viewBox="0 0 24 24" className="h-3 w-3 fill-muted-foreground" aria-hidden="true"><g><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path></g></svg>
               Pinned
            </div>
          )}

          {isEditing ? (
            <div className="mt-2 space-y-3">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full bg-black border border-primary/50 rounded-xl p-3 text-[17px] text-white focus:outline-none focus:ring-1 focus:ring-primary min-h-[100px] resize-none"
              />
              <div className="flex gap-2">
                <button onClick={handleUpdate} disabled={loading} className="rounded-full bg-primary px-4 py-1.5 text-sm font-bold text-white hover:bg-primary/90">
                  Save
                </button>
                <button onClick={() => setIsEditing(false)} className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-bold text-white hover:bg-white/20">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-[15px] leading-normal text-white whitespace-pre-wrap break-words mt-1">{post.text}</p>
          )}
          
          {metadata?.location && (
            <div className="mt-2 text-primary text-sm hover:underline cursor-pointer flex items-center gap-1">
               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
               {metadata.location}
            </div>
          )}

          {post.mediaUrl && (
            <div className="mt-3 overflow-hidden rounded-2xl border border-border">
              {post.mediaType === "video" ? (
                <video src={post.mediaUrl} controls className="w-full max-h-[512px] object-contain bg-black" />
              ) : (
                <img src={post.mediaUrl} alt="Post media" className="w-full max-h-[512px] object-cover" />
              )}
            </div>
          )}

          {/* Action Row */}
          <div className="mt-3 flex items-center justify-between text-muted-foreground w-full max-w-md">
            <button className="group/action flex items-center gap-2 hover:text-primary transition-colors">
               <div className="p-2 rounded-full group-hover/action:bg-primary/10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-14 8.38 8.38 0 0 1 3.8.9L21 3z"/></svg>
               </div>
            </button>
            <button className="group/action flex items-center gap-2 hover:text-green-500 transition-colors">
               <div className="p-2 rounded-full group-hover/action:bg-green-500/10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
               </div>
            </button>
            <button className="group/action flex items-center gap-2 hover:text-pink-500 transition-colors">
               <div className="p-2 rounded-full group-hover/action:bg-pink-500/10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
               </div>
               <span className="text-sm group-hover/action:text-pink-500">{post.likes}</span>
            </button>
            <button className="group/action flex items-center gap-2 hover:text-primary transition-colors">
               <div className="p-2 rounded-full group-hover/action:bg-primary/10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
               </div>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
