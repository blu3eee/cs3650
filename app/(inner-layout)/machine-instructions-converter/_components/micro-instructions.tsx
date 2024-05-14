import React from "react";
import type { ConvertedInstruction } from "../_utils/convert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const MicroInstruction: React.FC<ConvertedInstruction> = ({
  instruction,
  address,
  content,
  parsedInstruction,
}) => {
  return (
    <div className="flex flex-col gap-3 text-start">
      <div className="text-lg font-semibold">{instruction}</div>
      <div className="grid grid-cols-3 font-medium">
        <div className="col-span-1">PC</div>
        <div className="col-span-2">{address}</div>
        <div className="col-span-1">MAR</div>
        <div className="col-span-2 flex items-center gap-1">
          {"<-"}
          <span>PC</span>
        </div>
        <div className="col-span-1">MDR</div>
        <div className="col-span-2 flex items-center gap-1">
          {"<-"}
          <span>M[MAR]</span>
        </div>
        <div className="col-span-1">IR</div>
        <div className="col-span-2 flex items-center gap-1">
          {"<-"}
          <span>MDR</span>
        </div>
        <div className="col-span-1">PC</div>
        <div className="col-span-2 flex items-center gap-1">
          {"<-"}
          <span>PC+1</span>
        </div>

        <div className="col-span-1">IR</div>
        <div className="col-span-2 flex items-center gap-1">{content}</div>

        <div className="col-span-1">Decoder</div>
        <div className="col-span-2 flex items-center gap-1">
          {"<-"}
          <span>IR[7-5]</span>
        </div>
        {parsedInstruction?.type === "branch neg" ? (
          <>
            <div className="col-span-1">{"If (Accum < 0)"}</div>
            <div className="col-span-2 flex items-center gap-1"> </div>
            <div className="col-span-1"> </div>
            <div className="col-span-2 flex items-center gap-1">
              PC
              {"<-"}
              <span>IR[4-0]</span>
            </div>
            <div className="col-span-1">Else</div>
            <div className="col-span-2 flex items-center gap-1"> </div>
            <div className="col-span-1"> </div>
            <div className="col-span-2 flex items-center gap-1">
              No Operation
            </div>
          </>
        ) : parsedInstruction?.type === "load" ||
          parsedInstruction?.type === "add" ||
          parsedInstruction?.type === "mult" ? (
          <>
            <div className="col-span-1">MAR</div>
            <div className="col-span-2 flex items-center gap-1">
              {"<-"}
              <span>IR[4-0]</span>
            </div>
            <div className="col-span-1">MDR</div>
            <div className="col-span-2 flex items-center gap-1">
              {"<-"}
              <span>M[MAR]</span>
            </div>
            <div className="col-span-1">Accum</div>
            <div className="col-span-2 flex items-center gap-1">
              {"<-"}
              <span>
                MDR{parsedInstruction?.type === "add" && " + Accum"}
                {parsedInstruction?.type === "mult" && " * Accum"}
              </span>
            </div>
          </>
        ) : parsedInstruction?.type === "store" ? (
          <>
            <div className="col-span-1">MAR</div>
            <div className="col-span-2 flex items-center gap-1">
              {"<-"}
              <span>IR[4-0]</span>
            </div>
            <div className="col-span-1">MDR</div>
            <div className="col-span-2 flex items-center gap-1">
              {"<-"}
              <span>Accum</span>
            </div>
            <div className="col-span-1">M[MAR]</div>
            <div className="col-span-2 flex items-center gap-1">
              {"<-"}
              <span>MDR</span>
            </div>
          </>
        ) : (
          <>
            <div className="col-span-1">MAR</div>
            <div className="col-span-2 flex items-center gap-1">
              {"<-"}
              <span>IR[4-0]</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const MicroInstructionDialog: React.FC<ConvertedInstruction> = (
  machineInstruction,
) => {
  return (
    <Dialog>
      <DialogTrigger>
        <div className={cn(buttonVariants({ variant: "info", size: "sm" }))}>
          {machineInstruction.instruction}
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Micro instruction</DialogTitle>
          <DialogDescription>
            <MicroInstruction {...machineInstruction} />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default MicroInstructionDialog;
