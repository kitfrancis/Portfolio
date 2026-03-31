import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";
import { ThemeProvider, ThemeToggle } from "@/components/ui/theme-provider";
import ThemeProviderWrapper from "@/components/ui/ThemeProviderWrapper";
import { Toaster } from "@/components/ui/sonner";


export const metadata: Metadata = {
  title: "Kit-Francis-Besa-Portfolio",
  description: "Personal portfolio website showcasing projects and skills.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProviderWrapper
          
        >
          <div className="fixed top-4 right-4 z-50">
            <ThemeToggle />
          </div>
          <Navbar />
          <main>{children}
          </main>
             <Toaster />
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
