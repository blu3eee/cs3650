"use client";

import * as React from "react";
import Link from "next/link";

import type { NavMenu, MainNavItem, NavItem } from "@/types";

import { Icons } from "@/components/icons";
import { MobileNav } from "@/components/nav/mobile";
import { rubikFont } from "@/styles/fonts";
import { ExternalLink, Menu } from "lucide-react";
// import { ModeToggle } from '../mode-toggle';
import { Button } from "../ui/button";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import type { AdditionalProps } from "..";

interface MainNavProps {
  items?: MainNavItem[];
  children?: React.ReactNode;
}

/**
 * Renders the main navigation menu.
 *
 * This component is designed to display the main navigation links across the top of the
 * application. It dynamically renders navigation items based on the `items` prop. This
 * component is typically visible on wider screens and hidden on mobile, where `MobileNav`
 * would be used instead.
 * @param {MainNavProps} props - The props for the MainNav component.
 * @param {MainNavItem[]} [props.items] - Array of main navigation items to display.
 * @param {React.ReactNode} [props.children] - Optional children to render additionally within the navigation.
 * @param {SiteConfig} [props.config] - Optional children to render additionally within the navigation.
 * @returns {JSX.Element} The MainNav component for desktop viewports.
 */
export function MainNav({ items, children }: MainNavProps): JSX.Element {
  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false);
  // Function to toggle mobile menu visibility
  const toggleMobileMenu = (): void => {
    setShowMobileMenu(!showMobileMenu);
  };

  // Function to close the mobile menu
  const closeMobileMenu = (): void => {
    setShowMobileMenu(false);
  };

  const [activeItem, setActiveItem] = React.useState<NavItem | null>(null);

  return (
    <>
      <div className="flex items-center gap-2 md:hidden">
        <Button
          variant={"ghost"}
          className="relative h-9 w-8 px-0 hover:bg-primary/50"
          onClick={toggleMobileMenu}
        >
          {showMobileMenu ? <Icons.close /> : <Menu />}
        </Button>
      </div>
      {showMobileMenu && items && (
        <MobileNav
          items={items}
          isOpen={showMobileMenu}
          onClose={closeMobileMenu}
        >
          {children}
          {/* <AuthButton /> */}
        </MobileNav>
      )}
      <div className="flex w-fit items-center justify-between gap-6 md:w-full md:gap-10">
        <div className="flex items-center gap-6">
          <Link className="flex items-center" href={"/"}>
            <Icons.logo size={32} />
            <span
              className={`ml-6 hidden text-2xl font-bold uppercase tracking-widest md:block ${rubikFont.className}`}
            >
              {siteConfig.name}
            </span>
          </Link>

          {items?.length ? (
            <NavigationMenu className="hidden w-full md:flex">
              <NavigationMenuList>
                {items.map((item, index) => {
                  if (isNavMenu(item)) {
                    return (
                      <NavMenuListItem
                        item={item}
                        key={index}
                        activeItem={activeItem}
                        setActiveItem={setActiveItem}
                      />
                    );
                  } else {
                    return (
                      <NavigationMenuItem key={index}>
                        <Link href={item.href} legacyBehavior passHref>
                          <NavigationMenuLink
                            className={cn(
                              navigationMenuTriggerStyle(),
                              "gap-2",
                            )}
                          >
                            {item.title}
                            {item.href.startsWith("https") && (
                              <ExternalLink size={16} />
                            )}
                          </NavigationMenuLink>
                        </Link>
                      </NavigationMenuItem>
                    );
                  }
                })}
              </NavigationMenuList>
            </NavigationMenu>
          ) : null}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {/* <ModeToggle /> */}
          {/* <AuthButton /> */}
        </div>
      </div>
    </>
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

/**
 * Represents a list item with a navigation link.
 *
 * This component displays a navigation link within a list item, handling hover states and providing
 * additional textual content.
 * @param {React.ComponentPropsWithoutRef<'a'> & { title: string; className?: string; children: React.ReactNode }} props - The props for the component.
 * @param {React.ForwardedRef<HTMLAnchorElement>} ref - Forwarded ref to the anchor element.
 * @returns {JSX.Element} The list item component.
 */
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> &
    AdditionalProps & { description?: string }
>(({ className, description, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="flex items-center gap-2 text-sm font-medium leading-none">
            {children}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {description}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

/**
 * Renders a navigation menu item that can expand to show additional details or child links.
 *
 * This component displays a trigger that users can interact with to show or hide additional content
 * associated with a navigation item. It is designed for use within a larger navigation menu structure.
 * @param {object} props - Props for configuring the navigation menu list item.
 * @param {NavMenu} props.item - The navigation menu data associated with this list item.
 * @param {NavItem | null} props.activeItem - The currently active navigation item.
 * @param {(new_value: NavItem | null) => void} props.setActiveItem - Function to set the active navigation item.
 * @returns {JSX.Element} The navigation menu list item.
 */
const NavMenuListItem: React.FC<{
  item: NavMenu;
  activeItem: NavItem | null;
  setActiveItem: (new_value: NavItem | null) => void;
}> = ({ item, activeItem, setActiveItem }): JSX.Element => {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
          {item.description && (
            // item description block
            <li className="row-span-3">
              <NavigationMenuLink asChild>
                <a
                  className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                  href={item.description.href}
                >
                  {activeItem ? (
                    <>
                      {activeItem.image && (
                        <Image
                          src={activeItem.image}
                          alt={activeItem.title}
                          width={150}
                          height={150}
                          className="h-auto w-full rounded-md"
                        />
                      )}
                      <div className="mb-2 mt-4 text-lg font-medium">
                        <span className="font-bold">{activeItem.title}</span>
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        {activeItem.description}
                      </p>
                    </>
                  ) : (
                    <>
                      <Icons.logo className="h-6 w-6" />
                      <div className="mb-2 mt-4 text-lg font-medium">
                        {item.title}
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        {item.description.content}
                      </p>
                    </>
                  )}
                </a>
              </NavigationMenuLink>
            </li>
          )}
          {item.items.map((component, index) => (
            <ListItem
              key={index}
              description={component.description}
              href={component.href}
              target={
                component.href.startsWith("https://") ? "_blank" : undefined
              }
              rel={
                component.href.startsWith("https://") ? "noreferrer" : undefined
              }
              onMouseEnter={() => {
                setActiveItem(component);
              }}
              onMouseLeave={() => {
                setActiveItem(null);
              }}
            >
              {component.title}
              {component.href.startsWith("https://") && (
                <ExternalLink size={16} />
              )}
            </ListItem>
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};
