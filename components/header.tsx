

"use client";

import { UserButton, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { HeaderLogo } from "./header-logo";
import { Navigation } from "./navigation";
import { Loader2 } from "lucide-react";
import { useMedia } from "react-use";
import { WelcomeMsg } from "./welcome-msg";

export const Header = () => {
  const isMobile = useMedia("(max-width: 1024px)", false);

  return (
    <header className="bg-gradient-to-b from-blue-700 to-blue-500 px-4 py-8 lg:px-14 pb-36">
      <div className="max-w-screen-2xl mx-auto">
        <div className="w-full items-center justify-between mb-14">
          <div className="flex items-center justify-between lg:gap-x-16">
            {!isMobile && <HeaderLogo />} 
            <Navigation />
            <ClerkLoaded>
              <UserButton afterSignOutUrl="/" />
            </ClerkLoaded>
            <ClerkLoading>
              <Loader2 className="size-8 animate-spin text-slate-400" />
            </ClerkLoading>
          </div>
        </div>
        <WelcomeMsg />
      </div>
    </header>
  );
};
