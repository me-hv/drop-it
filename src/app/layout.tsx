import "./globals.css";
import type { Metadata } from "next";

import Navbar from "@/app/components/Navbar";

export const metadata: Metadata = {
  title: "TXT",
  description: "A premium social media experience",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground antialiased selection:bg-primary/30 min-h-screen">
        <div className="mx-auto flex max-w-7xl">
          {/* Left Sidebar */}
          <header className="sticky top-0 h-screen w-20 flex-col items-end xl:w-64">
            <Navbar />
          </header>

          {/* Main Feed */}
          <main className="min-h-screen flex-1 border-x border-border max-w-[600px]">
            {children}
          </main>

          {/* Right Panel (Widgets) */}
          <aside className="hidden lg:block w-[350px] ml-8">
            <div className="sticky top-0 py-3 space-y-4">
               <div className="bg-[#16181c] rounded-2xl p-4">
                  <h3 className="text-xl font-black mb-4">What's happening</h3>
                  <div className="space-y-4">
                     <div className="flex justify-between">
                        <div>
                           <p className="text-xs text-muted-foreground">Trending in Technology</p>
                           <p className="font-bold">#Antigravity</p>
                           <p className="text-xs text-muted-foreground">1.2M Posts</p>
                        </div>
                        <span className="text-muted-foreground">...</span>
                     </div>
                  </div>
               </div>
            </div>
          </aside>
        </div>
      </body>
    </html>
  );
}
