
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AreaChart, ChartPie, ScatterChart } from "lucide-react";

const POPULATION_THEORIES = [
  {
    key: "normal",
    title: "Normal Population",
    description: "The population is perfectly symmetric, bell-shaped, centered at μ = 50. Most values cluster at the mean. Sampling from this yields means that are also normally distributed."
  },
  {
    key: "uniform",
    title: "Uniform Population",
    description: "The population is evenly spread; all values between a and b are equally likely. The distribution is flat. Sampling from this yields sample means with distributions that become normal as sample size increases, thanks to the CLT."
  },
  {
    key: "skewed",
    title: "Right-Skewed Population",
    description: "A long right tail, with many lower values and fewer extreme high values. The sample mean will tend to normalize with larger sample size but the original population is highly skewed."
  },
  {
    key: "bimodal",
    title: "Bimodal Population",
    description: "A combination of two distinct peaks. The population is not unimodal, so its mean is between the two peaks. Sampling means from this shape ultimately yield an approximately normal distribution for large n."
  }
  // Laplace/Student's t removed
];

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
      main: <span><strong>f(x) = (1/σ√2π) × e^(-((x-μ)²/2σ²))</strong></span>,
      sampling: <span><strong>X̄ ~ N(μ, σ²/n)</strong></span>
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
      main: <span><strong>f(x) = 1/(b-a) for x ∈ [a,b]</strong></span>,
      sampling: <span><strong>X̄ ~ N(μ, σ²/n) as n → ∞</strong></span>
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
      main: <span><strong>f(x) = λe^(-λx) for x ≥ 0</strong></span>,
      sampling: <span><strong>X̄ ~ N(μ, σ²/n) as n → ∞</strong></span>
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
      main: <span><strong>f(x) = 0.5φ((x-30)/10) + 0.5φ((x-70)/10)</strong></span>,
      sampling: <span><strong>X̄ ~ N(μ, σ²/n) as n → ∞</strong></span>
    }
  }
  // Laplace/Student's t removed
];

interface DistributionTheoryTabsProps {
  distribution: string;
  onTabChange?: (key: string) => void;
}

export function DistributionTheoryTabs({ distribution, onTabChange }: DistributionTheoryTabsProps) {
  return (
    <div className="space-y-4 w-full overflow-hidden min-h-[440px]"><!-- Added min-h to avoid clipping/collision -->
      <div>
        <h4 className="font-semibold text-base mb-1">Population Theory</h4>
        <div className="flex flex-wrap gap-2">
          {POPULATION_THEORIES.map((pop) => (
            <div 
              key={pop.key}
              className="bg-muted border rounded-md p-2 text-[13px] min-h-[70px] max-w-full flex-1 basis-[260px]"
              style={{ minWidth: 180 }}
            >
              <span className="font-semibold">{pop.title}</span>
              <span className="text-muted-foreground">{pop.description}</span>
            </div>
          ))}
        </div>
      </div>
      <Tabs defaultValue={distribution} className="w-full">
        <TabsList className="flex flex-wrap gap-2 mb-2">
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
            <Card className="overflow-hidden">
              <CardContent className="pt-4 overflow-x-auto">
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
                      <div className="text-base font-mono bg-muted/90 p-3 rounded-lg overflow-x-auto dark:bg-muted/20 border border-muted-foreground/20 my-1 leading-normal break-all font-bold max-w-full">
                        {theory.formula.main}
                      </div>
                      <h4 className="font-medium text-sm pt-2">Sampling Distribution:</h4>
                      <div className="text-base font-mono bg-muted/90 p-3 rounded-lg overflow-x-auto dark:bg-muted/20 border border-muted-foreground/20 my-1 leading-normal break-all font-bold max-w-full">
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
    </div>
  );
}
