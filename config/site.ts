import type { MainNavItem, SiteConfig } from "@/types";

export const mainNavItems: MainNavItem[] = [
  // {
  //   title: "Learn more",
  //   items: [
  //     {
  //       title: "Github",
  //       href: "https://github.com",
  //       description: "My Github",
  //     },
  //     {
  //       title: "About Us",
  //       href: "/about-us",
  //     },
  //   ],
  // },
  // {
  //   title: "Development",
  //   items: [
  //     {
  //       title: "Playground",
  //       href: "/development",
  //     },
  //   ],
  // },
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
    // {
    //   title: "About Us",
    //   href: "/About us",
    // },
  ],
};
