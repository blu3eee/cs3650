import React from "react";
import TableOfResults from "./table-results";
interface Props {
  results: Array<Record<string, string>>;
}

const FourWayAssociativeResults: React.FC<Props> = ({ results }) => {
  return (
    <div className="flex w-full flex-col gap-2">
      <TableOfResults title="Two Way Associative Cache" results={results} />

      <div className="flex flex-col gap-1 text-sm font-medium text-foreground/80">
        <span className="text-base text-foreground">
          Procedure for 4-Set Associative
        </span>
        <span>
          For the current row of the table with set N and tag T, if no previous
          row with the same set N, then it is Miss , No Replace , and the data
          block with tag T is stored in the Block 0 of the set N of the cache
          memory .
        </span>
        <span>
          For the current row of the table with set N and tag T, if the last
          previous row with the same set has the same tag in the Block 0 or
          Block 1, then Yes Hit and no replace.
        </span>
        <span>
          For the current row of the table with set N and tag T, if the last
          previous row with the same set N has a different tag in both Block 0
          and Block 1, then it is Miss , Yes Replace, and the data block with
          tag T replaces the data block in Block 0 or Block 1 of the set N.
          Usually replaces the oldest block.
        </span>
        <span>
          For the current row of the table with set N and tag T, if the last
          previous row with the same set N has a different tag in Block 0 (Block
          1)and the Block 1 (Block 0) is unused , then it is Miss , No Replace,
          and the data block with tag T is stored in the Block 1( Block 0) of
          the set N.
        </span>
      </div>
    </div>
  );
};

export default FourWayAssociativeResults;
