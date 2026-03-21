import { useMemo } from "react";
import DropCard, { DropShape } from "@/app/components/DropCard";

export default function ProfilePage({ params }: { params: { id: string } }) {
  // Mocking profile data for the legacy dynamic profile route
  const user = {
    name: "The Creator",
    email: "hello@dropit.local",
    bio: "Building the future of social media with DROP IT. Minimalist, premium, and fast.",
    followers: 1250,
    following: 342,
    posts_count: 3,
  };

  const mockDrops: DropShape[] = [
    {
      id: "1",
      text: "Just launched DROP IT! The most premium social experience yet. #DROPIT #Launch",
      vibe: "Hustle",
      caption: "",
      mediaType: null,
      mediaUrl: null,
      duration: 0,
      saves: 42,
      reDrops: 5,
      tips: 0,
      createdAt: new Date().toISOString(),
      author: { name: user.name, handle: "thecreator", id: "1" }
    },
    {
      id: "2",
      text: "Design is not just what it looks like and feels like. Design is how it works.",
      vibe: "Deep",
      caption: "",
      mediaType: null,
      mediaUrl: null,
      duration: 0,
      saves: 12,
      reDrops: 2,
      tips: 5,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      author: { name: user.name, handle: "thecreator", id: "1" }
    }
  ];

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-12">
        <div className="flex items-end gap-6 mb-6">
          <div className="h-32 w-32 rounded-3xl bg-gradient-to-tr from-primary to-purple-400 shadow-2xl shadow-primary/20" />
          <div className="flex-1 pb-2">
            <h1 className="text-3xl font-black tracking-tight">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
          <button className="mb-2 rounded-full border border-border px-6 py-2 text-sm font-semibold transition-colors hover:bg-muted">
            Follow
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

      <div className="flex border-b border-border mb-8">
        <button className="px-6 py-4 border-b-2 border-primary font-bold">Drops</button>
      </div>

      <div className="space-y-4">
        {mockDrops.map((drop) => (
          <DropCard key={drop.id} drop={drop} />
        ))}
      </div>
    </main>
  );
}
