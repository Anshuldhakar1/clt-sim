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
}

export function ControlPanel({
  sampleSize,
  setSampleSize,
  numberOfSamples,
  setNumberOfSamples,
  distribution,
  setDistribution,
  onSample,
  onReset
}: ControlPanelProps) {
  const handlePresetChange = (preset: keyof typeof PRESETS) => {
    const config = PRESETS[preset];
    setSampleSize(config.sampleSize);
    setNumberOfSamples(config.numberOfSamples);
    setDistribution(config.distribution);
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-3">
          <Label htmlFor="preset">Learning Presets</Label>
          <Select onValueChange={handlePresetChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a learning scenario" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="smallSamples">Small Samples (n=5)</SelectItem>
              <SelectItem value="basicNormal">Basic Normal (n=30)</SelectItem>
              <SelectItem value="largeUniform">Large Uniform (n=50)</SelectItem>
              <SelectItem value="extremeSkewed">Extreme Skewed (n=40)</SelectItem>
              <SelectItem value="complexBimodal">Complex Bimodal (n=100)</SelectItem>
            </SelectContent>
          </Select>
        </div>

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
            onValueChange={([value]) => setSampleSize(value)} 
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
            onValueChange={([value]) => setNumberOfSamples(value)} 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-3">
          <Label htmlFor="distribution">Distribution Type</Label>
          <Select value={distribution} onValueChange={setDistribution}>
            <SelectTrigger>
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

        <div className="md:col-span-2 flex items-end space-x-2">
          <Button
            onClick={onSample}
            className="w-full"
          >
            Start Sampling
          </Button>
          <Button
            onClick={onReset}
            variant="secondary"
            className="w-full"
          >
            Reset
          </Button>
        </div>
      </div>
    </Card>
  );
}
