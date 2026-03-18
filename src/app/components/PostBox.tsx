"use client";
import React, { useState } from "react";

type PostBoxProps = {
  onPost: (text: string, mediaUrl: string, mediaType: "image" | "video", metadata?: string) => Promise<void>;
  name?: string;
  email?: string;
};

export default function PostBox({ onPost, name, email }: PostBoxProps) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [metadata, setMetadata] = useState<any>({});
  const [showPoll, setShowPoll] = useState(false);
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [gifSearchQuery, setGifSearchQuery] = useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const EMOJIS = [
    "😊", "😂", "🤣", "❤️", "👍", "🔥", "✨", "🙌", "😍", "🤔", 
    "😎", "😭", "😮", "👏", "🎉", "💯", "🙏", "🚀", "💡", "✅",
    "🍕", "🍔", "🍦", "🍷", "🍺", "🌍", "🌈", "☀️", "🌙", "⭐",
    "🐶", "🐱", "🦁", "🐧", "🤖", "🎮", "⚽", "🎵", "📷", "💻"
  ];

  const MOCK_GIFS = [
    { id: 1, url: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHJqZ3R6Z3Z6Z3Z6Z3Z6Z3Z6Z3Z6Z3Z6Z3Z6Z3Z6Z3Z/3o7TKDkDbIDJieKbVm/giphy.gif", title: "Party", tags: ["party", "dance"] },
    { id: 2, url: "https://media.tenor.com/zXn_X-q5AasAAAAC/excited-dance.gif", title: "Excited", tags: ["happy", "dance"] },
    { id: 3, url: "https://media.tenor.com/images/1c713b63897f262a0c4434241777085c/tenor.gif", title: "Funny Cat", tags: ["cat", "funny"] },
    { id: 4, url: "https://media.tenor.com/images/30349479b1979204005118742ba6ec70/callback/tenor.gif", title: "Dog Smile", tags: ["dog", "happy"] },
    { id: 5, url: "https://media.tenor.com/images/0a28f80f6825c0e0b3c21c7849e7b231/tenor.gif", title: "Thinking", tags: ["hmmm", "smart"] },
    { id: 6, url: "https://media.tenor.com/images/4f4e9185e3c7821644782bb042c1766a/tenor.gif", title: "Rocket", tags: ["moon", "crypto"] },
    { id: 7, url: "https://media.tenor.com/images/19cb072c43e498d9e6cc8628290a1841/tenor.gif", title: "Approved", tags: ["yes", "ok"] },
    { id: 8, url: "https://media.tenor.com/images/6df104d44449856cc196c1615dcd7fef/tenor.gif", title: "Shocked", tags: ["wow", "surprised"] }
  ];

  const filteredGifs = gifSearchQuery.trim() === "" 
    ? MOCK_GIFS 
    : MOCK_GIFS.filter(gif => 
        gif.title.toLowerCase().includes(gifSearchQuery.toLowerCase()) || 
        gif.tags.some(tag => tag.toLowerCase().includes(gifSearchQuery.toLowerCase()))
      );

  function onChange(e: any) {
    setText(e.target.value);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setMediaUrl(result);
      if (file.type.startsWith("video/")) {
        setMediaType("video");
      } else {
        setMediaType("image");
      }
    };
    reader.readAsDataURL(file);
  }

  function handleLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
          setMetadata({ ...metadata, location: "Somewhere on Earth" });
      });
    }
  }

  function selectEmoji(emoji: string) {
    setText(text + emoji);
    setShowEmojiPicker(false);
  }

  function selectGif(url: string) {
    setMediaUrl(url);
    setMediaType("image");
    setShowGifPicker(false);
  }

  async function submit() {
    if (!text.trim() && !mediaUrl.trim() && !showPoll) return;
    setLoading(true);
    setError(null);

    try {
      let currentMetadata = { ...metadata };
      if (showPoll) {
        currentMetadata.poll = pollOptions.filter(o => o.trim());
      }

      await onPost(text.trim(), mediaUrl.trim(), mediaType, JSON.stringify(currentMetadata));
      setText("");
      setMediaUrl("");
      setMetadata({});
      setShowPoll(false);
      setPollOptions(["", ""]);
      setShowEmojiPicker(false);
      setShowGifPicker(false);
    } catch (e) {
      setError("Could not post. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border-b border-border bg-black p-4 relative w-full">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-purple-400 shrink-0" />

        <div className="flex-1">
          <textarea
            aria-label="Create a post"
            value={text}
            onChange={onChange}
            placeholder="What is happening?!"
            className="w-full resize-none bg-transparent py-2 text-[20px] text-white outline-none placeholder:text-muted-foreground"
            rows={text.split('\n').length || 1}
          />

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,video/*"
            className="hidden"
          />

          {showPoll && (
            <div className="mt-2 mb-4 space-y-2">
               {pollOptions.map((opt, i) => (
                 <input 
                   key={i}
                   value={opt}
                   onChange={(e) => {
                     const newOpts = [...pollOptions];
                     newOpts[i] = e.target.value;
                     setPollOptions(newOpts);
                   }}
                   placeholder={`Option ${i+1}`}
                   className="w-full bg-black border border-border rounded-lg p-2 text-sm text-white focus:border-primary outline-none"
                 />
               ))}
               <button onClick={() => setPollOptions([...pollOptions, ""])} className="text-sm font-bold text-primary hover:underline transition-all">+ Add option</button>
            </div>
          )}

          {mediaUrl && (
            <div className="mt-2 mb-4 overflow-hidden rounded-2xl border border-border group relative">
              {mediaType === "video" ? (
                <video src={mediaUrl} className="w-full h-auto" controls />
              ) : (
                <img src={mediaUrl} className="w-full h-auto" alt="Preview" />
              )}
              <button 
                onClick={() => setMediaUrl("")}
                className="absolute top-2 right-2 p-1.5 bg-black/70 rounded-full hover:bg-black/90 transition-all shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          )}

          {/* Icons and Submit Row */}
          <div className="flex items-center justify-between border-t border-border/10 mt-2 pt-3">
            <div className="flex gap-1 -ml-2 relative">
               <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Media"
                  className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
               </button>

               {/* GIF Picker Popover */}
               <div className="relative">
                 <button onClick={() => { setShowGifPicker(!showGifPicker); setShowEmojiPicker(false); }} title="GIF" className={`p-2 rounded-full transition-colors ${showGifPicker ? 'bg-primary/10 text-primary' : 'text-primary hover:bg-primary/10'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 8h2.5"/><path d="M7 12h2.5"/><path d="M7 16h2.5"/><path d="M14 8h3"/><path d="M14 12h3"/><path d="M14 16h3"/></svg>
                 </button>
                 {showGifPicker && (
                   <div className="absolute top-full left-0 mt-2 w-[350px] bg-black border border-border rounded-2xl shadow-[0_8px_30px_rgb(255,255,255,0.1)] z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      {/* GIF Header */}
                      <div className="px-4 py-3 flex items-center border-b border-border">
                        <h3 className="text-lg font-bold text-white">Choose a GIF</h3>
                      </div>
                      {/* Search */}
                      <div className="p-3">
                        <input 
                          autoFocus
                          placeholder="Search GIFs"
                          value={gifSearchQuery}
                          onChange={(e) => setGifSearchQuery(e.target.value)}
                          className="w-full bg-[#202327] border-none rounded-full py-2 px-4 text-sm text-white focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground"
                        />
                      </div>
                      <div className="px-3 pb-3 max-h-[300px] overflow-y-auto custom-scrollbar">
                         <div className="columns-2 gap-2">
                           {filteredGifs.map((gif, i) => (
                             <img 
                               key={gif.id} 
                               src={gif.url} 
                               alt={gif.title}
                               onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                               onClick={() => selectGif(gif.url)}
                               className="mb-2 w-full object-cover rounded-xl cursor-pointer hover:opacity-80 transition-all active:scale-95 bg-muted"
                             />
                           ))}
                         </div>
                      </div>
                   </div>
                 )}
               </div>

               {/* Emoji Picker Popover */}
               <div className="relative">
                 <button onClick={() => { setShowEmojiPicker(!showEmojiPicker); setShowGifPicker(false); }} title="Emoji" className={`p-2 rounded-full transition-colors ${showEmojiPicker ? 'bg-primary/10 text-primary' : 'text-primary hover:bg-primary/10'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                 </button>
                 {showEmojiPicker && (
                   <div className="absolute top-full left-0 mt-2 w-72 bg-black border border-border rounded-2xl shadow-[0_8px_30px_rgb(255,255,255,0.1)] z-[100] p-3 animate-in fade-in zoom-in-95 duration-200">
                      <div className="grid grid-cols-6 gap-2 max-h-[200px] overflow-y-auto custom-scrollbar pr-1">
                        {EMOJIS.map(e => (
                          <button key={e} onClick={() => selectEmoji(e)} className="text-2xl hover:bg-white/10 p-1.5 rounded-lg transition-all">{e}</button>
                        ))}
                      </div>
                   </div>
                 )}
               </div>

               <button onClick={() => setShowPoll(!showPoll)} title="Poll" className={`p-2 rounded-full transition-colors ${showPoll ? 'bg-primary/10 text-primary' : 'text-primary hover:bg-primary/10'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="15" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="11" y2="18"/></svg>
               </button>
               <button onClick={handleLocation} title="Location" className={`p-2 rounded-full transition-colors ${metadata.location ? 'bg-primary/10 text-primary' : 'text-primary hover:bg-primary/10'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
               </button>
            </div>

            <button
              onClick={submit}
              disabled={loading || (!text.trim() && !mediaUrl.trim() && !showPoll)}
              className="rounded-full bg-primary px-5 py-1.5 text-[15px] font-bold text-white transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-50"
            >
              {loading ? "..." : "Post"}
            </button>
          </div>
        </div>
      </div>
      {error && <p className="mt-2 text-sm font-medium text-destructive">{error}</p>}
    </div>
  );
}
