"use client";
import React, { useState } from "react";

type PostBoxProps = {
  onPost: (text: string, mediaUrl: string, mediaType: "image" | "video", metadata?: string) => Promise<void>;
  name?: string;
  email?: string;
  isModal?: boolean;
};

export default function PostBox({ onPost, name, email, isModal }: PostBoxProps) {
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
    <div className={`${isModal ? "" : "p-4 bg-background"} relative w-full overflow-hidden transition-all`}>
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="h-12 w-12 rounded-full bg-gray-300 shrink-0" />

        <div className="flex-1">
          <textarea
            aria-label="Create a post"
            value={text}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
              if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                e.preventDefault();
                submit();
              }
            }}
            placeholder="What's happening?!"
            className="w-full resize-none bg-transparent py-2 text-[19px] text-foreground outline-none placeholder:text-muted-foreground/60 transition-all"
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
                   className="w-full bg-background rounded-md p-2 text-sm focus:bg-muted outline-none transition-all"
                 />
               ))}
               <button onClick={() => setPollOptions([...pollOptions, ""])} className="text-xs font-bold text-primary hover:underline">+ Add option</button>
            </div>
          )}

          {mediaUrl && (
            <div className="mt-2 mb-4 overflow-hidden rounded-lg group relative">
              {mediaType === "video" ? (
                <video src={mediaUrl} className="w-full h-auto" controls />
              ) : (
                <img src={mediaUrl} className="w-full h-auto" alt="Preview" />
              )}
              <button 
                onClick={() => setMediaUrl("")}
                className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-black/70 transition-all font-bold text-white text-xs px-2"
              >
                X
              </button>
            </div>
          )}

          {/* Icons and Submit Row */}
          <div className="flex items-center justify-between mt-2 pt-2">
            <div className="flex gap-2 relative">
               <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Media"
                  className="p-2 text-primary hover:bg-muted rounded-md transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
               </button>

               {/* GIF Picker Popover */}
               <div className="relative">
                 <button onClick={() => { setShowGifPicker(!showGifPicker); setShowEmojiPicker(false); }} title="GIF" className={`p-2 rounded-md transition-colors ${showGifPicker ? 'bg-muted text-primary' : 'text-primary hover:bg-muted'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 8h2.5"/><path d="M7 12h2.5"/><path d="M7 16h2.5"/><path d="M14 8h3"/><path d="M14 12h3"/><path d="M14 16h3"/></svg>
                 </button>
                 {showGifPicker && (
                   <div className="absolute top-full left-0 mt-2 w-72 bg-background border border-border rounded-lg shadow-xl z-[100] overflow-hidden">
                      <div className="p-2">
                        <input 
                          autoFocus
                          placeholder="Search GIFs"
                          value={gifSearchQuery}
                          onChange={(e) => setGifSearchQuery(e.target.value)}
                          className="w-full bg-muted rounded-md py-1.5 px-3 text-sm outline-none transition-all"
                        />
                      </div>
                      <div className="px-2 pb-2 max-h-60 overflow-y-auto">
                         <div className="grid grid-cols-2 gap-2">
                           {filteredGifs.map((gif, i) => (
                             <img 
                               key={gif.id} 
                               src={gif.url} 
                               alt={gif.title}
                               onClick={() => selectGif(gif.url)}
                               className="w-full object-cover rounded cursor-pointer hover:opacity-80 transition-all bg-muted"
                             />
                           ))}
                         </div>
                      </div>
                   </div>
                 )}
               </div>

               {/* Emoji Picker Popover */}
               <div className="relative">
                 <button onClick={() => { setShowEmojiPicker(!showEmojiPicker); setShowGifPicker(false); }} title="Emoji" className={`p-2 rounded-md transition-colors ${showEmojiPicker ? 'bg-muted text-primary' : 'text-primary hover:bg-muted'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                 </button>
                 {showEmojiPicker && (
                   <div className="absolute top-full left-0 mt-2 w-64 bg-background rounded-lg shadow-xl z-[100] p-2">
                      <div className="grid grid-cols-6 gap-1 max-h-40 overflow-y-auto">
                        {EMOJIS.map(e => (
                          <button key={e} onClick={() => selectEmoji(e)} className="text-xl hover:bg-muted p-1 rounded transition-all">{e}</button>
                        ))}
                      </div>
                   </div>
                 )}
               </div>

               <button onClick={() => setShowPoll(!showPoll)} title="Poll" className={`p-2 rounded-md transition-colors ${showPoll ? 'bg-muted text-primary' : 'text-primary hover:bg-muted'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="15" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="11" y2="18"/></svg>
               </button>
               <button onClick={handleLocation} title="Location" className={`p-2 rounded-md transition-colors ${metadata.location ? 'bg-muted text-primary' : 'text-primary hover:bg-muted'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
               </button>
            </div>

            <button
              onClick={submit}
              disabled={loading || (!text.trim() && !mediaUrl.trim() && !showPoll)}
              className="btn text-sm"
            >
              {loading ? "..." : "Post"}
            </button>
          </div>
        </div>
      </div>
      {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
    </div>
  );
}
