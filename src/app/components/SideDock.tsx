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
      label: "FEED", 
      href: "/", 
      icon: <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> 
    },
    { 
      label: "EXPLORE", 
      href: "/explore", 
      icon: <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> 
    },
    { 
      label: "POST", 
      href: "#", 
      isAction: true, 
      icon: <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 8v8"/><path d="M8 12h8"/></svg> 
    },
    { 
      label: "UPDATE", 
      href: "/updates", 
      icon: <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg> 
    },
    { 
      label: "MESSAGES", 
      href: "/messages", 
      icon: <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg> 
    },
    { 
      label: "PROFILE", 
      href: "/profile/me", 
      icon: <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> 
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
    <div className="flex h-full flex-col justify-between w-full overflow-hidden">
      <div className="flex flex-col w-full">
        {/* Hamburger / Brand Section */}
        <div className="px-3 h-20 flex items-center mb-2">
            <button 
              onClick={toggleSidebar}
              className="w-12 h-12 rounded-2xl text-white/50 hover:bg-white/10 hover:text-white flex items-center justify-center transition-all bg-white/5 shadow-inner group flex-shrink-0"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={STROKE} className="group-hover:rotate-90 transition-transform duration-500">
                <line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/>
              </svg>
            </button>
            <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] flex items-center ${isSidebarCollapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-[160px] opacity-100 ml-4'}`}>
              <span className="font-black text-xl italic tracking-tighter whitespace-nowrap">
                DROP IT
              </span>
            </div>
        </div>

        {/* Navigation */}
        <nav className="px-3 flex flex-col gap-2 lowercase">
          {mainItems.map((item, i) => {
            const isActive = pathname === item.href;
            
            if (item.isAction) {
              return (
                <button 
                  key={i}
                  onClick={openPostModal}
                  className={`group flex h-14 w-full items-center px-3 rounded-2xl transition-all duration-500 text-white/40 hover:bg-primary/20 hover:text-primary active:scale-95`}
                >
                  <div className="w-6 h-6 flex items-center justify-center transition-transform duration-500 group-hover:rotate-12 flex-shrink-0">
                    {item.icon}
                  </div>
                  <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] flex items-center ${isSidebarCollapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-[160px] opacity-100 ml-4'}`}>
                    <span className="font-black text-sm uppercase tracking-widest whitespace-nowrap">
                      {item.label}
                    </span>
                  </div>
                </button>
              );
            }

            return (
              <Link 
                key={i} 
                href={item.href}
                className={`group flex h-14 w-full items-center px-3 rounded-2xl transition-all duration-500 ${
                  isActive 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-white/40 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className={`w-6 h-6 flex items-center justify-center transition-all duration-500 flex-shrink-0 group-hover:scale-110 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : ''}`}>
                  {item.icon}
                </div>
                <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] flex items-center ${isSidebarCollapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-[160px] opacity-100 ml-4'}`}>
                  <span className={`font-black text-sm uppercase tracking-widest whitespace-nowrap ${isActive ? 'opacity-100' : 'opacity-80'}`}>
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Actions */}
      <div className="px-3 pb-6 flex flex-col gap-2">
        {settingsItem && (
           <Link 
              href={settingsItem.href}
              className={`group flex h-14 w-full items-center px-3 rounded-2xl transition-all duration-500 ${
                pathname === settingsItem.href 
                ? 'bg-white/10 text-primary' 
                : 'text-white/40 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="w-6 h-6 flex items-center justify-center transition-transform duration-500 group-hover:rotate-12 flex-shrink-0">
                {settingsItem.icon}
              </div>
              <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] flex items-center ${isSidebarCollapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-[160px] opacity-100 ml-4'}`}>
                <span className="font-black text-sm uppercase tracking-widest whitespace-nowrap">
                  {settingsItem.label}
                </span>
              </div>
            </Link>
        )}
        
        <button 
          onClick={handleSignOut}
          className={`group flex h-14 w-full items-center px-3 rounded-2xl transition-all duration-500 text-white/40 hover:bg-red-500/10 hover:text-red-500`}
        >
          <div className="w-6 h-6 flex items-center justify-center transition-transform duration-500 group-hover:-translate-x-1 flex-shrink-0">
            <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </div>
          <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] flex items-center ${isSidebarCollapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-[160px] opacity-100 ml-4'}`}>
            <span className="font-black text-sm uppercase tracking-widest whitespace-nowrap">
              SIGN OUT
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
