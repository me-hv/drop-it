"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import ConversationList from "@/app/components/ConversationList";
import ChatWindow from "@/app/components/ChatWindow";
import NewMessageModal from "@/app/components/NewMessageModal";

export default function MessagesPage() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id");
  
  const [conversations, setConversations] = React.useState<any[]>([]);
  const [activeConversationId, setActiveConversationId] = React.useState<string | null>(null);
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isNewMessageModalOpen, setIsNewMessageModalOpen] = React.useState(false);

  React.useEffect(() => {
    async function init() {
      try {
        const [userRes, convRes] = await Promise.all([
          fetch("/api/users/me"),
          fetch("/api/messages/conversations")
        ]);

        if (userRes.ok && convRes.ok) {
          const userData = await userRes.json();
          const convData = await convRes.json();
          setCurrentUser(userData);
          setConversations(convData);
          
          if (initialId) {
            setActiveConversationId(initialId);
          } else if (convData.length > 0) {
            setActiveConversationId(convData[0].id);
          }
        }
      } catch (e) {
        console.error("Initialization failed", e);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, [initialId]);

  const handleSelectUser = async (userId: string) => {
    try {
      const res = await fetch("/api/messages/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: userId })
      });
      if (res.ok) {
        const conv = await res.json();
        setConversations((prev: any[]) => {
          const exists = prev.find((c: any) => c.id === conv.id);
          if (exists) return prev;
          return [conv, ...prev];
        });
        setActiveConversationId(conv.id);
        setIsNewMessageModalOpen(false);
      }
    } catch (e) {
      console.error("Failed to start conversation", e);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-black">
        <div className="text-[12px] font-black text-primary tracking-[1em] animate-pulse uppercase">Connecting...</div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="h-full flex items-center justify-center bg-black p-10 text-center">
        <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Please log in to access messages</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh)] bg-black overflow-hidden border-t border-white/5">
      {/* List */}
      <div className="w-[300px] flex-shrink-0">
        <ConversationList 
          conversations={conversations}
          activeId={activeConversationId}
          onSelect={setActiveConversationId}
          currentUserHandle={currentUser.handle}
          onNewMessage={() => setIsNewMessageModalOpen(true)}
        />
      </div>

      {/* Chat */}
      <div className="flex-1 bg-white/[0.01]">
        <ChatWindow 
          conversationId={activeConversationId}
          currentUser={currentUser}
          onNewMessage={() => setIsNewMessageModalOpen(true)}
        />
      </div>

      {isNewMessageModalOpen && (
        <NewMessageModal 
          onClose={() => setIsNewMessageModalOpen(false)}
          onSelectUser={handleSelectUser}
        />
      )}
    </div>
  );
}
