import { Card } from "@/components/ui/card";
import { ScenarioPresets } from "./ScenarioPresets";
import { ControlMainControls } from "./ControlMainControls";
import { ControlActions } from "./ControlActions";

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
  activeScenario,
  setActiveScenario,
}: ControlPanelProps) {
  return (
    <Card className="p-4 space-y-4">
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

      <ControlActions
        onSample={onSample}
        onReset={onReset}
        onExport={onExport}
      />
    </Card>
  );
}
