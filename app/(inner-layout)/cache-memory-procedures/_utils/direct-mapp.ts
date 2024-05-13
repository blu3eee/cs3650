import { evaluate } from "mathjs";

export const handleCalculateDirectMap = (
  addressBits: number,
  blocks: number,
  unusedBlocks: string[],
  offsetBits: number,
  indexBits: number,
): Array<Record<string, string>> => {
  const cacheMemory = Array(blocks).fill(null);
  const newResults: Array<Record<string, string>> = [];
  const tagLabel = `tag ${addressBits - indexBits - offsetBits}b`;
  const indexLabel = `index ${indexBits}b`;
  const offsetLabel = `offset ${offsetBits}b`;
  for (const block of unusedBlocks) {
    try {
      const address = evaluate(block);
      const tag = Math.floor(address / Math.pow(2, offsetBits + indexBits));
      const index = Math.floor(
        (address / Math.pow(2, offsetBits)) % Math.pow(2, indexBits),
      );
      const offset = Math.floor(address % Math.pow(2, offsetBits));

      const currentCacheEntry = cacheMemory[index];

      let hit = false;
      let replaced = false;
      if (currentCacheEntry === null) {
        // Miss, No Replace
        cacheMemory[index] = tag;
      } else if (currentCacheEntry === tag) {
        // Hit, No Replace
        hit = true;
      } else {
        // Miss, Replace
        cacheMemory[index] = tag;
        replaced = true;
      }
      const result: Record<string, string> = {};
      result.address = block;
      result[tagLabel] = tag.toString();
      result[indexLabel] = index.toString();
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
