import React from "react";
import TableOfResults from "./table-results";

interface Props {
  results: Array<Record<string, string>>;
}

const DirectMappedCache: React.FC<Props> = ({ results }) => {
  return (
    <div className="flex w-full flex-col gap-2">
      <TableOfResults title="Direct Mapping Results" results={results} />

      <div className="flex flex-col gap-1 text-sm font-medium text-foreground/80">
        <span className="text-base text-foreground">
          Procedure for Direct Mapping
        </span>
        <span>
          For the current row of the table with index N and tag T, if no
          previous row with the same index N, then it is Miss , No Replace , and
          the data block with tag T is stored in the block N of the cache memory
        </span>
        <span>
          For the current row of the table with index N and tag T, if the last
          previous row with the same index N has the same tag T, then it is Hit
          and No Replace , and no new data block is stored in the cache memory .
        </span>
        <span>
          For the current row of the table with index N and tag T, if the last
          previous row with the same index N has a different tag TT, then it is
          Miss and Yes Replace, and the data block with tag TT is stored in the
          block N of the cache memory .
        </span>
      </div>
    </div>
  );
};

export default DirectMappedCache;
