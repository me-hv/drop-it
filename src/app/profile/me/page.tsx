"use client";

import { useEffect, useState } from "react";
import TweetCard from "@/app/components/TweetCard";
import ProfileHeader from "@/app/components/ProfileHeader";

type User = {
  id: string;
  name: string;
  email: string;
  handle?: string | null;
  bio?: string | null;
  location?: string | null;
  website?: string | null;
  image?: string | null;
  coverImage?: string | null;
  createdAt: string;
};

type PostShape = {
  id: string;
  text: string;
  authorId: string;
  likes: number;
  mediaUrl?: string | null;
  mediaType?: string | null;
  metadata?: string | null;
  pinned: boolean;
  createdAt: string;
  author: { name: string; email: string };
};

export default function MyProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<PostShape[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [userRes, postsRes] = await Promise.all([
          fetch("/api/users/me"),
          fetch("/api/posts")
        ]);

        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData);
          
          if (postsRes.ok) {
            const allPosts = await postsRes.json();
            // Filter posts by this user's email
            setPosts(allPosts.filter((p: PostShape) => p.author.email === userData.email));
          }
        }
      } catch (e) {
        console.error("Failed to load profile data:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        <div className="animate-pulse">Loading your profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error: Could not load profile.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <ProfileHeader initialUser={user} />

      {/* Profile Tabs */}
      <div className="flex border-b border-white/5 px-4 mb-2">
         {["Posts", "Replies", "Highlights", "Media", "Likes"].map((tab, i) => (
           <div key={tab} className={`px-4 py-4 font-bold text-[15px] cursor-pointer hover:bg-white/5 transition-all relative ${i === 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
              {tab}
              {i === 0 && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-full transition-all" />}
           </div>
         ))}
      </div>

      {/* User Posts Feed */}
      <div className="divide-y divide-white/5">
        {posts.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            You haven't posted anything yet on TXT.
          </div>
        ) : (
          posts.map(post => <TweetCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}
