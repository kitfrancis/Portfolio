"use client";

import { useState } from "react";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, User, Mail, Icon } from "lucide-react";

export default function navbar(){
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    
    useEffect(() => {
  setIsMenuOpen(false);
}, [pathname]);

     const links = [
    { name: "About me", href: "/", icon: User },
    { name: "Projects", href: "/projects",icon: FileText },
    { name: "Contact", href: "/contact", icon: Mail },
  ];


    return(
        <>
             <nav className="fixed top-0 left-0 h-full w-64 bg-gray-100 dark:bg-background shadow-md z-50 hidden lg:block"> 
          <div className="flex flex-col items-center justify-center w-full py-6">
            <h1 className="text-2xl text-gray-500  font-bold mb-8">Kit Francis Besa</h1>
            <img className="rounded-full items-center justify-center max-w-36" src="/images/nopp.png" alt="Profile-Pic" />
            <div>
              <p className="text-center px-3 text-foreground  pt-2">
                Hello world, I'm Kit Francis Sabrine Besa
                Student at the University of Antique.
              </p>
            </div>
            <div className="flex gap-4 pt-3">
              <img className="h-10 w-10 rounded-full hover:scale-125 transition duration-200 ease-in-out" src="/images/Ua.png" alt="University of Antique Logo" />
              <img className="h-10 w-10 rounded-full hover:scale-125 transition duration-200 ease-in-out" src="/images/CCS.png" alt="CCS Logo" />
            </div>
            <hr className="w-full border-solid border-gray-300   mt-4" />
            <div className="flex flex-col justify-start w-full space-y-4 pt-5 px-5">
                 {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-2 w-full text-left rounded-md px-4 py-2 text-lg font-bold transition duration-200
                    ${isActive ? "bg-gray-700 text-white" : "text-gray-400  hover:bg-gray-700  hover:text-white"}`}
                >
                  <Icon className="w-5 h-5" />
                  {link.name}
                </Link>
              );
            })}
            </div>
          </div>
        </nav>
            
        <nav className="w-full bg-white dark:bg-black/10 shadow-md lg:hidden">
          <div className="flex items-center justify-between px-4 py-4">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 dark:text-white hover:text-gray-900 dark:hover:text-gray-300 focus:outline-none">
              {!isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>

            <div className="flex items-center space-x-4 pr-8">
              <h1 className="mr-5 text-2xl text-gray-700 dark:text-gray-100 font-bold">Portfolio</h1>
              <div className="flex gap-2">
                <img className="h-8 w-8 rounded-full hover:scale-125 transition duration-200 ease-in-out" src="/images/Ua.png" alt="University of Antique Logo" />
                <img className="h-8 w-8 rounded-full hover:scale-125 transition duration-200 ease-in-out" src="/images/CCS.png" alt="CCS Logo" />
              </div>
            </div>
          </div>

      <div
  className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out
    ${isMenuOpen ? "max-h-auto opacity-100" : "max-h-0 opacity-0"}
  `}
>
     <div className="flex flex-col bg-white dark:bg-black px-4 pb-4 space-y-4">
            <h1 className="text-2xl text-black dark:text-white font-bold pt-5 flex justify-center">Kit Francis Besa</h1>
            <div className="flex justify-center items-center w-full">
            <img src="/images/nopp.png" alt="Profile" className="rounded-full max-w-32 " />
            </div>
            <p className="text-center px-3 text-black dark:text-white pt-2">
              Hello world, I'm Kit Francis Sabrine Besa
              Student at the University of Antique.
            </p>
            <div className="flex justify-center gap-5">
              <img className="h-10 w-10 rounded-full hover:scale-125 transition duration-200 ease-in-out" src="/images/Ua.png" alt="University of Antique Logo" />
              <img className="h-10 w-10 rounded-full hover:scale-125 transition duration-200 ease-in-out" src="/images/CCS.png" alt="CCS Logo" />
            </div>
            <hr className="w-full border-solid border-gray-300 mt-10" />

            {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-2 w-full text-left rounded-md px-4 py-2 text-lg font-medium transition duration-200
                  ${isActive ? "bg-gray-700 text-white" : "text-gray-600 hover:bg-blue-700 hover:text-white"}`}
              >
                <Icon className="w-5 h-5" />
                {link.name}
              </Link>
            );
          })}
            </div>
          </div>
        </nav>
        </>
    );
}