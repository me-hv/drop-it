"use client";

import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { useUI } from "@/app/context/UIContext";

// Dynamic imports for heavy pickers
const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });
const GifPicker = dynamic(() => import("./GifPicker"), { ssr: false });
const LocationPicker = dynamic(() => import("./LocationPicker"), { ssr: false });
const SchedulePicker = dynamic(() => import("./SchedulePicker"), { ssr: false });

interface PostBoxProps {
  isModal?: boolean;
}

export default function PostBox({ isModal }: PostBoxProps) {
  const { isPostModalOpen, closePostModal } = useUI();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Unified Media State
  const [files, setFiles] = useState<File[]>([]);
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"audio" | "video" | "image" | null>(null);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showSchedulePicker, setShowSchedulePicker] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [location, setLocation] = useState<string | null>(null);

  // Poll State
  const [showPoll, setShowPoll] = useState(false);
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);
  const [pollDays, setPollDays] = useState<number>(1);
  const [pollHours, setPollHours] = useState<number>(0);
  const [pollMinutes, setPollMinutes] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiContainerRef = useRef<HTMLDivElement>(null);

  // Handle outside clicks for Emoji Picker
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (showEmojiPicker && emojiContainerRef.current && !emojiContainerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    const newFiles = [...files, ...selectedFiles].slice(0, 10);
    setFiles(newFiles);

    if (!mediaPreview && newFiles.length > 0) {
      const file = newFiles[0];
      const url = URL.createObjectURL(file);
      setMediaPreview(url);
      if (file.type.startsWith('image/')) setMediaType('image');
      else if (file.type.startsWith('video/')) setMediaType('video');
      else if (file.type.startsWith('audio/')) setMediaType('audio');
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    if (newFiles.length === 0) {
      setMediaPreview(null);
      setMediaType(null);
    } else if (index === 0 && newFiles.length > 0) {
      const file = newFiles[0];
      const url = URL.createObjectURL(file);
      setMediaPreview(url);
    }
  };

  const onEmojiClick = (emojiData: any) => {
    setText(prev => prev + emojiData.emoji);
  };

  const handleSubmit = async () => {
    if (!text && files.length === 0 && !gifUrl && !showPoll) return;
    setLoading(true);
    setError(null);

    try {
      let finalMediaUrl = "";
      
      if (files.length > 0) {
        const uploadedUrls = [];
        for (const file of files) {
          const formData = new FormData();
          formData.append("file", file);
          const uploadRes = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (!uploadRes.ok) {
             const t = await uploadRes.text();
             throw new Error(`Upload failed (${uploadRes.status}): ${t.slice(0, 50)}`);
          }

          const uploadData = await uploadRes.json();
          if (uploadData.url) uploadedUrls.push(uploadData.url);
        }
        finalMediaUrl = uploadedUrls.length > 1 ? JSON.stringify(uploadedUrls) : uploadedUrls[0];
      } else if (gifUrl) {
        finalMediaUrl = gifUrl;
      }

      // Prepare Drop Data mapping
      const dropPayload = {
          text,
          mediaUrl: finalMediaUrl,
          mediaType: mediaType || (gifUrl ? "image" : null),
          duration: 0,
          vibe: "For You", // Default vibe required by /api/drops
          caption: text.slice(0, 50),
          location,
          pollOptions: showPoll ? JSON.stringify(pollOptions.filter(o => o.trim())) : null,
          pollEndsAt: showPoll ? new Date(Date.now() + (pollDays * 86400000) + (pollHours * 3600000) + (pollMinutes * 60000)).toISOString() : null,
          scheduledDate: scheduledDate?.toISOString() || null,
      };

      const res = await fetch("/api/drops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dropPayload),
      });

      if (res.ok) {
        setText("");
        setFiles([]);
        setGifUrl(null);
        setMediaPreview(null);
        setMediaType(null);
        setShowPoll(false);
        setLocation(null);
        setScheduledDate(null);
        if (isPostModalOpen) closePostModal();
        window.location.reload();
      } else {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
           const d = await res.json();
           setError(d.error || "Failed to create Drop");
        } else {
           const text = await res.text();
           setError(`Server Error (${res.status}): ${text.slice(0, 100)}`);
        }
      }
    } catch (err: any) {
      console.error("Post error:", err);
      setError(err.message || "An error occurred while dropping");
    } finally {
      setLoading(false);
    }
  };

  function renderPostContent() {
    return (
      <div className="flex gap-4">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 text-primary font-black uppercase overflow-hidden">
          {localStorage.getItem("drops_handle")?.charAt(0) || "U"}
        </div>
        <div className="flex-1 min-w-0">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Whats on your mind?"
            className="w-full bg-transparent border-none text-[21px] font-medium text-white outline-none resize-none min-h-[120px] placeholder:text-muted-foreground/30 py-2"
          />

          {/* Media Previews Row */}
          {files.length > 0 && (
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
              {files.map((file, i) => (
                <div key={i} className="relative w-24 h-24 shrink-0 rounded-2xl overflow-hidden border border-white/10 group bg-white/5 shadow-xl">
                  {file.type.startsWith('image/') ? (
                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="preview" />
                  ) : (
                    <div className="w-full h-full bg-white/5 flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                    </div>
                  )}
                  <button 
                    onClick={() => removeFile(i)}
                    className="absolute top-1 right-1 bg-black/80 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-2xl backdrop-blur-md"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ff4444" strokeWidth="4"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {gifUrl && (
            <div className="relative rounded-2xl overflow-hidden border border-white/10 mb-4 bg-black/20 group">
              <img src={gifUrl} className="w-full max-h-[400px] object-contain" alt="Selected GIF" />
              <button 
                onClick={() => setGifUrl(null)}
                className="absolute top-3 right-3 bg-black/60 p-2 rounded-full hover:bg-black/90 transition-all opacity-0 group-hover:opacity-100 backdrop-blur-md border border-white/10"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
          )}

          {showPoll && (
            <div className="border border-white/10 rounded-3xl p-5 mb-4 bg-white/[0.03] backdrop-blur-xl animate-in scale-in duration-300">
              <div className="space-y-4">
                {pollOptions.map((opt, i) => (
                  <div key={i} className="flex gap-3">
                    <input
                      placeholder={`Choice ${i + 1}`}
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...pollOptions];
                        newOpts[i] = e.target.value;
                        setPollOptions(newOpts);
                      }}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary/50 transition-all h-[50px] font-medium"
                    />
                    {pollOptions.length > 2 && (
                      <button 
                        onClick={() => setPollOptions(pollOptions.filter((_, idx) => idx !== i))}
                        className="p-3 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                      >
                         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setPollOptions([...pollOptions, ''])}
                className="mt-4 text-primary text-[15px] font-black hover:opacity-80 px-2 tracking-tight"
                disabled={pollOptions.length >= 4}
              >
                + ADD CHOICE
              </button>
              
              <div className="mt-6 pt-5 border-t border-white/5">
                 <p className="text-[13px] font-black tracking-widest text-white/40 mb-4 uppercase">Poll Duration</p>
                 <div className="flex gap-4">
                    <div className="flex-1">
                       <label className="text-[10px] font-bold text-muted-foreground mb-1 block uppercase tracking-widest">Days</label>
                       <select value={pollDays} onChange={(e) => setPollDays(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-primary/30">
                          {[0,1,2,3,4,5,6,7].map(d => <option key={d} value={d}>{d}</option>)}
                       </select>
                    </div>
                    <div className="flex-1">
                       <label className="text-[10px] font-bold text-muted-foreground mb-1 block uppercase tracking-widest">Hours</label>
                       <select value={pollHours} onChange={(e) => setPollHours(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-primary/30">
                          {Array.from({length: 24}, (_, i) => i).map(h => <option key={h} value={h}>{h}</option>)}
                       </select>
                    </div>
                    <div className="flex-1">
                       <label className="text-[10px] font-bold text-muted-foreground mb-1 block uppercase tracking-widest">Mins</label>
                       <select value={pollMinutes} onChange={(e) => setPollMinutes(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-primary/30">
                          {Array.from({length: 60}, (_, i) => i).map(m => <option key={m} value={m}>{m}</option>)}
                       </select>
                    </div>
                 </div>
              </div>

              <button 
                onClick={() => setShowPoll(false)}
                className="w-full mt-6 py-3 text-red-500 font-black tracking-widest text-[12px] uppercase hover:bg-red-500/10 rounded-2xl transition-all border border-red-500/20"
              >
                Cancel Poll
              </button>
            </div>
          )}

          {location && (
            <div className="flex items-center gap-2 mb-4 animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="bg-primary/10 text-primary px-4 py-2 rounded-full text-[13px] font-black tracking-tight flex items-center gap-2 border border-primary/20 shadow-lg shadow-primary/5 uppercase">
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="3" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                {location}
                <button onClick={() => setLocation(null)} className="hover:text-white ml-2 transition-colors">
                   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>
            </div>
          )}

          {scheduledDate && (
            <div className="flex items-center gap-2 mb-4 animate-in fade-in slide-in-from-left-4 duration-500">
               <div className="bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full text-[13px] font-black tracking-tight flex items-center gap-2 border border-emerald-500/20 shadow-lg shadow-emerald-500/5 uppercase">
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                 Release: {scheduledDate.toLocaleDateString([], { month: 'short', day: 'numeric' })} @ {scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                 <button onClick={() => setScheduledDate(null)} className="hover:text-white ml-2 transition-colors">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M18 6L6 18M6 6l12 12"/></svg>
                 </button>
               </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  function renderToolbar() {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            className="hidden" 
            accept="image/*,video/*,video/quicktime,audio/*"
            multiple
          />
          <button 
            type="button" 
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-primary hover:bg-primary/10 rounded-full transition-all hover:scale-110 active:scale-90"
            title="Media"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z"></path></svg>
          </button>
          
          <button 
            type="button" 
            onClick={() => { setShowGifPicker(true); setShowPoll(false); }}
            className="p-3 text-primary hover:bg-primary/10 rounded-full transition-all hover:scale-110 active:scale-90"
            title="GIF"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5V18c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5V5.5c0-.276-.224-.5-.5-.5h-13zM8.5 8h2v1h-2v3h2v1h-3V8h1zm6 4.5h-1V9h1v1h1V8h-3v5h3v-2h-1v1.5z"></path></svg>
          </button>

          <button 
            type="button" 
            onClick={() => { setShowPoll(true); setFiles([]); setGifUrl(null); }}
            className={`p-3 hover:bg-primary/10 rounded-full transition-all hover:scale-110 active:scale-90 ${showPoll ? 'text-primary bg-primary/10' : 'text-primary'}`}
            title="Poll"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M6 5c-1.105 0-2 .895-2 2v10c0 1.105.895 2 2 2h12c1.105 0 2-.895 2-2V7c0-1.105-.895-2-2-2H6zm0 2h12v10H6V7zm2 2v2h8V9H8zm0 4v2h5v-2H8z"></path></svg>
          </button>

          <div className="relative" ref={emojiContainerRef}>
            <button 
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`p-3 hover:bg-primary/10 rounded-full transition-all hover:scale-110 active:scale-90 ${showEmojiPicker ? 'text-primary bg-primary/10' : 'text-primary'}`}
              title="Emoji"
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path><path d="M9.5 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm5 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM12 18a5.921 5.921 0 0 1-4.825-2.405l-1.31 1.115A7.96 7.96 0 0 0 12 20a7.96 7.96 0 0 0 6.135-3.29l-1.31-1.115A5.921 5.921 0 0 1 12 18z"></path></svg>
            </button>
            {showEmojiPicker && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-5 z-[500] shadow-[0_0_60px_rgba(0,0,0,0.6)] border border-white/10 rounded-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 backdrop-blur-3xl">
                <EmojiPicker onEmojiClick={onEmojiClick} theme="dark" width={320} height={400} />
              </div>
            )}
          </div>

          <button 
            type="button" 
            onClick={() => setShowSchedulePicker(true)}
            className={`p-3 hover:bg-primary/10 rounded-full transition-all hover:scale-110 active:scale-90 ${scheduledDate ? 'text-primary bg-primary/10' : 'text-primary'}`}
            title="Schedule"
          >
             <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M6 3V2h2v1h8V2h2v1h3v19H3V3h3zm14 17V8H4v12h16zM7 10h2v2H7v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm-8 4h2v2H7v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z"></path></svg>
          </button>

          <button 
            type="button" 
            onClick={() => setShowLocationPicker(true)}
            className={`p-3 hover:bg-primary/10 rounded-full transition-all hover:scale-110 active:scale-90 ${location ? 'text-primary bg-primary/10' : 'text-primary'}`}
            title="Location"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 2c-4.268 0-7.75 3.192-7.75 7.125 0 5.493 7.75 12.875 7.75 12.875s7.75-7.382 7.75-12.875C19.75 5.192 16.268 2 12 2zm0 10c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path></svg>
          </button>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading || (!text && files.length === 0 && !gifUrl && !showPoll)}
          className="bg-primary hover:bg-primary/90 text-white font-black px-8 py-2.5 rounded-full transition-all disabled:opacity-30 active:scale-95 shadow-xl shadow-primary/20 tracking-tight uppercase text-sm"
        >
          {loading ? "Dropping..." : "Drop It"}
        </button>
      </div>
    );
  }

  return (
    <div className={`p-6 bg-background/50 backdrop-blur-xl sticky top-0 z-40 ${!isModal ? 'border-b border-white/5 shadow-2xl shadow-black/20' : ''}`}>
      {renderPostContent()}
      <div className="mt-5 pt-5 border-t border-white/5">
        {renderToolbar()}
      </div>
      
      {/* Overlays */}
      {showGifPicker && (
         <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowGifPicker(false)} />
            <div className="relative w-full max-w-[500px] animate-in fade-in slide-in-from-bottom-5 duration-500 overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
               <GifPicker onSelect={(url) => { setGifUrl(url); setShowGifPicker(false); }} onClose={() => setShowGifPicker(false)} />
            </div>
         </div>
      )}
      
      {showSchedulePicker && (
         <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowSchedulePicker(false)} />
            <div className="relative w-full max-w-[400px] animate-in fade-in slide-in-from-bottom-5 duration-500 rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
               <SchedulePicker onConfirm={(date) => { setScheduledDate(date); setShowSchedulePicker(false); }} onClose={() => setShowSchedulePicker(false)} />
            </div>
         </div>
      )}
      
      {showLocationPicker && (
         <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowLocationPicker(false)} />
            <div className="relative w-full max-w-[400px] animate-in fade-in slide-in-from-bottom-5 duration-500 rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
               <LocationPicker onConfirm={(loc) => { setLocation(loc); setShowLocationPicker(false); }} onClose={() => setShowLocationPicker(false)} />
            </div>
         </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-bold animate-in fade-in slide-in-from-top-4 duration-300 flex justify-between items-center backdrop-blur-md">
          <span className="break-words max-w-[85%]">{error}</span>
          <button onClick={() => setError(null)} className="text-red-500/60 hover:text-red-500 text-xl font-black">×</button>
        </div>
      )}
    </div>
  );
}
