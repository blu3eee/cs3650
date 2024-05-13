import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
interface Props {
  title: string;
  results: Array<Record<string, string>>;
}
const TableOfResults: React.FC<Props> = ({ title, results }) => {
  return (
    <Table>
      <TableCaption className="captitalize">{title}</TableCaption>
      <TableHeader>
        <TableRow>
          {results.length > 0 &&
            Object.keys(results[0]).map((value, index) => (
              <TableHead key={index} className="capitalize">
                {value}
              </TableHead>
            ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {results.length > 0 &&
          results.map((item, index) => (
            <TableRow key={index}>
              {Object.values(item).map((value, index) => (
                <TableCell
                  key={index}
                  className={cn(
                    "font-medium capitalize",
                    (value === "hit" || value === "yes") &&
                      "font-bold text-success",
                  )}
                >
                  {value}
                </TableCell>
              ))}
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default TableOfResults;
