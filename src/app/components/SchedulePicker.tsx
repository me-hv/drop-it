"use client";
import React, { useState } from "react";

export default function SchedulePicker({ onClose, onConfirm }: { onClose: () => void, onConfirm: (date: Date) => void }) {
  const [month, setMonth] = useState("March");
  const [day, setDay] = useState("26");
  const [year, setYear] = useState("2026");
  const [hour, setHour] = useState("3");
  const [minute, setMinute] = useState("07");
  const [ampm, setAmPm] = useState("PM");

  const handleConfirm = () => {
    // In a real app we parse this into a Date object
    const selectedDate = new Date(`${month} ${day} ${year} ${hour}:${minute} ${ampm}`);
    onConfirm(selectedDate);
  };

  const getFormattedDate = () => {
    try {
       const d = new Date(`${month} ${day} ${year} ${hour}:${minute} ${ampm}`);
       if (isNaN(d.getTime())) return "Invalid Date";
       
       const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
       const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
       
       const dayName = days[d.getDay()];
       const monthName = months[d.getMonth()];
       const dateNum = d.getDate();
       const yearNum = d.getFullYear();
       
       let h = d.getHours();
       const m = d.getMinutes().toString().padStart(2, '0');
       const p = h >= 12 ? 'PM' : 'AM';
       h = h % 12;
       if (h === 0) h = 12;
       
       return `Will send on ${dayName}, ${monthName} ${dateNum}, ${yearNum} at ${h}:${m} ${p}`;
    } catch {
       return "Will send on selected date";
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex justify-center items-center bg-white/10 backdrop-blur-sm p-4">
       <div className="bg-black w-full max-w-[600px] rounded-2xl flex flex-col shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden border border-white/20">
          
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3">
             <div className="flex items-center gap-6">
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                   <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
                <h2 className="text-[20px] font-bold text-white">Schedule</h2>
             </div>
             <button onClick={handleConfirm} className="bg-white hover:bg-gray-200 text-black px-4 py-1.5 rounded-full font-bold text-[14px] transition-colors">
                Confirm
             </button>
          </div>

          <div className="flex flex-col px-4 pt-2">
             {/* Subtitle */}
             <div className="flex items-center gap-2 text-white/50 text-[14px] mb-6 px-1">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                <span>{getFormattedDate()}</span>
             </div>

             {/* Date Section */}
             <div className="flex flex-col gap-1 mb-5">
                <span className="text-white/50 text-[14px] px-1">Date</span>
                <div className="flex items-center gap-3">
                   {/* Month */}
                   <div className="relative flex-[2] border border-white/20 rounded-md focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-colors">
                      <label className="absolute top-1.5 left-3 text-[12px] text-white/50 pointer-events-none">Month</label>
                      <select value={month} onChange={e => setMonth(e.target.value)} className="w-full bg-transparent text-white pt-6 pb-2 px-3 appearance-none outline-none cursor-pointer text-[15px]">
                         {["January","February","March","April","May","June","July","August","September","October","November","December"].map(m => <option key={m} value={m} className="bg-black">{m}</option>)}
                      </select>
                      <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none"><path d="M6 9l6 6 6-6"/></svg>
                   </div>
                   {/* Day */}
                   <div className="relative flex-1 border border-white/20 rounded-md focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-colors">
                      <label className="absolute top-1.5 left-3 text-[12px] text-white/50 pointer-events-none">Day</label>
                      <select value={day} onChange={e => setDay(e.target.value)} className="w-full bg-transparent text-white pt-6 pb-2 px-3 appearance-none outline-none cursor-pointer text-[15px]">
                         {Array.from({length:31}, (_, i)=>String(i+1)).map(d => <option key={d} value={d} className="bg-black">{d}</option>)}
                      </select>
                      <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none"><path d="M6 9l6 6 6-6"/></svg>
                   </div>
                   {/* Year */}
                   <div className="relative flex-1 border border-white/20 rounded-md focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-colors">
                      <label className="absolute top-1.5 left-3 text-[12px] text-white/50 pointer-events-none">Year</label>
                      <select value={year} onChange={e => setYear(e.target.value)} className="w-full bg-transparent text-white pt-6 pb-2 px-3 appearance-none outline-none cursor-pointer text-[15px]">
                         {["2024","2025","2026","2027"].map(y => <option key={y} value={y} className="bg-black">{y}</option>)}
                      </select>
                      <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none"><path d="M6 9l6 6 6-6"/></svg>
                   </div>
                   {/* Calendar Icon Button */}
                   <button className="p-2 ml-1 hover:bg-white/10 rounded-full transition-colors text-white">
                      <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                   </button>
                </div>
             </div>

             {/* Time Section */}
             <div className="flex flex-col gap-1 mb-6">
                <span className="text-white/50 text-[14px] px-1">Time</span>
                <div className="flex items-center gap-3 pr-12">
                   {/* Hour */}
                   <div className="relative flex-1 border border-white/20 rounded-md focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-colors">
                      <label className="absolute top-1.5 left-3 text-[12px] text-white/50 pointer-events-none">Hour</label>
                      <select value={hour} onChange={e => setHour(e.target.value)} className="w-full bg-transparent text-white pt-6 pb-2 px-3 appearance-none outline-none cursor-pointer text-[15px]">
                         {Array.from({length:12}, (_, i)=>String(i+1)).map(h => <option key={h} value={h} className="bg-black">{h}</option>)}
                      </select>
                      <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none"><path d="M6 9l6 6 6-6"/></svg>
                   </div>
                   {/* Minute */}
                   <div className="relative flex-1 border border-white/20 rounded-md focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-colors">
                      <label className="absolute top-1.5 left-3 text-[12px] text-white/50 pointer-events-none">Minute</label>
                      <select value={minute} onChange={e => setMinute(e.target.value)} className="w-full bg-transparent text-white pt-6 pb-2 px-3 appearance-none outline-none cursor-pointer text-[15px]">
                         {Array.from({length:60}, (_, i)=>String(i).padStart(2,'0')).map(m => <option key={m} value={m} className="bg-black">{m}</option>)}
                      </select>
                      <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none"><path d="M6 9l6 6 6-6"/></svg>
                   </div>
                   {/* AM/PM */}
                   <div className="relative flex-1 border border-white/20 rounded-md focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-colors">
                      <label className="absolute top-1.5 left-3 text-[12px] text-white/50 pointer-events-none">AM/PM</label>
                      <select value={ampm} onChange={e => setAmPm(e.target.value)} className="w-full bg-transparent text-white pt-6 pb-2 px-3 appearance-none outline-none cursor-pointer text-[15px]">
                         {["AM","PM"].map(a => <option key={a} value={a} className="bg-black">{a}</option>)}
                      </select>
                      <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none"><path d="M6 9l6 6 6-6"/></svg>
                   </div>
                </div>
             </div>

             {/* Timezone */}
             <div className="flex flex-col gap-0.5 mb-6 px-1">
                <span className="text-white/50 text-[14px]">Time zone</span>
                <span className="text-white text-[16px]">India Standard Time</span>
             </div>
          </div>

          {/* Footer */}
          <div className="border-t border-white/20 px-4 py-4 mt-auto">
             <button className="text-primary font-bold hover:underline text-[15px]">Scheduled posts</button>
          </div>

       </div>
    </div>
  );
}
