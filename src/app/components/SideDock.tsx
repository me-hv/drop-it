"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUI } from "@/app/context/UIContext";

export default function SideDock() {
  const pathname = usePathname();
  const { openPostModal, isSidebarCollapsed, toggleSidebar } = useUI();

  // Premium Icons (Thin, 1.5 stroke-width)
  const ICON_SIZE = 24;
  const STROKE = 1.6;

  const NAV_ITEMS = [
    { 
      label: "RELEASES", 
      href: "/", 
      icon: <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> 
    },
    { 
      label: "CHARTS", 
      href: "/explore", 
      icon: <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> 
    },
    { 
      label: "NOTIFS", 
      href: "/updates", 
      icon: <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg> 
    },
    { 
      label: "DM", 
      href: "/messages", 
      icon: <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg> 
    },
    { 
      label: "PROFILE", 
      href: "/profile/me", 
      icon: <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> 
    },
    { 
      label: "SAVED", 
      href: "/saved", 
      icon: <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg> 
    },
    { 
      label: "SETTINGS", 
      href: "/settings", 
      icon: <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg> 
    },
  ];

  const mainItems = NAV_ITEMS.filter(item => item.label !== "SETTINGS");
  const settingsItem = NAV_ITEMS.find(item => item.label === "SETTINGS");

  const handleSignOut = () => {
    localStorage.removeItem("drops_handle");
    document.cookie = "mocked_handle=; Max-Age=0; path=/;";
    window.location.href = "/";
  };

  return (
    <div className="flex h-full flex-col justify-between w-full overflow-hidden bg-transparent border-r border-white/5">
      <div className="flex flex-col w-full">
        {/* Brand Section */}
        <div className="px-6 h-24 flex items-center mb-10 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-none bg-primary flex items-center justify-center border border-white/10 shadow-lg shadow-primary/20">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5">
                  <path d="M12 2v20m-5-5h10l-5-10m0 0v10"/>
                </svg>
              </div>
              <span className="font-bold text-xl tracking-[0.2em] text-white uppercase">
                DROP IT
              </span>
            </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col">
          {mainItems.map((item, i) => {
            const isActive = pathname === item.href;
            
            return (
              <Link 
                key={i} 
                href={item.href}
                className={`group flex h-14 w-full items-center px-8 transition-all duration-200 border-l-2 ${
                  isActive 
                  ? 'bg-white/[0.03] text-white border-primary' 
                  : 'text-white/30 border-transparent hover:text-white/60 hover:bg-white/[0.01]'
                }`}
              >
                <div className={`w-5 h-5 flex items-center justify-center flex-shrink-0 ${isActive ? 'text-primary' : ''}`}>
                  {item.icon}
                </div>
                <span className={`ml-6 font-bold text-[11px] uppercase tracking-[0.3em] whitespace-nowrap ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Actions */}
      <div className="pb-8 flex flex-col">
        {settingsItem && (
           <Link 
              href={settingsItem.href}
              className={`group flex h-14 w-full items-center px-8 transition-all duration-200 border-l-2 ${
                pathname === settingsItem.href 
                ? 'bg-white/[0.03] text-white border-primary' 
                : 'text-white/20 border-transparent hover:text-white'
              }`}
            >
              <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                {settingsItem.icon}
              </div>
              <span className="ml-6 font-bold text-[11px] uppercase tracking-[0.3em] whitespace-nowrap opacity-40 group-hover:opacity-100">
                {settingsItem.label}
              </span>
            </Link>
        )}
        
        <button 
          onClick={handleSignOut}
          className="group flex h-14 w-full items-center px-8 transition-all duration-200 text-white/10 hover:bg-red-950/20 hover:text-red-500 border-l-2 border-transparent"
        >
          <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
            <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </div>
          <span className="ml-6 font-bold text-[11px] uppercase tracking-[0.3em] whitespace-nowrap opacity-40 group-hover:opacity-100">
            LOGOUT
          </span>
        </button>
      </div>
    </div>
  );
}
