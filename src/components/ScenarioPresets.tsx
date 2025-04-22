
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const PRESETS = {
  smallSamples: { sampleSize: 5, numberOfSamples: 1000, distribution: "normal", description: "Small samples: more variability" },
  basicNormal: { sampleSize: 30, numberOfSamples: 500, distribution: "normal", description: "Classic Normal: CLT at work" },
  largeUniform: { sampleSize: 50, numberOfSamples: 300, distribution: "uniform", description: "Large samples: Uniform source" },
  extremeSkewed: { sampleSize: 40, numberOfSamples: 800, distribution: "skewed", description: "Right-skewed: watch CLT normality appear" },
  complexBimodal: { sampleSize: 100, numberOfSamples: 400, distribution: "bimodal", description: "Bimodal mix: normality emerges" },
  laplaceFocus: { sampleSize: 35, numberOfSamples: 800, distribution: "laplace", description: "Laplace: pointed at mean, heavy tails" },
  studentTn: { sampleSize: 15, numberOfSamples: 1000, distribution: "student-t", description: "Student's t: fat tails vs normal" },
  manySamplesSmall: { sampleSize: 10, numberOfSamples: 1000, distribution: "uniform", description: "Small n, many samples: see spread" },
  largeLaplace: { sampleSize: 80, numberOfSamples: 900, distribution: "laplace", description: "Large n Laplace: heavier tails, CLT shines" },
  bigStudentT: { sampleSize: 40, numberOfSamples: 1000, distribution: "student-t", description: "Big n Student's t: compare tails to normal" },
  midsizedUniform: { sampleSize: 25, numberOfSamples: 700, distribution: "uniform", description: "Mid-size uniform: watch symmetry grow" },
  mediumBimodal: { sampleSize: 50, numberOfSamples: 800, distribution: "bimodal", description: "Bimodal, mid n: mixture smooths out" },
};

interface ScenarioPresetsProps {
  activeScenario: string | null;
  setActiveScenario: (val: string | null) => void;
  setSampleSize: (v: number) => void;
  setNumberOfSamples: (v: number) => void;
  setDistribution: (v: string) => void;
}

export function ScenarioPresets({ activeScenario, setActiveScenario, setSampleSize, setNumberOfSamples, setDistribution }: ScenarioPresetsProps) {
  const handlePresetChange = (preset: keyof typeof PRESETS) => {
    const config = PRESETS[preset];
    setSampleSize(config.sampleSize);
    setNumberOfSamples(config.numberOfSamples);
    setDistribution(config.distribution);
    setActiveScenario(preset);
  };

  return (
    <div>
      <Label className="mb-2 block">What If? Scenarios</Label>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {Object.entries(PRESETS).map(([key, preset]) => (
          <Button
            key={key}
            onClick={() => handlePresetChange(key as keyof typeof PRESETS)}
            variant={activeScenario === key ? "default" : "outline"}
            className="h-auto text-xs sm:text-[13px] px-2 py-2 flex flex-col items-start whitespace-normal min-h-[56px] leading-snug break-words"
            style={{ overflowWrap: "anywhere", wordBreak: "break-word", whiteSpace: "normal", minHeight: 56 }}
            size="sm"
          >
            <span className="font-semibold block" style={{ lineHeight: 1.12 }}>{preset.description}</span>
            <span className="text-xs opacity-80 mt-0.5 block">n={preset.sampleSize}, {preset.distribution}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
