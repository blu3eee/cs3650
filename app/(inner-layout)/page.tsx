import React from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { poppinsFont } from "@/styles/fonts";

import Link from "next/link";

/**
 * Home component that represents the main content of the homepage.
 * @returns {JSX.Element} The Home component.
 */
export default function Home(): JSX.Element {
  return (
    <div className="mx-auto mb-4 mt-4 flex max-w-5xl flex-col gap-4 px-6">
      <div
        className={cn(
          "w-full text-center text-5xl font-semibold",
          poppinsFont.className,
        )}
      >
        CS3650
      </div>
      <div className="flex w-full items-center justify-center gap-2">
        <a
          href="https://github.com/blu3eee/cs3650"
          target="_blank"
          rel="noreferrer"
          className={cn(buttonVariants({ variant: "secondary" }), "gap-2")}
        >
          <Image
            src={"https://github.com/blu3eee.png?size=1024"}
            height={1024}
            width={1024}
            alt="logo"
            className="object-fit h-full w-auto rounded-full"
          />
          Github
        </a>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href={"/cache-memory-procedures"}
          className={cn(buttonVariants({ variant: "secondary", size: "md" }))}
        >
          Cache Memory Procedure
        </Link>
        <Link
          href={"/mips-processor"}
          className={cn(buttonVariants({ variant: "secondary", size: "md" }))}
        >
          MIPS Instruction Pipeline Visualization
        </Link>
        <Link
          href={"/machine-instructions-converter"}
          className={cn(buttonVariants({ variant: "secondary", size: "md" }))}
        >
          Machine Instruction Converter
        </Link>
      </div>
    </div>
  );
}
