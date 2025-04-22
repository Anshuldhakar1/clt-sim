
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
  return (
    <Card className="p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            min={1} 
            max={500} 
            step={10} 
            value={[numberOfSamples]} 
            onValueChange={([value]) => setNumberOfSamples(value)} 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        <div className="flex items-end space-x-2">
          <Button
            onClick={onSample}
            className="w-full"
          >
            Sample
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
