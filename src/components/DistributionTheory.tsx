
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AreaChart, ChartPie, ScatterChart } from "lucide-react";

interface DistributionTheoryProps {
  distribution: string;
}

export function DistributionTheory({ distribution }: DistributionTheoryProps) {
  const getDistributionTheory = () => {
    switch (distribution) {
      case "normal":
        return {
          title: "Normal Distribution",
          icon: <AreaChart className="h-5 w-5" />,
          symbol: "X ~ N(μ, σ²)",
          description: "The normal distribution is a continuous probability distribution that is symmetric about the mean, showing that data near the mean are more frequent than data far from the mean.",
          properties: [
            "Symmetrical bell-shaped curve",
            "Described by mean (μ) and standard deviation (σ)",
            "About 68% of values lie within 1σ of the mean",
            "About 95% of values lie within 2σ of the mean",
            "About 99.7% of values lie within 3σ of the mean"
          ],
          formula: "f(x) = (1/σ√2π) × e^(-((x-μ)²/2σ²))"
        };
      case "uniform":
        return {
          title: "Uniform Distribution",
          icon: <ChartPie className="h-5 w-5" />,
          symbol: "X ~ U(a, b)",
          description: "The uniform distribution is a continuous probability distribution where all outcomes in the interval [a, b] are equally likely.",
          properties: [
            "Constant probability across the range",
            "Described by minimum (a) and maximum (b) values",
            "Mean: μ = (a+b)/2",
            "Variance: σ² = (b-a)²/12"
          ],
          formula: "f(x) = 1/(b-a) for a ≤ x ≤ b"
        };
      case "skewed":
        return {
          title: "Right-Skewed Distribution (Exponential)",
          icon: <ScatterChart className="h-5 w-5" />,
          symbol: "X ~ Exp(λ)",
          description: "The exponential distribution models the time between events in a Poisson process. It has a longer tail to the right, making it right-skewed.",
          properties: [
            "Memoryless property",
            "Highest probability density at x = 0",
            "Mean: μ = 1/λ",
            "Variance: σ² = 1/λ²",
            "Standard deviation: σ = 1/λ"
          ],
          formula: "f(x) = λe^(-λx) for x ≥ 0"
        };
      case "bimodal":
        return {
          title: "Bimodal Distribution",
          icon: <AreaChart className="h-5 w-5" />,
          symbol: "X ~ Mixture of N(μ₁, σ₁²) and N(μ₂, σ₂²)",
          description: "A bimodal distribution has two peaks, often resulting from a mixture of two different populations or processes.",
          properties: [
            "Two distinct peaks or modes",
            "Can be modeled as a mixture of two normal distributions",
            "Mean: depends on the component distributions and mixing proportions",
            "Variance: depends on component variances and the distance between means"
          ],
          formula: "f(x) = p₁ × f₁(x) + p₂ × f₂(x) where p₁ + p₂ = 1"
        };
      default:
        return {
          title: "Distribution Theory",
          icon: <AreaChart className="h-5 w-5" />,
          symbol: "",
          description: "Select a distribution to see its properties.",
          properties: [],
          formula: ""
        };
    }
  };

  const theory = getDistributionTheory();

  return (
    <Card className="w-full">
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            {theory.icon}
            <h3 className="font-medium text-lg">{theory.title}</h3>
            <span className="text-sm font-mono bg-muted px-2 py-0.5 rounded-lg">{theory.symbol}</span>
          </div>
          
          <p className="text-sm text-muted-foreground">{theory.description}</p>
          
          {theory.properties.length > 0 && (
            <div className="space-y-1">
              <h4 className="font-medium text-sm">Key Properties:</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                {theory.properties.map((property, index) => (
                  <li key={index}>{property}</li>
                ))}
              </ul>
            </div>
          )}
          
          {theory.formula && (
            <div className="pt-1">
              <h4 className="font-medium text-sm">Probability Density Function:</h4>
              <div className="text-sm font-mono bg-muted p-2 rounded mt-1 overflow-x-auto">
                {theory.formula}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
