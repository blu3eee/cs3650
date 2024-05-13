import { evaluate } from "mathjs";

export const handleCalculateFullyAssociative = (
  addressBits: number,
  blocks: number,
  unusedBlocks: string[],
  offsetBits: number,
  indexBits: number,
): Array<Record<string, string>> => {
  const cacheMemory: Array<number | null> = Array(blocks).fill(null);
  const newResults: Array<Record<string, string>> = [];
  const tagLabel = `tag ${addressBits - offsetBits}b`;

  const offsetLabel = `offset ${offsetBits}b`;
  for (const block of unusedBlocks) {
    try {
      const address = evaluate(block);
      const tag = Math.floor(address / Math.pow(2, offsetBits));

      const offset = Math.floor(address % Math.pow(2, offsetBits));

      let hit = false;
      let replaced = false;
      // Check if the tag is already present in the cache memory
      const cacheIndex = cacheMemory.indexOf(tag);

      if (cacheIndex === -1) {
        // Miss, No Replace if there are unused blocks
        const unusedIndex = cacheMemory.indexOf(null);
        if (unusedIndex !== -1) {
          cacheMemory[unusedIndex] = tag;
        } else {
          // Miss, Replace if all blocks are used
          cacheMemory[0] = tag; // Replace the first block (least recently used)
          replaced = true;
        }
      } else {
        // Hit, No Replace
        hit = true;
      }

      const result: Record<string, string> = {};
      result.address = block;
      result[tagLabel] = tag.toString();
      result["cache block"] = String(
        cacheMemory.findIndex((x) => x === tag) ?? 0,
      );
      result[offsetLabel] = offset.toString();
      result.hit = hit ? "hit" : "miss";
      result.replace = replaced ? "yes" : "no";
      newResults.push(result);
    } catch {
      const result: Record<string, string> = {};
      result.address = block;
      result[tagLabel] = "error";
      result[offsetLabel] = "error";
      result.hit = "error";
      result.replace = "error";
      newResults.push(result);
    }
  }
  return newResults;
};
