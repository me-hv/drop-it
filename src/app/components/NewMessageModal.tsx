"use client";

import React from "react";

interface User {
  id: string;
  name: string;
  handle: string;
  avatar?: string;
}

interface NewMessageModalProps {
  onClose: () => void;
  onSelectUser: (userId: string) => void;
}

export default function NewMessageModal({ onClose, onSelectUser }: NewMessageModalProps) {
  const [query, setQuery] = React.useState("");
  const [users, setUsers] = React.useState<User[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query.trim()) {
        setUsers([]);
        return;
      }
      setIsLoading(true);
      try {
        const res = await fetch(`/api/users?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        }
      } catch (e) {
        console.error("Search failed", e);
      } finally {
        setIsLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="w-full max-w-md bg-black border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <div className="flex items-center gap-4">
             <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
             </button>
             <h2 className="text-lg font-black uppercase tracking-widest text-white">New Message</h2>
          </div>
          <button 
            disabled={true} // For future group chat
            className="text-[10px] font-black text-primary uppercase tracking-widest opacity-30 cursor-not-allowed"
          >
            Next
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-white/5">
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <input
              autoFocus
              type="text"
              placeholder="SEARCH BY NAME OR HANDLE..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent border-0 pl-12 pr-4 py-2 text-[11px] font-black uppercase tracking-widest text-white focus:outline-none placeholder:text-white/10"
            />
          </div>
        </div>

        {/* Group Chat Link */}
        <div className="p-4 border-b border-white/5 hover:bg-white/[0.02] cursor-not-allowed group transition-colors">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-primary/40">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
             </div>
             <span className="text-[11px] font-black text-primary/40 uppercase tracking-widest">Create a group</span>
          </div>
        </div>

        {/* User Results */}
        <div className="flex-1 overflow-y-auto max-h-[400px] no-scrollbar py-2">
          {isLoading ? (
            <div className="p-8 text-center text-primary uppercase tracking-[0.5em] text-[10px] animate-pulse">Syncing...</div>
          ) : users.length === 0 && query ? (
            <div className="p-8 text-center text-white/20 uppercase tracking-widest text-[10px]">No users found</div>
          ) : (
            users.map((user: User) => (
              <div 
                key={user.id}
                onClick={() => onSelectUser(user.id)}
                className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.03] cursor-pointer transition-colors group"
              >
                <div className="w-12 h-12 rounded-none bg-primary shrink-0 flex items-center justify-center text-xs font-black text-black overflow-hidden scale-90 group-hover:scale-100 transition-transform">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user.name?.[0] || '?'
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-[11px] text-white uppercase tracking-wider truncate">{user.name}</span>
                    <svg className="text-primary" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M22.5 12.5c0-1.58-.88-2.95-2.18-3.65.25-1.15.13-2.38-.32-3.48a4.954 4.954 0 0 0-1.82-1.82c-1.1-.45-2.33-.57-3.48-.32-1.3-.3-2.67-1.18-4.25-1.18-1.58 0-2.95.88-3.65 2.18-1.15-.25-2.38-.13-3.48.32a4.954 4.954 0 0 0-1.82 1.82c-.45 1.1-.57 2.33-.32 3.48-1.3.7-2.18 2.07-2.18 3.65 0 1.58.88 2.95 2.18 3.65-.25 1.15-.13 2.38.32 3.48a4.954 4.954 0 0 0 1.82 1.82c1.1.45 2.33.57 3.48.32 1.3.3 2.67 1.18 4.25 1.18 1.58 0 2.95-.88 3.65-2.18 1.15.25 2.38.13 3.48-.32a4.954 4.954 0 0 0 1.82-1.82c.45-1.1.57-2.33.32-3.48 1.3-.7 2.18-2.07 2.18-3.65zM10.25 16.5l-3.25-3.25 1.4-1.4 1.85 1.85 5.25-5.25 1.4 1.4-6.65 6.65z"/></svg>
                  </div>
                  <span className="text-[10px] text-white/20 uppercase tracking-tighter">@{user.handle}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
