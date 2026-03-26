"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = React.useState<any>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);

  React.useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/users/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (e) {
        console.error("Navbar: Failed to load user", e);
      }
    }
    loadUser();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      localStorage.removeItem("drops_handle");
      localStorage.removeItem("userHandle");
      window.location.reload();
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  const NAV_ITEMS = [
    { label: "Home", href: "/", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
    { label: "Explore", href: "/explore", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> },
    { label: "Notifications", href: "/notifications", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> },
    { label: "Messages", href: "/messages", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H17c2.5 0 4.5 2 4.5 4.5V17z"/><path d="m22 9-10 7L2 9"/></svg> },
    { label: "Lists", href: "/lists", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg> },
    { label: "Profile", href: "/profile/me", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/></svg> },
    { label: "More", href: "#", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg> },
  ];

  return (
    <div className="flex h-full flex-col justify-between p-4 xl:w-64 relative">
      <div className="flex flex-col gap-2">
        <Link href="/" className="mb-2 flex h-12 w-12 items-center justify-center rounded-full hover:bg-white/10 transition-colors">
          <svg viewBox="0 0 24 24" className="h-8 w-8 text-white fill-white" aria-hidden="true"><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g></svg>
        </Link>

        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.label}
              href={item.href}
              className={`flex items-center gap-4 rounded-full p-3 transition-colors hover:bg-white/10 w-fit xl:w-full ${isActive ? 'font-bold' : ''}`}
            >
              <div className={isActive ? 'text-white' : 'text-foreground'}>
                {item.icon}
              </div>
              <span className="hidden text-xl xl:block">{item.label}</span>
            </Link>
          );
        })}

        <button className="mt-4 flex h-[52px] w-12 items-center justify-center rounded-full bg-primary font-bold text-white transition-all hover:bg-primary/90 xl:w-full xl:text-[17px]">
          <span className="hidden xl:block">Post</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 xl:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
        </button>
      </div>

      <div className="relative">
        {showLogoutConfirm && (
          <div className="absolute bottom-full left-0 mb-2 w-full bg-[#121214] border border-white/10 rounded-xl py-2 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
             <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-[12px] font-black text-white hover:bg-white/5 uppercase tracking-widest transition-colors">
               Log out @{user?.handle || 'unknown'}
             </button>
          </div>
        )}
        <div 
          onClick={() => setShowLogoutConfirm(!showLogoutConfirm)}
          className="flex items-center gap-3 rounded-full border border-transparent p-3 hover:bg-white/10 transition-colors cursor-pointer xl:w-full"
        >
           <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-purple-400 flex items-center justify-center text-xs font-black text-white overflow-hidden shrink-0">
             {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : (user?.name?.[0] || 'U')}
           </div>
           <div className="hidden flex-col xl:flex min-w-0">
              <span className="font-bold text-[15px] truncate text-white">{user?.name || 'Syncing...'}</span>
              <span className="text-white/40 text-[14px] truncate">@{user?.handle || '...'}</span>
           </div>
           <span className="hidden ml-auto text-white/20 xl:block font-black tracking-tighter">...</span>
        </div>
      </div>
    </div>
  );
}
