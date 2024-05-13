import type { MainNavItem, SiteConfig } from "@/types";

export const mainNavItems: MainNavItem[] = [
  {
    title: "Disclaimer",
    href: "https://github.com/blu3eee/cs3650/blob/main/README.md",
  },
];

export const siteConfig: SiteConfig = {
  name: "CS3650",
  description:
    "Solver and visualizer for some of the problems for CS3650 course at CPP",
  href: "/",
  mainNav: mainNavItems,
  footerNav: [
    {
      title: "Github",
      href: "https://github.com/blu3eee/cs3650",
    },
    {
      title: "Disclaimer",
      href: "https://github.com/blu3eee/cs3650/blob/main/README.md",
    },
  ],
};
