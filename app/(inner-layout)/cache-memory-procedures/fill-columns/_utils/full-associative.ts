/**
 * complete a table of full associate cache
 * @param {Array<Record<string, string>>} inputs input data of the cache
 * @returns {Array<Record<string, string>>} results after completing the cache procedure
 */
export function completeFullAssociativeCache(
  inputs: Array<Record<string, string>>,
): Array<Record<string, string>> {
  const cacheMemory: Array<number | null> = Array(256).fill(null);
  const results: Array<Record<string, string>> = [];
  for (const row of inputs) {
    const tag = Number(row.tag);

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

    const rowResult: Record<string, string> = {
      ...row,
      "cache-block-used": String(cacheMemory.findIndex((x) => x === tag) ?? 0),
      "hit/miss": hit ? "hit" : "miss",
      replace: replaced ? "yes" : "no",
    };
    results.push(rowResult);
  }

  return results;
}
