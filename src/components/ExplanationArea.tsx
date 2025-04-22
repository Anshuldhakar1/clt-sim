
import { Card, CardContent } from "@/components/ui/card";

interface ExplanationAreaProps {
  distribution: string;
  sampleSize: number;
  numberOfSamples: number;
  samplesGenerated: number;
}

export function ExplanationArea({
  distribution,
  sampleSize,
  numberOfSamples,
  samplesGenerated
}: ExplanationAreaProps) {
  // Get the appropriate explanation based on the current distribution
  const getDistributionExplanation = () => {
    switch (distribution) {
      case "normal":
        return "The normal distribution is symmetric and bell-shaped. When sampling from a normal population, the sampling distribution of the mean will also be normal for any sample size, with a smaller standard deviation as sample size increases.";
      case "uniform":
        return "The uniform distribution has equal probability across all values. As we take samples and calculate their means, the Central Limit Theorem shows us that these sample means will follow a normal distribution, even though the original population is uniform.";
      case "skewed":
        return "This right-skewed distribution has a longer tail on the right side. The Central Limit Theorem demonstrates that even with this asymmetric population, the sampling distribution of means becomes increasingly normal as we take more samples, especially with larger sample sizes.";
      case "bimodal":
        return "The bimodal distribution has two distinct peaks. Watch how the sampling distribution transforms into a normal shape as we collect sample means, showing that the Central Limit Theorem applies regardless of the population's shape.";
      default:
        return "Select a distribution type and observe how the sampling distribution evolves.";
    }
  };

  const getControlsExplanation = () => {
    return `
      Sample Size (n=${sampleSize}): Larger samples give more stable estimates of the population mean.
      Number of Samples (N=${numberOfSamples}): More samples help us better see the shape of the sampling distribution.
      Current Progress: ${samplesGenerated} of ${numberOfSamples} samples collected.
    `;
  };

  const getTheoryExplanation = () => {
    if (samplesGenerated === 0) {
      return "Click 'Start Sampling' to begin the simulation and observe the Central Limit Theorem in action.";
    }
    if (samplesGenerated < numberOfSamples) {
      return "Watch as the sampling distribution takes shape. The Central Limit Theorem states that regardless of the population's distribution, the sampling distribution of the mean will approach a normal distribution as we take more samples.";
    }
    return `Sampling complete! Notice how the sampling distribution has ${sampleSize >= 30 ? "approximately normal shape" : "begun to take shape"}. This demonstrates the Central Limit Theorem, where sample means tend to follow a normal distribution as sample size increases.`;
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">Population Distribution</h3>
            <p className="text-sm text-muted-foreground">{getDistributionExplanation()}</p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Controls</h3>
            <p className="text-sm text-muted-foreground">{getControlsExplanation()}</p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">The Central Limit Theorem</h3>
            <p className="text-sm text-muted-foreground">{getTheoryExplanation()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
