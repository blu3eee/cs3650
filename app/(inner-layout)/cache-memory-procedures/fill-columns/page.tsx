"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronLeft, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { completeDirectMappedCache } from "./_utils/direct-mapped";
import { completeTwoWayAssociateCache } from "./_utils/two-way";
import { completeFullAssociativeCache } from "./_utils/full-associative";
import { poppinsFont } from "@/styles/fonts";
import Link from "next/link";

interface CacheField {
  name: string;
  required?: boolean;
}

interface CacheMethod {
  name: string;
  fields: CacheField[];
  evaluate: (
    inputs: Array<Record<string, string>>,
  ) => Array<Record<string, string>>;
}

const methods: CacheMethod[] = [
  {
    name: "Direct-mapped cache",
    fields: [
      { name: "tag", required: true },
      { name: "index", required: true },
      { name: "offset", required: true },
      { name: "replace" },
      { name: "hit/miss" },
    ],
    evaluate: completeDirectMappedCache,
  },
  {
    name: "2-way set associative cache",
    fields: [
      { name: "tag", required: true },
      { name: "set", required: true },
      { name: "tag-of-block-0" },
      { name: "tag-of-block-1" },
      { name: "offset", required: true },
      { name: "replace" },
      { name: "hit/miss" },
    ],
    evaluate: completeTwoWayAssociateCache,
  },
  {
    name: "Full associate cache",
    fields: [
      { name: "tag", required: true },
      { name: "cache-block-used" },
      { name: "offset", required: true },
      { name: "replace" },
      { name: "hit/miss" },
    ],
    evaluate: completeFullAssociativeCache,
  },
];

/**
 * generate a row for input for the method's fields
 * @param {CacheField[]} fields method's fields
 * @returns {Record<string, string>} newly generately input data for a row
 */
function generateInputRow(fields: CacheField[]): Record<string, string> {
  const newInputRow: Record<string, string> = {};
  fields.forEach((field) => {
    newInputRow[field.name] = field.required ? "0" : "";
  });
  return newInputRow;
}

const Page = (): React.ReactNode => {
  const [method, setMethod] = useState<CacheMethod>(methods[0]);
  const [inputs, setInputs] = useState<Array<Record<string, string>>>([
    {
      tag: "0",
      index: "0",
      offset: "0",
      replace: "",
      "hit/miss": "",
    },
  ]);

  const handleMethodChange = (val: CacheMethod): void => {
    setInputs([generateInputRow(val.fields)]);
    setMethod(val);
  };

  const handleInputChange = (
    rowIndex: number,
    fieldName: string,
    value: number,
  ): void => {
    const newInputs = [...inputs];
    newInputs[rowIndex][fieldName] = String(value);
    setInputs(newInputs);
  };

  const handleProcess = (): void => {
    try {
      const results = method.evaluate(inputs);
      setInputs(results);
    } catch (e) {
      console.error("error processing inputs", e);
    }
  };

  return (
    <div className="containter flex flex-col gap-4 p-4">
      <div
        className={cn(
          "flex items-center gap-2 text-2xl font-semibold",
          poppinsFont.className,
        )}
      >
        <Link href={"/cache-memory-procedures"}>
          <ChevronLeft />
        </Link>
        Cache Memory Procedures
      </div>
      <Selector value={method} onChange={handleMethodChange} />
      <div>
        <CacheTable
          fields={method.fields}
          inputs={inputs}
          onInputChange={handleInputChange}
        />
      </div>
      <Button
        size={"sm"}
        variant={"success"}
        className="w-fit gap-2"
        onClick={() => {
          setInputs((prev) => [...prev, generateInputRow(method.fields)]);
        }}
      >
        <Plus size={18} /> add row
      </Button>
      <Button
        size={"sm"}
        variant={"info"}
        className="gap-2"
        onClick={handleProcess}
      >
        process
      </Button>
    </div>
  );
};

export default Page;

interface CacheTableProps {
  fields: CacheField[];
  inputs: Array<Record<string, string>>;
  onInputChange: (rowIndex: number, fieldName: string, value: number) => void;
}

const CacheTable: React.FC<CacheTableProps> = ({
  fields,
  inputs,
  onInputChange,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {fields.map((field, index) => (
            <TableHead
              key={index}
              className={cn(
                " capitalize",
                index !== fields.length - 1 && "border-r border-muted",
              )}
            >
              {field.name.split("-").join(" ")}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {inputs.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {Object.keys(row).map((k, index) => (
              <TableCell
                key={index}
                className={cn(
                  index !== Object.keys(row).length - 1 &&
                    "border-r border-muted",
                )}
              >
                {fields.find((f) => f.name === k)?.required ? (
                  <Input
                    value={row[k]}
                    className="w-fit min-w-0"
                    type="number"
                    onChange={(e) => {
                      onInputChange(rowIndex, k, Number(e.target.value));
                    }}
                  />
                ) : (
                  row[k]
                )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

interface SelectorProps {
  value: CacheMethod;
  onChange: (val: CacheMethod) => void;
}
const Selector: React.FC<SelectorProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <div
          className={cn(
            // buttonVariants({ variant: "outline", size: "sm" }),
            "flex w-fit cursor-pointer items-center gap-2 rounded-lg border-2 border-info px-3 py-2 text-sm font-medium",
          )}
        >
          {value.name ?? "Select method"}
          <ChevronDown
            className={cn(
              "transition-all duration-300 ease-in-out",
              isOpen && "rotate-180",
            )}
            size={20}
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {methods.map((method, index) => (
          <DropdownMenuItem
            key={index}
            onSelect={() => {
              onChange(method);
            }}
            className={cn(
              "cursor-pointer",
              value.name === method.name && "bg-foreground/10",
            )}
          >
            {method.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
