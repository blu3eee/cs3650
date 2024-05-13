"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Plus } from "lucide-react";
import React, { useState } from "react";
import { evaluate } from "mathjs";
import { handleCalculateDirectMap } from "./_utils/direct-mapp";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DirectMappedCache from "./_components/direct-mapped";
import { handleCalculateTwoWayAssociative } from "./_utils/two-way";
import TwoWayAssociativeResults from "./_components/two-way";
import { handleCalculateFourWayAssociative } from "./_utils/four-way";
import FourWayAssociativeResults from "./_components/four-way";
import FullyAssociativeResults from "./_components/associative";
import { handleCalculateFullyAssociative } from "./_utils/fully-associative";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { poppinsFont } from "@/styles/fonts";

/**
 * calculate the value of the string `val`
 * @param {string} val string needs to be evaluate (in math)
 * @returns {string} evaluated result in string
 */
function calculateValue(val: string): string {
  try {
    const value = evaluate(val);
    return value;
  } catch {
    return "invalid";
  }
}

/**
 * cache memory procedure solver and visualizer
 * @returns {React.ReactNode} page component
 */
export default function CachePage(): React.ReactNode {
  const [mainMem, setMainMem] = useState(64);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [mainMemType, setMainMemType] = useState<"MB" | "KB" | "GB">("MB");
  const [blockSize, setBlockSize] = useState(64);
  const [blocks, setBlocks] = useState(256);

  const [unusedBlocks, setUnusedBlocks] = useState<string[]>([
    "2",
    "16",
    "2^10 +7",
    "2^12 + 2^8",
    "2^12 + 7",
    "63",
    "2^10 +12",
    "2^10",
    "2^15 +1",
    "4",
  ]);
  const handleUnusedBlockChange = (index: number, value: string): void => {
    setUnusedBlocks((prevUnusedBlocks) => {
      try {
        const newUnusedBlocks = [...prevUnusedBlocks];
        const values = value.split(",").map((e) => e.trim());

        for (let i = 0; i < values.length; i++) {
          newUnusedBlocks[index + i] = values[i];
        }
        return newUnusedBlocks;
      } catch {
        return prevUnusedBlocks;
      }
    });
  };

  const addressBits = Math.log2(mainMem) + 20;
  const offsetBits = Math.log2(blockSize);
  const indexBits = Math.log2(blocks);

  const [directMapResults, setDirectMapResults] = useState<
    Array<Record<string, string>>
  >([]);
  const [twoWayResults, set2WayResults] = useState<
    Array<Record<string, string>>
  >([]);
  const [fourWayResults, set4WayResults] = useState<
    Array<Record<string, string>>
  >([]);

  const [fullAssociateResults, setFullAssociateResults] = useState<
    Array<Record<string, string>>
  >([]);

  const handleCalculate = (): void => {
    setDirectMapResults(
      handleCalculateDirectMap(
        addressBits,
        blocks,
        unusedBlocks,
        offsetBits,
        indexBits,
      ),
    );
    set2WayResults(
      handleCalculateTwoWayAssociative(
        addressBits,
        blocks,
        unusedBlocks,
        offsetBits,
        indexBits,
      ),
    );
    set4WayResults(
      handleCalculateFourWayAssociative(
        addressBits,
        blocks,
        unusedBlocks,
        offsetBits,
        indexBits,
      ),
    );
    setFullAssociateResults(
      handleCalculateFullyAssociative(
        addressBits,
        blocks,
        unusedBlocks,
        offsetBits,
        indexBits,
      ),
    );
  };

  return (
    <div className="container flex flex-col gap-4 py-8">
      <div className="flex items-center gap-3">
        <Link href={"/"}>
          <ChevronLeft />
        </Link>
        <div className={cn("text-2xl font-semibold", poppinsFont.className)}>
          Cache Memory Procedures
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <Label className="font-bold uppercase text-foreground/50">Input</Label>
        <div className="flex flex-wrap items-center gap-3">
          <Label>Main memory of size</Label>
          <div>
            <Input
              type="number"
              className="w-fit min-w-[40px] bg-transparent text-foreground"
              value={mainMem}
              onChange={(e) => {
                setMainMem(Number(e.target.value));
              }}
            />
          </div>
          <Label>MB with blocks of</Label>
          <div>
            <Input
              type="number"
              className="w-fit min-w-[40px] bg-transparent text-foreground"
              value={blockSize}
              onChange={(e) => {
                setBlockSize(Number(e.target.value));
              }}
            />
          </div>
          <Label>bytes in size. The cache memory can hold up to</Label>
          <div>
            <Input
              type="number"
              className="w-fit min-w-[40px] bg-transparent text-foreground"
              value={blocks}
              onChange={(e) => {
                setBlocks(Number(e.target.value));
              }}
            />
          </div>
          <Label>blocks of data.</Label>
        </div>
        <div className="flex flex-col gap-2">
          Initially the blocks of the cache memory were not used
          <div className="flex flex-wrap items-center gap-2">
            {unusedBlocks.map((block, index) => (
              <div key={index} className=" flex flex-col gap-1">
                <Input
                  className="w-fit bg-transparent text-foreground"
                  value={block}
                  onChange={(e) => {
                    handleUnusedBlockChange(index, e.target.value);
                  }}
                />
                <div className="flex w-full items-center justify-between">
                  <Label className="text-xs uppercase text-foreground/80">
                    {calculateValue(block)}
                  </Label>
                  <div
                    className="cursor-pointer text-xs text-foreground/60 hover:text-foreground/90"
                    onClick={() => {
                      setUnusedBlocks((prev) => [
                        ...prev.slice(0, index),
                        ...prev.slice(index + 1),
                      ]);
                    }}
                  >
                    remove
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button
            size={"sm"}
            variant={"success"}
            onClick={() => {
              setUnusedBlocks((prev) => [...prev, "0"]);
            }}
          >
            <Plus /> add block
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-3 text-sm">
        <div className="flex flex-wrap gap-1">
          <span className="font-bold text-info">
            Main memory size = {mainMem}
            {mainMemType}
          </span>
          = 2^{Math.log2(mainMem)} * 2^20 = 2^{addressBits}.
          <span className="font-bold text-success">
            Address: {addressBits} bits
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          <span className="font-bold text-info">
            Block size: {blockSize} bytes
          </span>
          = 2^{offsetBits}.
          <span className="font-bold text-success">
            Offset = {offsetBits} bits
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          <span className="font-bold text-info">
            Cache memory: {blocks} blocks
          </span>
          = 2^{indexBits}.
          <span className="font-bold text-success">
            Index = {indexBits} bits
          </span>
        </div>
      </div>
      <Button onClick={handleCalculate}>Calculate</Button>
      <Tabs defaultValue="direct-mapped" className="w-full">
        <TabsList className="mb-2 flex h-fit w-fit flex-wrap">
          <TabsTrigger value="direct-mapped">Direct Mapping</TabsTrigger>
          <TabsTrigger value="2way">2-way Associative Cache</TabsTrigger>
          <TabsTrigger value="4way">4-way Associative Cache</TabsTrigger>
          <TabsTrigger value="fully">Fully Associative Cache</TabsTrigger>
        </TabsList>
        <TabsContent value="direct-mapped">
          <DirectMappedCache results={directMapResults} />
        </TabsContent>
        <TabsContent value="2way">
          <TwoWayAssociativeResults results={twoWayResults} />
        </TabsContent>
        <TabsContent value="4way">
          <FourWayAssociativeResults results={fourWayResults} />
        </TabsContent>
        <TabsContent value="fully">
          <FullyAssociativeResults results={fullAssociateResults} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
