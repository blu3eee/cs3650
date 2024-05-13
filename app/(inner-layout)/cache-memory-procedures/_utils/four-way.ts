import { evaluate } from "mathjs";

// todo: change the algo to calculate hit/miss and replace in this case, this is still using direct mapping method for those two variables
export const handleCalculateFourWayAssociative = (
  addressBits: number,
  blocks: number,
  unusedBlocks: string[],
  offsetBits: number,
  indexBits: number,
): Array<Record<string, string>> => {
  const block0Memory = Array(blocks).fill(null);
  const block1Memory = Array(blocks).fill(null);
  const newResults: Array<Record<string, string>> = [];
  const tagLabel = `tag ${addressBits - (indexBits - 2) - offsetBits}b`;
  const indexLabel = `set ${indexBits - 2}b`;
  const offsetLabel = `offset ${offsetBits}b`;
  for (const block of unusedBlocks) {
    try {
      const address = evaluate(block);
      const tag = Math.floor(address / Math.pow(2, offsetBits + indexBits - 2));
      const index = Math.floor(
        (address / Math.pow(2, offsetBits)) % Math.pow(2, indexBits - 2),
      );
      const offset = Math.floor(address % Math.pow(2, offsetBits));

      let hit = false;
      let replaced = false;
      // Check if the current set is empty
      if (block0Memory[index] === null && block1Memory[index] === null) {
        // Miss, No Replace
        block0Memory[index] = tag;
      } else if (block0Memory[index] === tag || block1Memory[index] === tag) {
        // Hit, No Replace
        hit = true;
      } else if (block0Memory[index] !== null && block1Memory[index] !== null) {
        // Miss, Replace
        // Replace the least recently used block
        if (block0Memory[index] < block1Memory[index]) {
          block0Memory[index] = tag;
        } else {
          block1Memory[index] = tag;
        }
        replaced = true;
      } else if (block0Memory[index] === null) {
        // Miss, No Replace
        block0Memory[index] = tag;
      } else {
        // Miss, No Replace
        block1Memory[index] = tag;
      }
      const result: Record<string, string> = {};
      result.address = block;
      result[tagLabel] = tag.toString();
      result[indexLabel] = index.toString();
      result["tag of block 0"] = block0Memory[index] ?? "";
      result["tag of block 1"] = block1Memory[index] ?? "";
      result[offsetLabel] = offset.toString();
      result.hit = hit ? "hit" : "miss";
      result.replace = replaced ? "yes" : "no";
      newResults.push(result);
    } catch {
      const result: Record<string, string> = {};
      result.address = block;
      result[tagLabel] = "error";
      result[indexLabel] = "error";
      result[offsetLabel] = "error";
      result.hit = "error";
      result.replace = "error";
      newResults.push(result);
    }
  }
  return newResults;
};
