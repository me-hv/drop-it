"use client";

import React, { useState } from "react";

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
  _count?: {
    followers: number;
    following: number;
  };
};

export default function ProfileHeader({ initialUser }: { initialUser: User }) {
  const [user, setUser] = useState<User>(initialUser);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<User>(initialUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bannerInputRef = React.useRef<HTMLInputElement>(null);
  const avatarInputRef = React.useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: "image" | "coverImage") => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit for Base64 in DB
        setError("Image size too large. Please use an image under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, [field]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const updated = await res.json();
        setUser(updated);
        setIsEditing(false);
      } else {
        const err = await res.json();
        setError(err.error || "Failed to update profile");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const joinedDate = new Date(user.createdAt).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="relative border-x border-white/5 mx-auto max-w-2xl bg-background">
      {/* Banner */}
      <div 
        className={`relative h-48 w-full bg-white/5 border-b border-white/5 overflow-hidden group ${isEditing ? 'cursor-pointer' : ''}`}
        onClick={() => isEditing && bannerInputRef.current?.click()}
      >
         <input 
           type="file" 
           ref={bannerInputRef}
           onChange={(e) => handleFileChange(e, "coverImage")}
           className="hidden" 
           accept="image/*"
         />
         {isEditing ? (
           <div className="absolute inset-0 z-10 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
             <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
             <span className="text-white text-xs font-bold mt-2">Click to upload banner</span>
           </div>
         ) : null}
         {(isEditing ? formData.coverImage : user.coverImage) ? (
           <img src={(isEditing ? formData.coverImage : user.coverImage) || ""} alt="cover" className="w-full h-full object-cover" />
         ) : (
           <div className="w-full h-full bg-gradient-to-tr from-[#1a2b3c] to-[#0a1219]" />
         )}
      </div>
      
      {/* Profile Info Section */}
      <div className="px-6 -mt-16 pb-6 relative z-20">
        <div className="flex justify-between items-end mb-6">
          <div 
            className={`relative h-32 w-32 rounded-full bg-gray-300 border-4 border-background overflow-hidden shadow-xl ring-1 ring-white/10 group ${isEditing ? 'cursor-pointer' : ''}`}
            onClick={() => isEditing && avatarInputRef.current?.click()}
          >
             <input 
               type="file" 
               ref={avatarInputRef}
               onChange={(e) => handleFileChange(e, "image")}
               className="hidden" 
               accept="image/*"
             />
             {isEditing ? (
               <div className="absolute inset-0 z-10 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
               </div>
             ) : null}
             {(isEditing ? formData.image : user.image) ? (
               <img src={(isEditing ? formData.image : user.image) || ""} alt={user.name} className="w-full h-full object-cover" />
             ) : (
               <div className="w-full h-full bg-primary/20 flex items-center justify-center text-3xl font-bold text-primary">
                  {(formData.name || user.name)[0]}
               </div>
             )}
          </div>
          <div className="flex gap-2 mb-2">
            {isEditing ? (
              <>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 rounded-full border border-white/20 font-bold hover:bg-white/5 transition-all text-[15px]"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  disabled={loading}
                  className="px-6 py-2 rounded-full bg-primary text-white font-bold hover:bg-primary/90 transition-all text-[15px] shadow-lg disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </>
            ) : (
              <button 
                onClick={() => { setFormData(user); setIsEditing(true); }}
                className="px-6 py-2 rounded-full border border-white/20 font-bold hover:bg-white/5 transition-all text-[15px]"
              >
                Edit profile
              </button>
            )}
          </div>
        </div>
        
        {error && <div className="mb-4 p-3 bg-red-500/10 text-red-500 text-sm rounded-xl border border-red-500/20">{error}</div>}

        <div className="space-y-4">
          {isEditing ? (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground ml-1">Name</label>
                <input 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-primary transition-all text-lg font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground ml-1">Handle</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-[15px]">@</span>
                  <input 
                    name="handle"
                    value={formData.handle || ""}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-2.5 outline-none focus:border-primary transition-all text-[15px] text-muted-foreground"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground ml-1">Bio</label>
                <textarea 
                  name="bio"
                  value={formData.bio || ""}
                  onChange={handleChange}
                  placeholder="Your bio"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-all min-h-[80px] text-[15px] leading-relaxed resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground ml-1">Location</label>
                  <input 
                    name="location"
                    value={formData.location || ""}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-primary transition-all text-[14px]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground ml-1">Website</label>
                  <input 
                    name="website"
                    value={formData.website || ""}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-primary transition-all text-[14px] text-primary"
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-1">
                <h1 className="text-3xl font-black tracking-tight">{user.name}</h1>
                <p className="text-muted-foreground text-lg">
                  @{user.handle || user.email.split('@')[0]}
                </p>
              </div>
              
              <p className="text-[17px] leading-relaxed max-w-lg text-white/90">
                {user.bio || <span className="italic text-muted-foreground/40">No bio added yet.</span>}
              </p>
              
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-[15px] text-muted-foreground/60">
                {user.location && (
                  <div className="flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {user.location}
                  </div>
                )}
                {user.website && (
                  <div className="flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                    <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {user.website.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                   Joined {joinedDate}
                </div>
              </div>
            </>
          )}
          
          <div className="flex gap-4 pt-2 border-t border-white/5 mt-4">
             <div className="flex gap-1.5">
               <span className="font-bold text-foreground">{user._count?.following || 0}</span>
               <span className="text-muted-foreground/60 font-medium">Following</span>
             </div>
             <div className="flex gap-1.5">
               <span className="font-bold text-foreground">{user._count?.followers || 0}</span>
               <span className="text-muted-foreground/60 font-medium">Followers</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
