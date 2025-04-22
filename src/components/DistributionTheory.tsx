
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AreaChart, ChartPie, ScatterChart } from "lucide-react";
import { Formula } from "./Formula";

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
          description: "The normal distribution is symmetric about the mean, showing that data near the mean are more frequent than data far from the mean.",
          properties: [
            "Mean (μ): 50",
            "Standard Deviation (σ): 15",
            "Variance (σ²): 225"
          ],
          formula: {
            main: `f(x) = (1/(σ√2π)) · e^{-((x-μ)^2)/(2σ^2)}`,
            sampling: `X̄ ~ N(μ, σ²/n)`
          }
        };
      case "uniform":
        return {
          title: "Uniform Distribution",
          icon: <ChartPie className="h-5 w-5" />,
          symbol: "X ~ U(a, b)",
          description: "The uniform distribution has equal probability across all values in the interval [a, b].",
          properties: [
            "Mean (μ) = (a + b)/2 = 50",
            "Variance (σ²) = (b - a)²/12 ≈ 533",
            "Standard Deviation (σ) = (b - a)/√12 ≈ 23.1"
          ],
          formula: {
            main: `f(x) = 1/(b-a), for x ∈ [a, b]`,
            sampling: `X̄ ~ N(μ, σ²/n) as n → ∞`
          }
        };
      case "skewed":
        return {
          title: "Right-Skewed Distribution (Exponential)",
          icon: <ScatterChart className="h-5 w-5" />,
          symbol: "X ~ Exp(λ)",
          description: "The exponential distribution models the time between events, with a long tail to the right.",
          properties: [
            "Rate Parameter (λ) = 0.5",
            "Mean (μ) = 1/λ × 20 + 10",
            "Variance (σ²) = 1/λ² × 400"
          ],
          formula: {
            main: `f(x) = λ · e^{-λx}, for x ≥ 0`,
            sampling: `X̄ ~ N(μ, σ²/n) as n → ∞`
          }
        };
      case "bimodal":
        return {
          title: "Bimodal Distribution",
          icon: <AreaChart className="h-5 w-5" />,
          symbol: "X ~ 0.5N(30,10²) + 0.5N(70,10²)",
          description: "A mixture of two normal distributions, resulting in two distinct peaks.",
          properties: [
            "Mean (μ) = 50",
            "Variance (σ²) = 400",
            "Standard Deviation (σ) = 20"
          ],
          formula: {
            main: `f(x) = 0.5ϕ((x-30)/10) + 0.5ϕ((x-70)/10)`,
            sampling: `X̄ ~ N(μ, σ²/n) as n → ∞`
          }
        };
      case "laplace":
        return {
          title: "Laplace Distribution (Double Exponential)",
          icon: <AreaChart className="h-5 w-5" />,
          symbol: "X ~ Laplace(μ, b)",
          description: "The Laplace distribution is peaked at its mean and has heavy tails, often used to model data with more outliers.",
          properties: [
            "Mean (μ) = 50",
            "Scale (b) = 10",
            "Variance (σ²) = 2b² = 200",
            "Standard Deviation (σ) = √2b ≈ 14.14"
          ],
          formula: {
            main: `f(x) = (1/(2b)) · e^{-|x-μ|/b}`,
            sampling: `X̄ ~ N(μ, 2b^2/n) as n → ∞`
          }
        };
      case "student-t":
        return {
          title: "Student's t Distribution",
          icon: <ScatterChart className="h-5 w-5" />,
          symbol: `X ~ t_ν`,
          description: "The Student's t distribution resembles the normal but with heavier tails, especially with small degrees of freedom. Used when population variance is unknown.",
          properties: [
            "Degrees of Freedom (ν) = 5",
            "Mean (μ) = 50 (here, centered)",
            "Scale (s) = 10",
            "Variance (ν>2): (ν/(ν-2))·s²",
          ],
          formula: {
            main: `f(x) = Γ((ν+1)/2) / [√(νπ) · Γ(ν/2)] · [1 + (x-μ)²/(νs²)]^{-(ν+1)/2}`,
            sampling: `X̄ ~ N(μ, s²/n) as n → ∞`
          }
        };
      default:
        return {
          title: "Distribution Theory",
          icon: <AreaChart className="h-5 w-5" />,
          symbol: "",
          description: "Select a distribution to see its properties.",
          properties: [],
          formula: { main: "", sampling: "" }
        };
    }
  };

  const theory = getDistributionTheory();

  return (
    <Card className="w-full">
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {theory.icon}
            <h3 className="font-medium text-lg">{theory.title}</h3>
            <code className="text-sm font-mono bg-muted px-2 py-0.5 rounded-lg">{theory.symbol}</code>
          </div>

          <p className="text-sm text-muted-foreground">{theory.description}</p>

          {theory.properties.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Parameters & Statistics:</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                {theory.properties.map((property, index) => (
                  <li key={index}>{property}</li>
                ))}
              </ul>
            </div>
          )}

          {(theory.formula.main || theory.formula.sampling) && (
            <div className="space-y-2">
              {theory.formula.main && (
                <>
                  <h4 className="font-medium text-sm">Probability Density Function:</h4>
                  <Formula>{theory.formula.main}</Formula>
                </>
              )}
              {theory.formula.sampling && (
                <>
                  <h4 className="font-medium text-sm pt-2">Sampling Distribution:</h4>
                  <Formula>{theory.formula.sampling}</Formula>
                </>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
