"use client";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

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
import { Button } from "@/components/ui/button";
import { ChevronLeft, GripVertical, Plus, Trash } from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";

import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { poppinsFont } from "@/styles/fonts";
import Link from "next/link";
import { type ConvertResults, converter } from "./_utils/convert";
import { Label } from "@/components/ui/label";

const sampleInstructions = [
  {
    name: "Start",
    instructions: `Load C\nBranch Neg LN1`,
  },
  {
    name: "End",
    instructions: `Add A\nStore B\nStop`,
  },
  {
    name: "LN1",
    instructions: `Load A\nBranch Neg LN2\nLoad C\nSub A\nStore C`,
  },

  {
    name: "LN2",
    instructions: `Load C\nMult A\nStore A\nBranch Start`,
  },
];

export interface InstructionsBlockItem {
  id: string;
  name: string;
  instructions: string;
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
  const [instructions, setInstructions] = useState<InstructionsBlockItem[]>([]);
  const [results, setResults] = useState<ConvertResults | null>(null);
  const [startingMemLoc, setStartingMemLoc] = useState("00010");
  const handleInputInstructions = (
    index: number,
    key: string,
    value: string,
  ): void => {
    setInstructions((prevInstructions) => {
      try {
        const newUnusedBlocks = [...prevInstructions];
        newUnusedBlocks[index] = {
          ...newUnusedBlocks[index],
          [key]: value,
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
        name: "new",
        instructions: "",
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
      setResults(null);

      setResults(converter(startingMemLoc, instructions));
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
        name: i.name,
        instructions: i.instructions,
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
          Machine Instructions of Simple Processor From Assembly Instructions
        </div>
      </div>
      <div className="flex flex-col font-medium uppercase text-foreground/60">
        Inputs
      </div>
      <div className="text-sm font-medium text-foreground/70">
        The site will assume you enter the correct inputs, no data verification
        is going to be done. If you are trying to converting to machine
        instructions from high-level code, please make sure you have the correct
        assembly instructions from the high-level code first.
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Label>Starting memory location:</Label>
        <Input
          value={startingMemLoc}
          onChange={(e) => {
            setStartingMemLoc(e.target.value);
          }}
          className="w-fit"
        />
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(droppableProvided, droppableSnapshot) => (
            <div
              ref={droppableProvided.innerRef}
              className="flex flex-col gap-2 rounded-md bg-secondary p-3"
            >
              <div>Assembly Instructions</div>
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
                        <div className="flex h-fit w-full gap-1">
                          <Input
                            className="w-fit"
                            value={item.name}
                            onChange={(e) => {
                              handleInputInstructions(
                                index,
                                "name",
                                e.target.value,
                              );
                            }}
                          />
                          <Textarea
                            className="h-[100px]"
                            value={item.instructions}
                            onChange={(e) => {
                              handleInputInstructions(
                                index,
                                "instructions",
                                e.target.value,
                              );
                            }}
                          />
                        </div>
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
      {results && (
        <>
          <div className="flex flex-col font-medium uppercase text-foreground/60">
            Result
          </div>
          <Table className="rounded-md bg-secondary">
            <TableCaption className="captitalize">
              Machine Instructions of Simple Processor
            </TableCaption>
            <TableHeader>
              <TableRow className="border-foreground/20">
                <TableHead className="border-r border-foreground/20">
                  Block
                </TableHead>
                <TableHead className="border-r border-foreground/20">
                  Assembly Language
                </TableHead>
                <TableHead className="border-r border-foreground/20">
                  Address
                </TableHead>
                <TableHead>Memory</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.convertedResults.map((block, index) => (
                <>
                  {block.instructions.map((instruction, j) => (
                    <TableRow
                      key={index * 10 + j}
                      className="border-b border-foreground/20"
                    >
                      <TableCell className="border-r border-foreground/20">
                        {j === 0 && block.name}
                      </TableCell>
                      <TableCell className="border-r border-foreground/20">
                        {instruction.instruction}
                      </TableCell>
                      <TableCell className="border-r border-foreground/20">
                        {instruction.address}
                      </TableCell>
                      <TableCell>{instruction.content}</TableCell>
                    </TableRow>
                  ))}
                </>
              ))}
              {results.variables.map((variable, index) => (
                <TableRow
                  key={results.convertedResults.length * 10 + index}
                  className="border-b border-foreground/20"
                >
                  <TableCell className="border-r border-foreground/20"></TableCell>
                  <TableCell className="border-r border-foreground/20"></TableCell>
                  <TableCell className="border-r border-foreground/20">
                    {variable.address}
                  </TableCell>
                  <TableCell>{`{${variable.name}}`}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  );
};

export default Page;
