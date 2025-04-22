
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AreaChart, ChartPie, ScatterChart } from "lucide-react";

const THEORIES = [
  {
    key: "normal",
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
      main: "f(x) = (1/σ√2π) × e^(-((x-μ)²/2σ²))",
      sampling: "X̄ ~ N(μ, σ²/n)"
    }
  },
  {
    key: "uniform",
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
      main: "f(x) = 1/(b-a) for x ∈ [a,b]",
      sampling: "X̄ ~ N(μ, σ²/n) as n → ∞"
    }
  },
  {
    key: "skewed",
    title: "Right-Skewed Distribution (Exponential)",
    icon: <ScatterChart className="h-5 w-5" />,
    symbol: "X ~ Exp(λ)",
    description: "The exponential distribution models the time between events, with a longer tail to the right.",
    properties: [
      "Rate Parameter (λ) = 0.5",
      "Mean (μ) = 1/λ × 20 + 10",
      "Variance (σ²) = 1/λ² × 400"
    ],
    formula: {
      main: "f(x) = λe^(-λx) for x ≥ 0",
      sampling: "X̄ ~ N(μ, σ²/n) as n → ∞"
    }
  },
  {
    key: "bimodal",
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
      main: "f(x) = 0.5φ((x-30)/10) + 0.5φ((x-70)/10)",
      sampling: "X̄ ~ N(μ, σ²/n) as n → ∞"
    }
  }
];

interface DistributionTheoryTabsProps {
  distribution: string;
  onTabChange?: (key: string) => void;
}

export function DistributionTheoryTabs({ distribution, onTabChange }: DistributionTheoryTabsProps) {
  return (
    <Tabs defaultValue={distribution} className="w-full">
      <TabsList className="grid grid-cols-4 mb-2">
        {THEORIES.map((theory) => (
          <TabsTrigger 
            key={theory.key}
            value={theory.key}
            onClick={() => onTabChange?.(theory.key)}
          >
            {theory.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {THEORIES.map((theory) => (
        <TabsContent key={theory.key} value={theory.key}>
          <Card>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {theory.icon}
                  <h3 className="font-medium text-lg">{theory.title}</h3>
                  <code className="text-sm font-mono bg-muted px-2 py-0.5 rounded-lg">{theory.symbol}</code>
                </div>
                <p className="text-sm text-muted-foreground">{theory.description}</p>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Parameters & Statistics:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    {theory.properties.map((property, index) => (
                      <li key={index}>{property}</li>
                    ))}
                  </ul>
                </div>
                {theory.formula.main && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Probability Density Function:</h4>
                    <div className="text-sm font-mono bg-muted/80 p-3 rounded-lg overflow-x-auto dark:bg-muted/20">
                      {theory.formula.main}
                    </div>
                    <h4 className="font-medium text-sm pt-2">Sampling Distribution:</h4>
                    <div className="text-sm font-mono bg-muted/80 p-3 rounded-lg overflow-x-auto dark:bg-muted/20">
                      {theory.formula.sampling}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
}
