/**
 * complete a table of direct-mapped cache
 * @param {Array<Record<string, string>>} inputs input data of the cache
 * @returns {Array<Record<string, string>>} results after completing the cache procedure
 */
export function completeDirectMappedCache(
  inputs: Array<Record<string, string>>,
): Array<Record<string, string>> {
  const cacheMemory: Array<number | null> = Array(256).fill(null);
  const results: Array<Record<string, string>> = [];
  for (const row of inputs) {
    const index = Number(row.index);
    const tag = Number(row.tag);
    if (index > cacheMemory.length - 1) {
      cacheMemory.push(
        ...(Array(index - cacheMemory.length).fill(null) as null[]),
      );
    }
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

    const rowResult: Record<string, string> = {
      ...row,
      "hit/miss": hit ? "hit" : "miss",
      replace: replaced ? "yes" : "no",
    };
    results.push(rowResult);
  }
  return results;
}
