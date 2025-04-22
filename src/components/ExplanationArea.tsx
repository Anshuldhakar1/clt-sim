
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
        return "The normal distribution is symmetric and bell-shaped. The central limit theorem states that the distribution of sample means will approach a normal distribution as the sample size increases, regardless of the population's distribution.";
      case "uniform":
        return "The uniform distribution represents equal probability across all values. As sample size increases, the sampling distribution of the mean becomes more normal-shaped, demonstrating the central limit theorem.";
      case "skewed":
        return "This right-skewed distribution has a longer tail on the right side. Watch how the sampling distribution becomes more symmetric and normal-shaped as you increase the sample size, even though the original population is skewed.";
      case "bimodal":
        return "The bimodal distribution has two peaks. As you take samples and calculate means, the sampling distribution gradually becomes normal-shaped, illustrating that the central limit theorem applies even to multi-modal distributions.";
      default:
        return "Select a distribution type and explore how different sample sizes affect the sampling distribution of the mean.";
    }
  };

  // Get explanation about current sampling progress
  const getSamplingExplanation = () => {
    if (samplesGenerated === 0) {
      return "Click the Sample button to start generating samples and observe the sampling distribution of the mean.";
    } else if (samplesGenerated < numberOfSamples) {
      return `Generated ${samplesGenerated} of ${numberOfSamples} samples with size n=${sampleSize}. Continue sampling to see the full distribution form.`;
    } else {
      return `Completed ${samplesGenerated} samples with size n=${sampleSize}. The sampling distribution has formed. Try adjusting parameters and sampling again.`;
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{getDistributionExplanation()}</p>
          <p className="text-sm font-medium">{getSamplingExplanation()}</p>
        </div>
      </CardContent>
    </Card>
  );
}
