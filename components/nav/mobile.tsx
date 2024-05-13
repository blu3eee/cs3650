import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { useLockBody } from "@/hooks/use-lock-body";
import { Icons } from "@/components/icons";
import type { MainNavItem, NavMenu } from "@/types";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { siteConfig } from "@/config/site";

interface MobileNavProps {
  items: MainNavItem[];
  children?: React.ReactNode;
  isOpen: boolean; // Added to represent the open state
  onClose: () => void;
}

/**
 * Renders a mobile navigation menu that is toggleable via the `isOpen` prop.
 *
 * The navigation presents the site's logo and a list of navigation items. It uses the `useLockBody`
 * hook to prevent body scroll when open. The `onClose` callback is invoked to close the menu.
 * @param {MobileNavProps} props - The props for the MobileNav component.
 * @returns {JSX.Element} - The MobileNav component.
 */
export function MobileNav({
  items,
  children,
  isOpen,
  onClose,
}: MobileNavProps): JSX.Element {
  useLockBody(isOpen); // Pass the `isOpen` state to the hook

  return (
    <div
      className={cn(
        "fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-y-auto bg-black/80 px-4 pb-32 pt-6 shadow-md animate-in slide-in-from-top-10 md:hidden",
      )}
    >
      <div
        className="fixed bottom-0 left-0 right-0 top-0 z-10 "
        onClick={onClose}
      />
      <div className="relative z-20 grid gap-6 rounded-md bg-popover p-4 text-popover-foreground shadow-md">
        <Link
          href={"/"}
          onClick={onClose}
          className="flex items-center space-x-2 text-xl"
        >
          <Icons.logo size={32} />
          <span className="font-bold">{siteConfig.name}</span>
        </Link>
        <nav className="grid grid-flow-row auto-rows-max gap-2 text-sm">
          {items.map((item, index) => {
            if (isNavMenu(item)) {
              return (
                <Collapsible key={index} className="group">
                  <CollapsibleTrigger className="flex items-center gap-2 text-foreground">
                    <span className="text-md font-bold">{item.title}</span>
                    <ChevronDown
                      size={16}
                      className="transition duration-200 group-data-[state=open]:rotate-180"
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    {item.items.map((navItem, i) => {
                      return (
                        <Link
                          key={i}
                          onClick={onClose}
                          href={navItem.disabled ? "#" : navItem.href}
                          className={cn(
                            "flex w-full items-center rounded-md px-6 py-2 text-sm font-medium hover:underline",
                            navItem.disabled && "cursor-not-allowed opacity-60",
                          )}
                        >
                          {navItem.title}
                        </Link>
                      );
                    })}
                  </CollapsibleContent>
                </Collapsible>
              );
            } else {
              return (
                <Link
                  key={index}
                  onClick={onClose}
                  href={item.disabled ? "#" : item.href}
                  className={cn(
                    "flex w-full items-center rounded-md py-2 text-sm font-medium hover:underline",
                    item.disabled && "cursor-not-allowed opacity-60",
                  )}
                >
                  {item.title}
                </Link>
              );
            }
          })}
        </nav>
        {children}
      </div>
    </div>
  );
}

/**
 * Type guard to determine if a given navigation item is a submenu.
 *
 * This function checks if the 'items' property exists on the navigation item, indicating it's a NavMenu.
 * @param {MainNavItem} item - The navigation item to check.
 * @returns {boolean} - Returns true if the item is a NavMenu; otherwise, false.
 */
function isNavMenu(item: MainNavItem): item is NavMenu {
  return (item as NavMenu).items !== undefined;
}
