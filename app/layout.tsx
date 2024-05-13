import React from "react";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";

import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { ThemeProvider } from "@/context/ThemeProvider";
import { Toaster } from "sonner";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

/**
 * The root layout component that wraps the entire application.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The content to be rendered within the layout.
 * @returns {JSX.Element} The RootLayout component.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
          <Toaster
            toastOptions={{
              duration: 3000,
              classNames: {
                title: "text-sm font-bold",
                description: "text-xs",
                toast: cn("border-0"),
                success: cn("bg-success text-success-foreground"),
                error: cn("bg-error text-error-foreground"),
                warning: cn("bg-warning text-warning-foreground"),
                info: cn("bg-info text-info-foreground"),
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
