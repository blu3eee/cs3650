export type InstructionType = "add" | "lw" | "sw";

export interface Instruction {
  value: string;
  type: string;
  dest?: string;
  src1?: string;
  src2?: string;
  base?: string;
  offset?: number;
}

/**
 * parsing a string to an Instruction object
 * @param instruction instruciton string
 * @returns Instruction object
 */
export function parseIns(instruction: string): Instruction {
  const parts = instruction.split(" ")[0];
  const remainder = instruction.slice(parts.length).trim();

  const parsedInstruction: Instruction = { value: instruction, type: parts };

  switch (parts) {
    case "add":
      {
        const addMatch = remainder.match(
          /^\$([a-zA-Z0-9]+)\s*,\s*\$([a-zA-Z0-9]+)\s*,\s*\$([a-zA-Z0-9]+)$/,
        );

        if (addMatch) {
          parsedInstruction.dest = addMatch[1];
          parsedInstruction.src1 = addMatch[2];
          parsedInstruction.src2 = addMatch[3];
        }
      }
      break;
    case "lw":
      {
        const lwMatch = remainder.match(
          /^\$([a-zA-Z0-9]+)\s*,\s*(-?\d+)\s*\(\s*\$([a-zA-Z0-9]+)\s*\)$/,
        );

        if (lwMatch) {
          parsedInstruction.dest = lwMatch[1];
          parsedInstruction.offset = parseInt(lwMatch[2]);
          parsedInstruction.base = lwMatch[3];
        }
      }
      break;
    case "sw":
      {
        const swMatch = remainder.match(
          /^\$([a-zA-Z0-9]+)\s*,\s*(-?\d+)\s*\(\s*\$([a-zA-Z0-9]+)\s*\)$/,
        );
        if (swMatch) {
          parsedInstruction.src1 = swMatch[1];
          parsedInstruction.offset = parseInt(swMatch[2]);
          parsedInstruction.base = swMatch[3];
        }
      }
      break;
    default:
      throw new Error(`Invalid instruction: ${instruction}`);
  }

  return parsedInstruction;
}

/**
 * parsing a set of string to a list of Instructions objects
 * @param instructions an array of instruction strings
 * @returns an array of Instruction objects
 */
export function parseInstructions(instructions: string[]): Instruction[] {
  const parsedInstructions: Instruction[] = [];

  for (const instruction of instructions
    .map((e) => e.trim())
    .filter((x) => x !== "")) {
    const parsedInstruction = parseIns(instruction);
    parsedInstructions.push(parsedInstruction);
  }

  return parsedInstructions;
}

/*
 * Example sets of instructions
 * Example set 1:
 * lw $t0, 0($t2)
 * add $t3 $t1, $t0
 * sw $t3, 0($t1)
 * add $t4, $t3, $t0
 * sw $t4, 0($t2)
 *
 * Example set 2:
 * lw $t1, 0($t0)
 * lw $t2, 4($t0)
 * add $t3, $t1, $t2
 * sw $t3, 12($t0)
 * lw $t4, 8($t0)
 * add $t5, $t1, $t4
 * sw $t5, 16($t0)
 */

// • IF – Instruction Fetch.
// • ID – Instruction Decode.
// • EX – Execution or Address Calculation.
// • Mem – Data Memory Access.
// • WB – Write Back.
// Assuming parseInstructions function exists and returns parsed instructions as defined

// expected output
/*
cycle             1   2   3   4   5   6   7   8   9   10   11   12   13
lw $t1,0($t0)     IF  ID  EX  MEM WB
lw $t2,4($t0)     x   IF  ID  EX  MEM WB
add $t3,$t1,$t2   x   x   x   IF  ID  EX  MEM WB
sw $t3,12($t0)    x   x   x   x   IF  ID  EX  MEM WB
lw $t4,8($t0)     x   x   x   x   x   IF  ID  EX  MEM WB
add $t5,$t1,$t4   x   x   x   x   x   x   x   IF  ID  EX   MEM  WB
sw $t5,16($t0)    x   x   x   x   x   x   x   x   IF  ID   EX   MEM  WB
*/

/**
 * pipline visualizer, receive a set of instructions and return a table of cycles with instruction stages
 * @param {string[]} instructions input set of instructions
 * @returns {string[][]} table of cycles with instruciton stages
 */
export function pipelineVisualizer(instructions: string[]): string[][] {
  const stages = ["IF", "ID", "EX", "MEM", "WB"];
  const parsed = parseInstructions(instructions);

  let cycle = 1;
  const pipelineStates: string[][] = [];
  const registerWriteCycles: Record<string, number> = {};

  for (const instruction of parsed) {
    try {
      let startCycle = cycle;
      switch (instruction.type) {
        // locate
        case "lw":
          registerWriteCycles[instruction.dest ?? "lw"] = startCycle + 3;
          pipelineStates.push([
            instruction.value,
            ...Array(startCycle - 1).fill("xx"),
            ...stages,
          ] as string[]);

          break;
        // add
        case "add":
          startCycle = Math.max(
            registerWriteCycles[instruction.src1 ?? "lw"] - 1,
            registerWriteCycles[instruction.src2 ?? "lw"] - 1,
            cycle,
          );
          pipelineStates.push([
            instruction.value,
            ...Array(startCycle - 1).fill("xx"),
            ...stages,
          ] as string[]);
          break;
        // store
        case "sw":
          pipelineStates.push([
            instruction.value,
            ...Array(startCycle - 1).fill("xx"),
            ...stages,
          ] as string[]);
          break;
        default:
          throw new Error(`Invalid instruction: ${instruction.value}`);
      }
      cycle = startCycle + 1;
    } catch (e) {
      console.error(e);
      throw new Error(`Invalid instruction: ${instruction.value}`);
    }
  }
  const maxCycles = pipelineStates[pipelineStates.length - 1].length;

  return pipelineStates.map((row) => [
    ...row,
    ...Array(maxCycles - row.length).fill("xx"),
  ]);
}
