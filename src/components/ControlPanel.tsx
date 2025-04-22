
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { ScenarioPresets } from "./ScenarioPresets";
import { ControlMainControls } from "./ControlMainControls";

interface ControlPanelProps {
  sampleSize: number;
  setSampleSize: (value: number) => void;
  numberOfSamples: number;
  setNumberOfSamples: (value: number) => void;
  distribution: string;
  setDistribution: (value: string) => void;
  onSample: () => void;
  onReset: () => void;
  onExport: () => void;
  showNormalCurve: boolean;
  setShowNormalCurve: (value: boolean) => void;
  activeScenario: string | null;
  setActiveScenario: (value: string | null) => void;
}

export function ControlPanel({
  sampleSize,
  setSampleSize,
  numberOfSamples,
  setNumberOfSamples,
  distribution,
  setDistribution,
  onSample,
  onReset,
  onExport,
  showNormalCurve, // This is now controlled from the SamplingChart directly
  setShowNormalCurve,
  activeScenario,
  setActiveScenario,
}: ControlPanelProps) {
  return (
    <Card className="p-4 space-y-4">
      {/* Scenario Presets */}
      <ScenarioPresets
        activeScenario={activeScenario}
        setActiveScenario={setActiveScenario}
        setSampleSize={setSampleSize}
        setNumberOfSamples={setNumberOfSamples}
        setDistribution={setDistribution}
      />

      <ControlMainControls
        sampleSize={sampleSize}
        setSampleSize={setSampleSize}
        numberOfSamples={numberOfSamples}
        setNumberOfSamples={setNumberOfSamples}
        distribution={distribution}
        setDistribution={setDistribution}
        setActiveScenario={setActiveScenario}
      />

      <div className="grid grid-cols-1 gap-4">
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={onSample}
            size="sm"
            className="flex-1 min-w-[100px]"
          >
            Start Sampling
          </Button>
          <Button
            onClick={onReset}
            variant="secondary"
            size="sm"
            className="flex-1 min-w-[100px]"
          >
            Reset
          </Button>
        </div>
        <div className="flex flex-wrap gap-4 justify-end items-center">
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
    </Card>
  );
}
