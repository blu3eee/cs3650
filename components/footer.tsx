import * as React from "react";

import type { JSX } from "react"; // Changed to import type
import { cn } from "@/lib/utils";
import type { AdditionalProps } from ".";
import { ModeToggle } from "./mode-toggle";
import { Icons } from "./icons";
import { poppinsFont, rubikFont } from "@/styles/fonts";
import { siteConfig } from "@/config/site";
import Link from "next/link";

/**
 * Renders the footer section of the application
 * @param {AdditionalProps} props - The props object for the Footer component.
 * @param {string} props.className - Optional CSS class to apply to the footer element for custom styling.
 * @returns {JSX.Element} The Footer component with subscription form and social media links.
 */
export function Footer({ className }: AdditionalProps): JSX.Element {
  return (
    <footer className={cn(className)}>
      <div className="flex w-full items-center justify-between bg-secondary px-2 py-8 md:px-4 lg:px-6 ">
        <div className="container flex flex-col items-start text-center">
          <a className="text-md flex items-center gap-4 text-info" href="/">
            <Icons.logo height={40} width={40} />
            <span
              className={cn(
                rubikFont.className,
                "text-xl font-bold uppercase ",
              )}
            >
              {siteConfig.name}
            </span>
          </a>
          <span className="mt-2 text-sm text-muted-foreground">
            {siteConfig.description}
          </span>
          {siteConfig.footerNav && (
            <div className="mt-2 flex flex-wrap gap-2">
              {siteConfig.footerNav.map((navItem, index) => (
                <Link
                  key={index}
                  href={navItem.href}
                  className={cn(
                    "text-xs font-medium capitalize text-secondary-foreground/50 underline",
                    poppinsFont.className,
                  )}
                >
                  {navItem.title}
                </Link>
              ))}
            </div>
          )}
        </div>
        <ModeToggle />
      </div>
    </footer>
  );
}
