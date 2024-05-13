import React from "react";
import TableOfResults from "./table-results";

interface Props {
  results: Array<Record<string, string>>;
}

const FullyAssociativeResults: React.FC<Props> = ({ results }) => {
  return (
    <div className="flex w-full flex-col gap-2">
      <TableOfResults title="Fully Associative Results" results={results} />

      <div className="flex flex-col gap-1 text-sm font-medium text-foreground/80">
        <span className="text-base text-foreground">
          Procedure for Full Associative
        </span>
        <span>
          For the current row with the tag T, if no previous row with same tag
          T, then it is Miss , and the data block with the tag T is stored in an
          used block of cache memory., and No Replace. If all blocks of cache
          memory are used , then select one of the cache blocks to store the
          data block with the tag T, for this case Yes Replace.
        </span>
        <span>
          For the current row with the tag T, if last previous row with same tag
          T is in a block has not been used by another tag, then it is Hit, No
          replace.
        </span>
      </div>
    </div>
  );
};

export default FullyAssociativeResults;
