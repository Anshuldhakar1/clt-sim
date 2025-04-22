
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";

const PRESETS = {
  smallSamples: { 
    sampleSize: 5, 
    numberOfSamples: 1000, 
    distribution: "normal",
    description: "Small samples: more variability"
  },
  basicNormal: { 
    sampleSize: 30, 
    numberOfSamples: 500, 
    distribution: "normal",
    description: "Classic Normal: CLT at work"
  },
  largeUniform: { 
    sampleSize: 50, 
    numberOfSamples: 300, 
    distribution: "uniform",
    description: "Large samples: Uniform source"
  },
  extremeSkewed: { 
    sampleSize: 40, 
    numberOfSamples: 800, 
    distribution: "skewed",
    description: "Right-skewed: watch CLT normality appear"
  },
  complexBimodal: { 
    sampleSize: 100, 
    numberOfSamples: 400, 
    distribution: "bimodal",
    description: "Bimodal mix: normality emerges"
  },
  laplaceFocus: {
    sampleSize: 35,
    numberOfSamples: 800,
    distribution: "laplace",
    description: "Laplace: pointed at mean, heavy tails"
  },
  studentTn: {
    sampleSize: 15,
    numberOfSamples: 1000,
    distribution: "student-t",
    description: "Student's t: fat tails vs normal"
  },
  manySamplesSmall: {
    sampleSize: 10,
    numberOfSamples: 1000,
    distribution: "uniform",
    description: "Small n, many samples: see spread"
  },
};

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
  showNormalCurve,
  setShowNormalCurve,
  activeScenario,
  setActiveScenario
}: ControlPanelProps) {
  const handlePresetChange = (preset: keyof typeof PRESETS) => {
    const config = PRESETS[preset];
    setSampleSize(config.sampleSize);
    setNumberOfSamples(config.numberOfSamples);
    setDistribution(config.distribution);
    setActiveScenario(preset);
  };

  return (
    <Card className="p-4 space-y-4">
      {/* "What If?" Scenario Buttons - More prominent and touch-friendly */}
      <div>
        <Label className="mb-2 block">What If? Scenarios</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {Object.entries(PRESETS).map(([key, preset]) => (
            <Button 
              key={key}
              onClick={() => handlePresetChange(key as keyof typeof PRESETS)}
              variant={activeScenario === key ? "default" : "outline"}
              className="h-auto p-2 text-xs sm:text-sm flex flex-col items-start whitespace-normal min-h-[60px]"
              style={{
                overflowWrap: "anywhere",
                wordBreak: "break-word",
                whiteSpace: "normal",
                minHeight: 60,
              }}
            >
              <span className="font-semibold block" style={{ lineHeight: 1.15 }}>{preset.description}</span>
              <span className="text-xs opacity-80 mt-1 block">n={preset.sampleSize}, {preset.distribution}</span>
            </Button>
          ))}
        </div>
      </div>

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
              setActiveScenario(null); // Reset active scenario when user manually changes value
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
              setActiveScenario(null); // Reset active scenario when user manually changes value
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
              setActiveScenario(null); // Reset active scenario when user manually changes value
            }}
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Select a distribution" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="uniform">Uniform</SelectItem>
              <SelectItem value="skewed">Right-Skewed</SelectItem>
              <SelectItem value="bimodal">Bimodal</SelectItem>
              <SelectItem value="laplace">Laplace</SelectItem>
              <SelectItem value="student-t">Student’s t</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={onSample}
            className="flex-1 h-11 min-w-[120px]"
          >
            Start Sampling
          </Button>
          
          <Button
            onClick={onReset}
            variant="secondary"
            className="flex-1 h-11 min-w-[120px]"
          >
            Reset
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div className="flex items-center">
            <Toggle
              pressed={showNormalCurve}
              onPressedChange={setShowNormalCurve}
              className="mr-2"
              aria-label="Toggle Normal Curve"
            />
            <Label className="mb-0">Show Theoretical Normal Curve</Label>
          </div>
          <div className="flex flex-wrap gap-2 mt-auto">
            <Button
              onClick={onExport}
              variant="outline"
              className="h-11"
            >
              <Download className="mr-2" />
              Export PNG
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
