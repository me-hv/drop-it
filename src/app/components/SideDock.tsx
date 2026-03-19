"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useUI } from "@/app/context/UIContext";

export default function SideDock() {
  const pathname = usePathname();
  const { openPostModal } = useUI();

  const NAV_ITEMS = [
    { label: "Home", href: "/", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
    { label: "Explore", href: "/explore", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> },
    { label: "Create", href: "#", isAction: true, icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> },
    { label: "Update", href: "/updates", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> },
    { label: "Messages", href: "/messages", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H17c2.5 0 4.5 2 4.5 4.5V17z"/><path d="m22 9-10 7L2 9"/></svg> },
    { label: "Profile", href: "/profile/me", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
    { label: "Settings", href: "/settings", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
  ];

  const mainItems = NAV_ITEMS.filter(item => item.label !== "Settings");
  const settingsItem = NAV_ITEMS.find(item => item.label === "Settings");

  return (
    <div className="flex h-full flex-col justify-between items-center w-full">
      <nav className="flex flex-col gap-4 w-full items-center">
        {/* Logo */}
        <div className="mb-4">
          <div className="h-12 w-12 flex items-center justify-center text-primary font-black text-xl italic tracking-tighter">
             TXT
          </div>
        </div>

        {mainItems.map((item, i) => {
          const isActive = pathname === item.href;
          
          if (item.isAction) {
            return (
              <button 
                key={i}
                onClick={openPostModal}
                className="group relative flex h-12 w-12 items-center justify-center rounded-xl transition-all text-gray-400 hover:bg-white/5 hover:text-white hover:scale-110 active:scale-95"
              >
                <div className="transition-transform duration-200 group-hover:scale-110">
                  {item.icon}
                </div>
              </button>
            );
          }

          return (
            <Link 
              key={i} 
              href={item.href}
              className={`group relative flex h-12 w-12 items-center justify-center rounded-xl transition-all ${isActive ? 'bg-white/10 text-primary' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              {isActive && <div className="absolute -left-2 h-1.5 w-1.5 rounded-full bg-white" />}
              <div className={`transition-transform duration-200 group-hover:scale-110 ${isActive ? 'scale-110' : ''}`}>
                {item.icon}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Settings at the end */}
      {settingsItem && (
        <div className="mb-4">
           <Link 
              href={settingsItem.href}
              className={`group relative flex h-12 w-12 items-center justify-center rounded-xl transition-all ${pathname === settingsItem.href ? 'bg-white/10 text-primary' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <div className={`transition-transform duration-200 group-hover:scale-110`}>
                {settingsItem.icon}
              </div>
            </Link>
        </div>
      )}
    </div>
  );
}
