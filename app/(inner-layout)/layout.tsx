import { Footer } from "@/components/footer";
import { MainNav } from "@/components/nav/main";
import { siteConfig } from "@/config/site";
import React from "react";

/**
 * Layout component that wraps the entire application.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The content to be rendered within the layout.
 * @returns {JSX.Element} The Layout component.
 */
export default function Layout1({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center justify-between gap-6 sm:space-x-0">
          <MainNav items={siteConfig.mainNav} />
        </div>
      </header>

      <main className="flex grow flex-col ">{children}</main>
      <Footer className="flex-none" />
    </div>
  );
}
