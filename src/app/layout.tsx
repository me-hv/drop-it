import "./globals.css";
import type { Metadata } from "next";

import SideDock from "@/app/components/SideDock";

export const metadata: Metadata = {
  title: "Social",
  description: "A minimal, artistic social experience",
};

import { UIProvider } from "@/app/context/UIContext";
import PostModal from "@/app/components/PostModal";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground antialiased min-h-screen">
        <UIProvider>
          {/* Ubuntu-style Left Dock */}
          <aside className="fixed left-0 top-0 h-full w-[72px] bg-black/80 backdrop-blur-md z-50 flex flex-col items-center py-4 border-r border-white/5">
               <SideDock />
          </aside>

          {/* Perfectly Centered Main Feed */}
          <div className="flex justify-center min-h-screen w-full">
            <main className="w-full max-w-[600px] min-h-screen bg-background">
              {children}
            </main>
          </div>

          <PostModal />
        </UIProvider>
      </body>
    </html>
  );
}
