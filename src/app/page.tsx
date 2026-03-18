"use client";

import { useEffect, useMemo, useState } from "react";
import PostBox from "@/app/components/PostBox";
import TweetCard from "@/app/components/TweetCard";

type PostShape = {
  id: string;
  text: string;
  authorId: string;
  likes: number;
  createdAt: string;
  author: { name: string; email: string };
};

export default function HomePage() {
  const [posts, setPosts] = useState<PostShape[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const authorEmail = useMemo(() => "hello@twitter-clone.local", []);
  const authorName = useMemo(() => "The Creator", []);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/posts");
      if (!res.ok) throw new Error("Failed to load posts");
      const data = (await res.json()) as PostShape[];
      setPosts(data);
    } catch (e) {
      setError("Could not load feed. Refresh or check server.");
    } finally {
      setLoading(false);
    }
  }

  async function handlePost(text: string, mediaUrl?: string, mediaType?: string) {
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, authorName, authorEmail, mediaUrl, mediaType }),
    });
    if (!res.ok) {
      throw new Error("POST failure");
    }
    await loadPosts();
  }

  return (
    <main className="mx-auto max-w-2xl p-4">
      <h1 className="text-4xl font-black tracking-tighter">TXT</h1>
      <p className="text-sm text-gray-500 mb-8">A premium social feed.</p>

      <PostBox onPost={handlePost} name={authorName} email={authorEmail} />

      {loading && <p className="text-gray-500">Loading posts…</p>}
      {error && <p className="text-red-500">{error}</p>}

      {posts.length === 0 && !loading ? (
        <p className="text-gray-500">No posts yet. Post something!</p>
      ) : (
        posts.map((post: PostShape) => <TweetCard key={post.id} post={post} />)
      )}
    </main>
  );
}
