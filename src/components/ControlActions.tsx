
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ControlActionsProps {
  onSample: () => void;
  onReset: () => void;
  onExport: () => void;
}

export function ControlActions({ onSample, onReset, onExport }: ControlActionsProps) {
  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="flex flex-wrap gap-2 w-full">
        <Button
          onClick={onSample}
          size="sm"
          className="min-w-[90px] px-2 py-1"
        >
          Start Sampling
        </Button>
        <Button
          onClick={onReset}
          variant="secondary"
          size="sm"
          className="min-w-[90px] px-2 py-1"
        >
          Reset
        </Button>
      </div>
      <div className="flex flex-wrap gap-4 justify-end items-center w-full">
        <Button
          onClick={onExport}
          variant="outline"
          size="sm"
          className="h-8"
        >
          <Download className="mr-1 h-4 w-4" />
          Export PNG
        </Button>
      </div>
    </div>
  );
}
