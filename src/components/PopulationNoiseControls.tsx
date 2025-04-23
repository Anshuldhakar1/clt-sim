
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";

interface PopulationNoiseControlsProps {
  onNoiseChange: (level: number) => void;
  onOutlierChange: (level: number) => void;
}

export function PopulationNoiseControls({ 
  onNoiseChange, 
  onOutlierChange 
}: PopulationNoiseControlsProps) {
  const [noiseEnabled, setNoiseEnabled] = useState(false);
  const [noiseLevel, setNoiseLevel] = useState(0.2);
  const [outliersEnabled, setOutliersEnabled] = useState(false);
  const [outlierLevel, setOutlierLevel] = useState(0.3);

  // Effect to update the noise level when the switch is toggled
  useEffect(() => {
    onNoiseChange(noiseEnabled ? noiseLevel : 0);
  }, [noiseEnabled, noiseLevel, onNoiseChange]);

  // Effect to update the outlier level when the switch is toggled
  useEffect(() => {
    onOutlierChange(outliersEnabled ? outlierLevel : 0);
  }, [outliersEnabled, outlierLevel, onOutlierChange]);

  const handleNoiseChange = (value: number[]) => {
    setNoiseLevel(value[0]);
    if (noiseEnabled) {
      onNoiseChange(value[0]);
    }
  };

  const handleOutlierChange = (value: number[]) => {
    setOutlierLevel(value[0]);
    if (outliersEnabled) {
      onOutlierChange(value[0]);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-4 space-y-6">
        <div className="space-y-1">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-lg">Population Noise & Outliers</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Add random noise or outliers to the population to simulate real-world data imperfections.
          </p>
        </div>

        <div className="space-y-5">
          {/* Noise Controls */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <Label htmlFor="noise-switch" className="mb-1">Random Noise</Label>
                <span className="text-xs text-muted-foreground">
                  Add random variation to data points
                </span>
              </div>
              <Switch 
                id="noise-switch"
                checked={noiseEnabled}
                onCheckedChange={setNoiseEnabled}
              />
            </div>
            
            <div className="pt-1">
              <div className="flex justify-between items-center mb-1">
                <Label htmlFor="noise-level" className="text-sm">
                  Noise Level: {(noiseLevel * 100).toFixed(0)}%
                </Label>
              </div>
              <Slider
                id="noise-level"
                min={0}
                max={1}
                step={0.05}
                value={[noiseLevel]}
                onValueChange={handleNoiseChange}
                disabled={!noiseEnabled}
                className="touch-none"
              />
            </div>
          </div>

          {/* Outlier Controls */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <Label htmlFor="outlier-switch" className="mb-1">Outliers</Label>
                <span className="text-xs text-muted-foreground">
                  Add extreme values to the population
                </span>
              </div>
              <Switch 
                id="outlier-switch"
                checked={outliersEnabled}
                onCheckedChange={setOutliersEnabled}
              />
            </div>
            
            <div className="pt-1">
              <div className="flex justify-between items-center mb-1">
                <Label htmlFor="outlier-level" className="text-sm">
                  Outlier Intensity: {(outlierLevel * 100).toFixed(0)}%
                </Label>
              </div>
              <Slider
                id="outlier-level"
                min={0}
                max={1}
                step={0.05}
                value={[outlierLevel]}
                onValueChange={handleOutlierChange}
                disabled={!outliersEnabled}
                className="touch-none"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
