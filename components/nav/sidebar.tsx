"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { rubikFont } from "@/styles/fonts";
import { ExternalLink } from "lucide-react";
import type { SidebarNavItem } from "@/types";

export interface DocsSidebarNavProps {
  items: SidebarNavItem[];
  language: string;
}

/**
 * Renders a sidebar navigation for documentation pages, grouping navigation items.
 * @param {DocsSidebarNavProps} props - The props for the component.
 * @param {SidebarNavItem[]} props.items - Navigation items to be displayed in the sidebar.
 * @param {string} props.language - Current language selected by the user.
 * @returns {React.ReactElement | null} The sidebar navigation component or null if no items are provided.
 */
export function DocsSidebarNav({
  items,
  language,
}: DocsSidebarNavProps): React.ReactElement | null {
  const pathname = usePathname();

  return items.length ? (
    <div className="w-full">
      {items.map((item, index) => (
        <div
          key={index}
          className={cn("border-t pb-6 pt-2", rubikFont.className)}
        >
          <h4 className="mb-1 rounded-md px-2 text-sm font-semibold uppercase text-info">
            {item.title}
          </h4>
          {item.items ? (
            <DocsSidebarNavItems
              items={item.items}
              pathname={pathname}
              language={language}
            />
          ) : null}
        </div>
      ))}
    </div>
  ) : null;
}

interface DocsSidebarNavItemsProps {
  items: SidebarNavItem[];
  pathname: string | null;
  language: string;
}

/**
 * Renders individual navigation items for the sidebar, including external links and highlighting the current page.
 * @param {DocsSidebarNavItemsProps} props - The props for the component.
 * @param {SidebarNavItem[]} props.items - Individual navigation items to render.
 * @param {string | null} props.pathname - The current pathname to determine active links.
 * @param {string} props.language - The current language context for URL construction.
 * @returns {React.ReactElement | null} A grid of navigation items or null if no items are available.
 */
export function DocsSidebarNavItems({
  items,
  pathname,
  language,
}: DocsSidebarNavItemsProps): React.ReactElement | null {
  return items?.length ? (
    <div className="grid grid-flow-row auto-rows-max text-sm">
      {items.map((item, index) =>
        !item.disabled && item.href ? (
          <Link
            key={index}
            href={
              item.href.startsWith("https")
                ? item.href
                : `/${language}/${item.href}`
            } // Update the href with language prefix
            className={cn(
              "flex w-full items-center gap-2 rounded-md p-2 text-foreground hover:bg-muted",
              pathname === `/${language}${item.href}` ? "bg-muted" : "",
            )}
            target={
              item.external ?? item.href.startsWith("https://") ? "_blank" : ""
            }
            rel={
              item.external ?? item.href.startsWith("https://")
                ? "noreferrer"
                : ""
            }
          >
            {item.title}
            {(item.external ?? item.href.startsWith("https://")) && (
              <ExternalLink size={16} />
            )}
            {item.note === "new" && (
              <div className="rounded-lg bg-success px-2 py-[2px] text-xs font-medium uppercase text-success-foreground">
                New
              </div>
            )}
          </Link>
        ) : (
          <span
            key={index}
            className="flex w-full cursor-not-allowed items-center rounded-md p-2 opacity-60"
          >
            {item.title}
          </span>
        ),
      )}
    </div>
  ) : null;
}
