"use client";

import React from "react";

export default function MessagesPage() {
  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto border-x border-white/5 bg-background overflow-hidden font-sans">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-white/5 sticky top-0 bg-background/80 backdrop-blur-md z-10">
        <h1 className="text-[28px] font-black tracking-tight">Chats</h1>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-white/5 rounded-full transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/70"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
          <button className="bg-primary hover:bg-primary/90 text-white font-bold px-6 py-2.5 rounded-full transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New chat
          </button>
        </div>
      </div>

      {/* Content - Empty State */}
      <div className="flex-1 flex flex-col items-center justify-center -mt-20 px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="mb-8 p-6 bg-primary/10 rounded-[2.5rem] relative">
          <div className="absolute inset-0 bg-primary/20 blur-3xl opacity-20 animate-pulse"></div>
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#2D8FF3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="relative z-10">
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
            <circle cx="8" cy="12" r="0.5" fill="currentColor" stroke="currentColor"/>
            <circle cx="12" cy="12" r="0.5" fill="currentColor" stroke="currentColor"/>
            <circle cx="16" cy="12" r="0.5" fill="currentColor" stroke="currentColor"/>
          </svg>
        </div>
        
        <h2 className="text-3xl font-black mb-3">Nothing here</h2>
        <p className="text-muted-foreground text-lg text-center max-w-sm leading-relaxed">
          You have no conversations yet. Start one!
        </p>
      </div>
    </div>
  );
}
