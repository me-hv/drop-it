import "./globals.css";
import type { Metadata } from "next";

import SideDock from "@/app/components/SideDock";

export const metadata: Metadata = {
  title: "DROP IT",
  description: "Drop anything. Anytime.",
};

import { UIProvider } from "@/app/context/UIContext";
import PostModal from "@/app/components/PostModal";
import MockLoginOverlay from "@/app/components/MockLoginOverlay";
import ClientLayout from "@/app/components/ClientLayout";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground antialiased min-h-screen">
        <UIProvider>
          <MockLoginOverlay />
          <ClientLayout>
            {children}
          </ClientLayout>
          <PostModal />
        </UIProvider>
      </body>
    </html>
  );
}
