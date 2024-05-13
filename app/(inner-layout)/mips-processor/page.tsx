"use client";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { parseInstructions, pipelineVisualizer } from "./_utils/visualize";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { ChevronLeft, GripVertical, Plus, Trash } from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { poppinsFont } from "@/styles/fonts";
import Link from "next/link";

// Example usage
const sampleInstructions = [
  "lw $t1, 0($t0)",
  "lw $t2, 4($t0)",
  "add $t3, $t1,$t2",
  "sw $t3, 12($t0)",
  "lw $t4, 8($t0)",
  "add $t5, $t1,$t4",
  "sw $t5, 16($t0)",
];

interface Item {
  id: string;
  instruction: string;
}

// a little function to help us with reordering the result
const reorder = <TList extends unknown[]>(
  list: TList,
  startIndex: number,
  endIndex: number,
): TList => {
  const result = Array.from(list) as TList;
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const Page = (): React.ReactNode => {
  const [instructions, setInstructions] = useState<Item[]>([]);
  const [results, setResults] = useState<string[][]>([]);
  const [loadText, setLoadText] = useState<string>(
    instructions.map((item) => item.instruction).join("\n"),
  );

  const handleInput = (index: number, value: string): void => {
    setInstructions((prevInstructions) => {
      try {
        const newUnusedBlocks = [...prevInstructions];
        newUnusedBlocks[index] = {
          ...newUnusedBlocks[index],
          instruction: value,
        };

        return newUnusedBlocks;
      } catch {
        return prevInstructions;
      }
    });
  };

  const handleAddNew = (): void => {
    setInstructions((prev) => [
      ...prev,
      {
        id: uuidv4(),
        instruction: "",
      },
    ]);
  };

  const handleRemoveInstruction = (index: number): void => {
    setInstructions((prev) => [
      ...prev.slice(0, index),
      ...prev.slice(index + 1),
    ]);
  };

  const handleProcess = (): void => {
    try {
      setResults([]);
      const res = pipelineVisualizer(instructions.map((i) => i.instruction));
      setResults(res);
      toast.success("Results updated");
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      toast.error(`${e}`);
    }
  };

  const onDragEnd = (result: DropResult): void => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      instructions,
      result.source.index,
      result.destination.index,
    );

    setInstructions(items);
  };

  useEffect(() => {
    setInstructions(
      sampleInstructions.map((i) => ({
        id: uuidv4(),
        instruction: i,
      })),
    );
  }, []);
  return (
    <div className="container flex flex-col gap-4 p-4">
      <div className="flex items-center gap-3">
        <Link href={"/"}>
          <ChevronLeft />
        </Link>
        <div className={cn("text-2xl font-semibold", poppinsFont.className)}>
          MIPS Instruction Pipeline Visualization
        </div>
      </div>
      <div className="flex flex-col font-medium uppercase text-foreground/60">
        Inputs
      </div>
      <Dialog>
        <DialogTrigger
          className={cn(
            buttonVariants({ variant: "secondary", size: "sm" }),
            "",
          )}
          onClick={() => {
            setLoadText(
              instructions.map((item) => item.instruction).join("\n"),
            );
          }}
        >
          Load instructions by text
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Load instructions</DialogTitle>
            <DialogDescription>
              <Textarea
                className="h-[50dvh] "
                value={loadText}
                onChange={(e) => {
                  setLoadText(e.target.value);
                }}
              />
            </DialogDescription>
            <DialogClose>
              <div className="flex items-center gap-2">
                <Button variant={"outline"}>Cancel</Button>
                <Button
                  onClick={() => {
                    try {
                      parseInstructions(loadText.split("\n"));
                      setInstructions(
                        loadText.split("\n").map((i) => ({
                          id: uuidv4(),
                          instruction: i,
                        })),
                      );
                      toast.success("Loaded instructions");
                    } catch (e) {
                      toast.error(`Invalid instructions`);
                    }
                  }}
                >
                  Load
                </Button>
              </div>
            </DialogClose>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(droppableProvided, droppableSnapshot) => (
            <div
              ref={droppableProvided.innerRef}
              className="flex flex-col gap-2 rounded-md bg-secondary p-3"
            >
              <div>Instruction set</div>
              {instructions.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(draggableProvided, draggableSnapshot) => (
                    <div
                      className="flex w-full items-center gap-1"
                      ref={draggableProvided.innerRef}
                      {...draggableProvided.draggableProps}
                      {...draggableProvided.dragHandleProps}
                    >
                      <div className="flex w-full items-center gap-1">
                        <div>
                          <GripVertical className="cursor-pointer text-foreground/50 hover:text-foreground/80" />
                        </div>
                        <Input
                          className=""
                          value={item.instruction}
                          onChange={(e) => {
                            handleInput(index, e.target.value);
                          }}
                        />
                      </div>
                      <Button
                        size={"sm"}
                        variant={"ghost"}
                        className="px-1"
                        onClick={() => {
                          handleRemoveInstruction(index);
                        }}
                      >
                        <Trash className="text-error" />
                      </Button>
                    </div>
                  )}
                </Draggable>
              ))}
              {droppableProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <Button onClick={handleAddNew} variant={"success"} className="gap-2">
        <Plus />
        Add new instruction
      </Button>
      <Button onClick={handleProcess} variant={"info"}>
        Process
      </Button>
      <div className="flex flex-col font-medium uppercase text-foreground/60">
        Result
      </div>
      <Table className="rounded-md bg-secondary">
        <TableCaption className="captitalize">MIPS Processor</TableCaption>
        <TableHeader>
          <TableRow className="border-foreground/20">
            {results.length > 0 && (
              <>
                <TableHead className="w-fit min-w-[50px] border-r border-foreground/20 capitalize">
                  Cycle
                </TableHead>
                {results[results.length - 1].map((_, index) => (
                  <TableHead
                    key={index}
                    className={cn(
                      "capitalize",
                      "border-r border-foreground/20",
                    )}
                  >
                    {index + 1}
                  </TableHead>
                ))}
              </>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.length > 0 &&
            results.map((row, index) => (
              <TableRow key={index} className="border-foreground/20">
                {row.map((value, index) => (
                  <TableCell
                    key={index}
                    className={cn(
                      "w-fit border-r border-foreground/20 font-medium",
                      (value === "hit" || value === "yes") &&
                        "font-bold text-success",
                      index === 0 && "min-w-[150px]",
                    )}
                  >
                    {value !== "xx" ? value : ""}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <div className="flex flex-col font-medium uppercase text-foreground/60">
        Resources
      </div>
      <div>
        <a
          href="https://www.cs.fsu.edu/~zwang/files/cda3101/Fall2017/Lecture7_cda3101.pdf#page=31"
          target="_blank"
          rel="noreferrer"
          className="text-info underline"
        >
          https://www.cs.fsu.edu/~zwang/files/cda3101/Fall2017/Lecture7_cda3101.pdf#page=31
        </a>
      </div>
    </div>
  );
};

export default Page;
