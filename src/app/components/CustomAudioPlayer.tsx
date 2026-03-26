"use client";

import * as React from "react";

interface CustomAudioPlayerProps {
  src?: string;
  text?: string;
}

export default function CustomAudioPlayer({ src, text }: CustomAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = React.useState(0);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p);
    }
  };

  if (!src) return null;

  return (
    <div className="w-full bg-[#15202b] rounded-xl border border-white/10 p-4 mt-2 group/audio relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover/audio:opacity-100 transition-opacity" />
      
      <div className="flex items-center gap-4 relative z-10">
        <button 
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
        >
          {isPlaying ? (
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          ) : (
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" className="ml-1"><path d="M8 5v14l11-7z"/></svg>
          )}
        </button>
        
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-black text-white/40 uppercase tracking-widest">{isPlaying ? "Streaming Frequency..." : "Static Signal"}</span>
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{text?.slice(0, 15)}...</span>
          </div>
          
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-100" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </div>
      </div>
      
      <audio 
        ref={audioRef} 
        src={src} 
        onTimeUpdate={onTimeUpdate} 
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />
    </div>
  );
}
