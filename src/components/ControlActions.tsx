
import { Button } from "@/components/ui/button";

interface ControlActionsProps {
  onSample: () => void;
  onReset: () => void;
}

export function ControlActions({ onSample, onReset }: ControlActionsProps) {
  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="flex flex-wrap gap-2 w-full">
        <Button
          onClick={onSample}
          size="sm"
          className="min-w-[70px] px-2 py-1 text-xs"
        >
          Start Sampling
        </Button>
        <Button
          onClick={onReset}
          variant="secondary"
          size="sm"
          className="min-w-[70px] px-2 py-1 text-xs"
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
