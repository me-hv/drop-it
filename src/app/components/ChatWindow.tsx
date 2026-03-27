"use client";

import React from "react";

interface Message {
  id: string;
  text: string;
  senderId: string;
  sender: any;
  createdAt: string;
}

interface ChatWindowProps {
  conversationId: string | null;
  currentUser: any;
  onNewMessage: () => void;
}

export default function ChatWindow({ conversationId, currentUser, onNewMessage }: ChatWindowProps) {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [inputText, setInputText] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const fetchMessages = React.useCallback(async () => {
    try {
      const res = await fetch(`/api/messages/${conversationId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (e) {
      console.error("Failed to fetch messages", e);
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  React.useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // Poll every 3s
    return () => clearInterval(interval);
  }, [fetchMessages]);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const text = inputText;
    setInputText("");

    try {
      const res = await fetch(`/api/messages/${conversationId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });

      if (res.ok) {
        const newMessage = await res.json();
        setMessages((prev: Message[]) => [...prev, newMessage]);
      }
    } catch (e) {
      console.error("Failed to send message", e);
    }
  };

  if (!conversationId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-black animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 mb-10 relative">
           <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full animate-pulse" />
           <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative z-10 shadow-2xl">
             <svg className="w-12 h-12 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
               <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
             </svg>
           </div>
        </div>
        <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-4">Start Conversation</h2>
        <p className="text-[11px] text-white/30 uppercase font-black tracking-widest max-w-xs mb-10 leading-relaxed">
          Choose from your existing conversations, or start a new one.
        </p>
        <button 
          onClick={onNewMessage}
          className="px-8 py-3.5 bg-white text-black text-[11px] font-black uppercase tracking-[0.3em] rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5"
        >
          New chat
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-black">
        <div className="text-[10px] text-primary uppercase font-black tracking-[0.5em] animate-pulse">Establishing Signal...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0a0a0c]">
      {/* Messages list */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6"
      >
        {messages.map((msg: Message) => {
          const isMe = msg.senderId === currentUser.id;
          
          return (
            <div 
              key={msg.id} 
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div className={`max-w-[80%] p-4 text-[11px] leading-relaxed uppercase tracking-wider ${
                isMe 
                ? 'bg-primary text-black font-black' 
                : 'bg-white/5 text-white/80 border border-white/5 font-bold'
              }`}>
                {msg.text}
              </div>
              <span className="text-[8px] text-white/20 mt-2 font-black uppercase tracking-tighter">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        })}
        {messages.length === 0 && (
          <div className="flex-1 flex items-center justify-center h-full opacity-10 grayscale">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
              </svg>
              <p className="text-[10px] font-black uppercase tracking-[0.3em]">Start the signal</p>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <form 
        onSubmit={handleSendMessage}
        className="p-6 border-t border-white/5 bg-black/20 backdrop-blur-md"
      >
        <div className="relative group">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="TYPE YOUR MESSAGE..."
            className="w-full bg-white/5 border border-white/10 p-5 pr-20 text-[10px] uppercase font-black tracking-widest text-white focus:outline-none focus:border-primary/50 transition-all placeholder:text-white/10"
          />
          <button 
            type="submit"
            className="absolute right-2 top-2 bottom-2 px-6 bg-primary text-black text-[9px] font-black uppercase tracking-widest hover:scale-95 active:scale-90 transition-all shadow-lg shadow-primary/20"
          >
            SEND
          </button>
        </div>
      </form>
    </div>
  );
}
