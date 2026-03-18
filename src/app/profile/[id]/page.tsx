import { useMemo } from "react";
import TweetCard from "@/app/components/TweetCard";

export default function ProfilePage({ params }: { params: { id: string } }) {
  // Mocking profile data for now
  const user = {
    name: "The Creator",
    email: "hello@txt.local",
    bio: "Building the future of social media with TXT. Minimalist, premium, and fast.",
    followers: 1250,
    following: 342,
    posts_count: 3,
  };

  const mockPosts = [
    {
      id: "1",
      text: "Just launched TXT! The most premium social experience yet. #TXT #Launch",
      likes: 42,
      createdAt: new Date().toISOString(),
      authorId: "me",
      author: { name: user.name, email: user.email },
    },
    {
      id: "2",
      text: "Design is not just what it looks like and feels like. Design is how it works.",
      likes: 12,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      authorId: "me",
      author: { name: user.name, email: user.email },
    },
    {
      id: "3",
      text: "The details are not the details. They make the design.",
      likes: 8,
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      authorId: "me",
      author: { name: user.name, email: user.email },
    },
  ];

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      {/* Profile Header */}
      <div className="mb-12">
        <div className="flex items-end gap-6 mb-6">
          <div className="h-32 w-32 rounded-3xl bg-gradient-to-tr from-primary to-purple-400 shadow-2xl shadow-primary/20" />
          <div className="flex-1 pb-2">
            <h1 className="text-3xl font-black tracking-tight">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
          <button className="mb-2 rounded-full border border-border px-6 py-2 text-sm font-semibold transition-colors hover:bg-muted">
            Edit Profile
          </button>
        </div>
        
        <p className="text-lg leading-relaxed mb-6">{user.bio}</p>
        
        <div className="flex gap-6">
          <div className="flex gap-1 items-baseline">
            <span className="font-bold text-lg">{user.following}</span>
            <span className="text-muted-foreground text-sm">Following</span>
          </div>
          <div className="flex gap-1 items-baseline">
            <span className="font-bold text-lg">{user.followers}</span>
            <span className="text-muted-foreground text-sm">Followers</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border mb-8">
        <button className="px-6 py-4 border-b-2 border-primary font-bold">Posts</button>
        <button className="px-6 py-4 text-muted-foreground hover:bg-muted transition-colors">Replies</button>
        <button className="px-6 py-4 text-muted-foreground hover:bg-muted transition-colors">Highlights</button>
        <button className="px-6 py-4 text-muted-foreground hover:bg-muted transition-colors">Media</button>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {mockPosts.map((post) => (
          <TweetCard key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
}
