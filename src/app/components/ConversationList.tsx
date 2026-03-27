"use client";

import React from "react";
import Image from "next/image";

interface Conversation {
  id: string;
  users: any[];
  messages: any[];
  updatedAt: string;
}

interface ConversationListProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  currentUserHandle: string | null;
  onNewMessage: () => void;
}

export default function ConversationList({ 
  conversations, 
  activeId, 
  onSelect, 
  currentUserHandle,
  onNewMessage 
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredConversations = conversations.filter(conv => {
    const otherUser = conv.users.find(u => u.handle !== currentUserHandle) || conv.users[0];
    return (
      otherUser.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      otherUser.handle.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="flex flex-col h-full overflow-y-auto no-scrollbar border-r border-white/5 bg-black">
      {/* Header */}
      <div className="p-6 pb-2">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black uppercase tracking-widest text-white">Chat</h2>
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-1 px-3 py-1 bg-white/5 border border-white/10 rounded-full cursor-pointer hover:bg-white/10 transition-colors">
               <span className="text-[9px] font-black text-white/60 uppercase tracking-tighter">All</span>
               <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"/></svg>
             </div>
             <button 
               onClick={onNewMessage}
               className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white"
             >
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v20m-10-10h20"/><circle cx="12" cy="12" r="10"/></svg>
             </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative group mb-6">
           <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
           </div>
           <input 
             type="text"
             placeholder="SEARCH MESSAGES..."
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-white focus:outline-none focus:border-primary/50 transition-all placeholder:text-white/10"
           />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-10 text-center animate-in fade-in duration-700">
            <div className="w-24 h-24 mb-6 relative">
               <div className="absolute inset-0 bg-primary/5 blur-2xl rounded-full" />
               <svg className="w-24 h-24 text-white/20 relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                 <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
               </svg>
            </div>
            <h3 className="text-lg font-black text-white uppercase tracking-widest mb-2">Empty inbox</h3>
            <p className="text-[10px] text-white/20 uppercase font-bold tracking-[0.3em]">Message someone</p>
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const otherUser = conv.users.find(u => u.handle !== currentUserHandle) || conv.users[0];
            const lastMessage = conv.messages?.[0];
            const isActive = activeId === conv.id;

            return (
              <div
                key={conv.id}
                onClick={() => onSelect(conv.id)}
                className={`flex items-center gap-4 p-5 cursor-pointer transition-all duration-300 border-l-2 ${
                  isActive 
                  ? 'bg-white/[0.03] border-primary' 
                  : 'border-transparent hover:bg-white/[0.01]'
                }`}
              >
                <div className="w-12 h-12 rounded-none bg-primary shrink-0 flex items-center justify-center text-xs font-black text-black overflow-hidden scale-90">
                  {otherUser.avatar ? (
                    <img src={otherUser.avatar} alt={otherUser.name} className="w-full h-full object-cover" />
                  ) : (
                    otherUser.name?.[0] || '?'
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-black text-[11px] text-white uppercase tracking-wider truncate">
                      {otherUser.name}
                    </span>
                  </div>
                  <p className={`text-[10px] uppercase tracking-tight truncate ${isActive ? 'text-white/60' : 'text-white/30'}`}>
                    {lastMessage ? lastMessage.text : 'NO MESSAGES YET'}
                  </p>
                </div>
                {lastMessage && (
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[8px] font-black text-white/20 uppercase tracking-tighter">
                      {new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
