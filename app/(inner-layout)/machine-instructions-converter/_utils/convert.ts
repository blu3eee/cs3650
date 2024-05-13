import type { InstructionsBlockItem } from "../page";

/**
 * Function to convert a binary string to a number
 * @param {string} binaryString string of binary number to be converted
 * @returns {number} converted number
 */
function binaryStringToNumber(binaryString: string): number {
  return parseInt(binaryString, 2);
}

/**
 * Function to convert a number to a binary string
 * @param {number} number decimal number
 * @returns {string} converted binary string
 */
function numberToBinaryString(number: number): string {
  if (typeof number !== "number" || number < 0) {
    throw new Error("Input must be a non-negative integer");
  }
  return number.toString(2);
}

type InstructionType =
  | "load"
  | "branch"
  | "branch neg"
  | "add"
  | "store"
  | "sub"
  | "mult"
  | "stop";

const itypeMap: { [key in InstructionType]: string } = {
  load: "000",
  add: "001",
  store: "010",
  sub: "011",
  mult: "100",
  "branch neg": "101",
  branch: "110",
  stop: "111",
};

interface Instruction {
  type: InstructionType;
  operand: string;
  content: string;
}

export interface ConvertedInstruction {
  instruction: string;
  address: string;
  content: string;
  parsedInstruction: Instruction | null;
}

export interface ConvertedBlock {
  id: string;
  name: string;
  instructions: ConvertedInstruction[];
}

export interface ConvertResults {
  convertedResults: ConvertedBlock[];
  variables: Array<{ name: string; address: string }>;
}

// Regex patterns for each instruction type
const instructionPatterns: { [key in InstructionType]: RegExp } = {
  load: /^load\s+(\w+)$/i,
  "branch neg": /^branch\s+neg\s+(\w+)$/i,
  branch: /^branch\s+(\w+)$/i,
  add: /^add\s+(\w+)$/i,
  store: /^store\s+(\w+)$/i,
  sub: /^sub\s+(\w+)$/i,
  mult: /^mult\s+(\w+)$/i,
  stop: /^stop\s+/,
};

/**
 * Function to parse an instruction string into an Instruction object
 * @param {string} instruction assembly instruction
 * @returns {Instruction | null} parsed Instruction object or null if not possible
 */
function parseInstruction(instruction: string): Instruction | null {
  const bnegMatch = instruction.match(instructionPatterns["branch neg"]);
  if (bnegMatch) {
    return {
      type: "branch neg" as InstructionType,
      operand: bnegMatch.slice(1).join(" "),
      content: itypeMap["branch neg"],
    };
  }

  const stopMatch = instruction.match(instructionPatterns.stop);
  if (stopMatch) {
    return {
      type: "stop" as InstructionType,
      operand: "",
      content: itypeMap.stop,
    };
  }

  for (const [type, pattern] of Object.entries(instructionPatterns)) {
    const match = instruction.match(pattern);
    if (match) {
      return {
        type: type as InstructionType,
        operand: match.slice(1).join(" "),
        content: itypeMap[type as InstructionType],
      };
    }
  }
  return null;
}

/**
 * function to process converting a set of blocks of assembly code
 * with starting memory location to machine instructions
 * @param {string} startMemLoc starting memory location
 * @param {InstructionsBlockItem[]} instructionBlocks blocks of assembly instructions
 * @returns {ConvertResults} converted results with the converted machine instructions and variables
 */
export function converter(
  startMemLoc: string,
  instructionBlocks: InstructionsBlockItem[],
): ConvertResults {
  instructionBlocks = instructionBlocks.map((block) => ({
    id: block.id,
    name: block.name.toLowerCase(),
    instructions: block.instructions.toLowerCase(),
  }));
  const maxBits = startMemLoc.length;
  const results: ConvertedBlock[] = [];
  let curMemloc = binaryStringToNumber(startMemLoc);
  const variables: Set<string> = new Set<string>();

  for (const block of instructionBlocks) {
    const blockInstructions = block.instructions.split("\n");
    const instructions: Array<{
      instruction: string;
      address: string;
      content: string;
      parsedInstruction: Instruction | null;
    }> = [];
    for (const instruction of blockInstructions) {
      const parsedInstruction = parseInstruction(instruction.trim());
      if (
        parsedInstruction?.type !== "branch" &&
        parsedInstruction?.type !== "branch neg"
      ) {
        variables.add(parsedInstruction?.operand ?? "");
      }
      instructions.push({
        instruction,
        address: numberToBinaryString(curMemloc).padStart(maxBits, "0"),
        content: parsedInstruction?.content ?? "xxx",
        parsedInstruction,
      });
      curMemloc += 1;
    }
    results.push({
      id: block.id,
      name: block.name,
      instructions,
    });
  }

  const variablesList = Array.from(variables)
    .filter((x) => x !== "")
    .sort()
    .map((variable) => ({
      name: variable,
      address: numberToBinaryString(curMemloc++).padStart(maxBits, "0"),
    }));

  for (const block of results) {
    block.instructions = block.instructions.map((i) => {
      if (i.instruction === "stop") {
        return {
          ...i,
          content: "111 00000",
        };
      }
      if (i.parsedInstruction) {
        if (
          i.parsedInstruction.type === "branch" ||
          i.parsedInstruction.type === "branch neg"
        ) {
          const operandAddress =
            results.find((x) => x.name === i.parsedInstruction?.operand)
              ?.instructions[0].address ?? "notfound";
          return {
            ...i,
            content: i.content + ` ${operandAddress}`,
          };
        } else {
          const operandAddress =
            variablesList.find((x) => x.name === i.parsedInstruction?.operand)
              ?.address ?? "xxxxx";
          return {
            ...i,
            content: i.content + ` ${operandAddress}`,
          };
        }
      }

      return {
        ...i,
        content: i.content + ` xxxxx`,
      };
    });
  }

  return {
    convertedResults: results,
    variables: variablesList,
  };
}
