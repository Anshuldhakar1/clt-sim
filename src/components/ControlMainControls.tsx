import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ControlMainControlsProps {
  sampleSize: number;
  setSampleSize: (n: number) => void;
  numberOfSamples: number;
  setNumberOfSamples: (n: number) => void;
  distribution: string;
  setDistribution: (val: string) => void;
  setActiveScenario: (val: string | null) => void;
}

export function ControlMainControls({
  sampleSize,
  setSampleSize,
  numberOfSamples,
  setNumberOfSamples,
  distribution,
  setDistribution,
  setActiveScenario,
}: ControlMainControlsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label htmlFor="sample-size">Sample Size (n): {sampleSize}</Label>
        </div>
        <Slider
          id="sample-size"
          min={5}
          max={100}
          step={5}
          value={[sampleSize]}
          onValueChange={([value]) => {
            setSampleSize(value);
            setActiveScenario(null);
          }}
          className="touch-none"
        />
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label htmlFor="number-of-samples"># of Samples: {numberOfSamples}</Label>
        </div>
        <Slider
          id="number-of-samples"
          min={100}
          max={1000}
          step={100}
          value={[numberOfSamples]}
          onValueChange={([value]) => {
            setNumberOfSamples(value);
            setActiveScenario(null);
          }}
          className="touch-none"
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="distribution">Distribution Type</Label>
        <Select
          value={distribution}
          onValueChange={(value) => {
            setDistribution(value);
            setActiveScenario(null);
          }}
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Select a distribution" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="uniform">Uniform</SelectItem>
            <SelectItem value="skewed">Right-Skewed</SelectItem>
            <SelectItem value="bimodal">Bimodal</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
