/**
 * complete a table of two-way associative cache
 * @param {Array<Record<string, string>>} inputs input data of the cache
 * @returns {Array<Record<string, string>>} results after completing the cache procedure
 */
export function completeTwoWayAssociateCache(
  inputs: Array<Record<string, string>>,
): Array<Record<string, string>> {
  const block0Memory: Array<number | null> = Array(256).fill(null);
  const block1Memory: Array<number | null> = Array(256).fill(null);
  const results: Array<Record<string, string>> = [];
  for (const row of inputs) {
    const tag = Number(row.tag);
    const index = Number(row.set);
    if (index > block0Memory.length - 1) {
      block0Memory.push(
        ...(Array(index - block0Memory.length).fill(null) as null[]),
      );
    }
    if (index > block1Memory.length - 1) {
      block1Memory.push(
        ...(Array(index - block1Memory.length).fill(null) as null[]),
      );
    }
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
      if ((block0Memory[index] ?? 0) < (block1Memory[index] ?? 0)) {
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

    const rowResult: Record<string, string> = {
      ...row,
      "tag-of-block-0": String(block0Memory[index]) ?? "",
      "tag-of-block-1": String(block1Memory[index]) ?? "",
      "hit/miss": hit ? "hit" : "miss",
      replace: replaced ? "yes" : "no",
    };
    results.push(rowResult);
  }

  return results;
}
