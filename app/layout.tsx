import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";
import { ThemeToggle } from "@/components/ui/theme-provider";
import ThemeProviderWrapper from "@/components/ui/ThemeProviderWrapper";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.kitfrancisbesa.me"),
  title: "Kit Francis Besa | Software Engineering Student",
  description:
    "Kit Francis Besa is a software engineering student at the University of Antique. See his projects, tech stack and contact details.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Kit Francis Besa | Software Engineering Student",
    description: "Portfolio of Kit Francis Besa, University of Antique.",
    url: "/",
    type: "profile",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col font-sans antialiased">
        <ThemeProviderWrapper>
          <div className="fixed top-4 right-4 z-50">
            <ThemeToggle />
          </div>
          <Navbar />
          <div>{children}</div>
          <Toaster />
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}