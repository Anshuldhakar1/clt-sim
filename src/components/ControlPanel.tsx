
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
import { Download, Share } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const PRESETS = {
  smallSamples: { 
    sampleSize: 5, 
    numberOfSamples: 1000, 
    distribution: "normal",
    description: "Small samples to show high variability"
  },
  basicNormal: { 
    sampleSize: 30, 
    numberOfSamples: 500, 
    distribution: "normal",
    description: "Basic demonstration of CLT with normal distribution"
  },
  largeUniform: { 
    sampleSize: 50, 
    numberOfSamples: 300, 
    distribution: "uniform",
    description: "Large samples from uniform to show CLT in action"
  },
  extremeSkewed: { 
    sampleSize: 40, 
    numberOfSamples: 800, 
    distribution: "skewed",
    description: "Skewed distribution to demonstrate CLT's power"
  },
  complexBimodal: { 
    sampleSize: 100, 
    numberOfSamples: 400, 
    distribution: "bimodal",
    description: "Large samples from bimodal to show normality"
  }
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
  onShare: () => void;
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
  onShare,
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {Object.entries(PRESETS).map(([key, preset]) => (
            <Button 
              key={key}
              onClick={() => handlePresetChange(key as keyof typeof PRESETS)}
              variant={activeScenario === key ? "default" : "outline"}
              className="h-auto py-2 text-xs sm:text-sm flex flex-col items-start"
            >
              <span className="font-semibold">{preset.description.split(' to ')[0]}</span>
              <span className="text-xs opacity-80 mt-1">n={preset.sampleSize}, {preset.distribution}</span>
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
            className="touch-none" // Improve touch experience
          />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label htmlFor="number-of-samples">Number of Samples: {numberOfSamples}</Label>
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
            className="touch-none" // Improve touch experience
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
            <SelectTrigger className="h-11"> {/* Increased touch target size */}
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

      <div className="grid grid-cols-1 gap-4">
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={onSample}
            className="flex-1 h-11 min-w-[120px]" // Larger touch target
          >
            Start Sampling
          </Button>
          
          <Button
            onClick={onReset}
            variant="secondary"
            className="flex-1 h-11 min-w-[120px]" // Larger touch target
          >
            Reset
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2 justify-between">
          <div className="flex-1">
            <Label className="mb-2 block">Theoretical Normal Curve</Label>
            <ToggleGroup 
              type="single" 
              variant="outline"
              value={showNormalCurve ? "show" : "hide"}
              onValueChange={(value) => setShowNormalCurve(value === "show")}
              className="justify-start"
            >
              <ToggleGroupItem value="show" className="flex-1">Show</ToggleGroupItem>
              <ToggleGroupItem value="hide" className="flex-1">Hide</ToggleGroupItem>
            </ToggleGroup>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-auto">
            <Button
              onClick={onExport}
              variant="outline"
              className="h-11" // Larger touch target
            >
              <Download className="mr-2" />
              Export PNG
            </Button>
            
            <Button
              onClick={onShare}
              variant="outline"
              className="h-11" // Larger touch target
            >
              <Share className="mr-2" />
              Share URL
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
