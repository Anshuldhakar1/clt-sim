
import { Card, CardContent } from "@/components/ui/card";
import { Sigma, Pi } from "lucide-react";

interface StatisticsPanelProps {
  distribution: string;
  sampleMeans: number[];
  sampleSize: number;
}

export function StatisticsPanel({ distribution, sampleMeans, sampleSize }: StatisticsPanelProps) {
  // Calculate statistics for sample means
  const calculateStats = () => {
    if (sampleMeans.length === 0) return { mean: 0, variance: 0, stdDev: 0, sem: 0 };
    
    const mean = sampleMeans.reduce((sum, value) => sum + value, 0) / sampleMeans.length;
    const variance = sampleMeans.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / sampleMeans.length;
    const stdDev = Math.sqrt(variance);
    // Standard Error of the Mean (SEM) calculation
    const sem = stdDev / Math.sqrt(sampleSize);
    
    return { 
      mean: mean.toFixed(2), 
      variance: variance.toFixed(2), 
      stdDev: stdDev.toFixed(2),
      sem: sem.toFixed(2)
    };
  };

  // Get theoretical values based on distribution type
  const getTheoreticalValues = () => {
    switch (distribution) {
      case "normal":
        // For normal distribution
        const popStdDev = 15;
        const popMean = 50;
        const theoreticalSEM = (popStdDev / Math.sqrt(sampleSize)).toFixed(2);
        
        return {
          mean: `μ = 50`,
          variance: `σ² = 225`,
          stdDev: `σ = 15`,
          sem: `σ/√n = ${theoreticalSEM}`,
          symbol: `N(50, 15²)`,
          semExplanation: `As sample size increases, the standard error decreases proportionally to 1/√n.`
        };
      case "uniform":
        // For uniform distribution, σ² = (b-a)²/12
        const a = 10;
        const b = 90;
        const uMean = (a + b) / 2;
        const uVar = Math.pow(b - a, 2) / 12;
        const uStdDev = Math.sqrt(uVar);
        const uSEM = (uStdDev / Math.sqrt(sampleSize)).toFixed(2);
        
        return {
          mean: `μ = ${uMean}`,
          variance: `σ² = ${uVar.toFixed(2)}`,
          stdDev: `σ = ${uStdDev.toFixed(2)}`,
          sem: `σ/√n = ${uSEM}`,
          symbol: `U(${a}, ${b})`,
          semExplanation: `The sampling distribution for uniform data also approaches normal as n increases.`
        };
      case "skewed":
        // For exponential distribution with λ=0.5, μ=1/λ, σ²=1/λ²
        const lambda = 0.5;
        const expMean = 1/lambda * 20 + 10; // scaled and shifted
        const expVar = 1/(lambda*lambda) * 400; // scaled 
        const expStdDev = Math.sqrt(expVar);
        const expSEM = (expStdDev / Math.sqrt(sampleSize)).toFixed(2);
        
        return {
          mean: `μ ≈ ${expMean.toFixed(2)}`,
          variance: `σ² ≈ ${expVar.toFixed(2)}`,
          stdDev: `σ ≈ ${expStdDev.toFixed(2)}`,
          sem: `σ/√n ≈ ${expSEM}`,
          symbol: `Exp(λ=0.5) × 20 + 10`,
          semExplanation: `Even with skewed data, the sampling distribution normalizes as n increases.`
        };
      case "bimodal":
        // For bimodal (mixture of two normals)
        const biModalMean = 50; // (30 + 70) / 2
        const biModalVar = 400; // Calculated from mixture
        const biModalStdDev = 20;
        const biModalSEM = (biModalStdDev / Math.sqrt(sampleSize)).toFixed(2);
        
        return {
          mean: `μ = ${biModalMean}`,
          variance: `σ² = ${biModalVar}`,
          stdDev: `σ = ${biModalStdDev}`,
          sem: `σ/√n = ${biModalSEM}`,
          symbol: `0.5N(30,10²) + 0.5N(70,10²)`,
          semExplanation: `Even with a bimodal population, the CLT ensures a normal sampling distribution.`
        };
      default:
        return {
          mean: "μ",
          variance: "σ²",
          stdDev: "σ",
          sem: "σ/√n",
          symbol: "",
          semExplanation: ""
        };
    }
  };

  const stats = calculateStats();
  const theoretical = getTheoreticalValues();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="w-full">
        <CardContent className="pt-4">
          <h3 className="font-medium flex items-center gap-2 mb-2">
            <Sigma className="h-5 w-5" /> Population Parameters
          </h3>
          <p className="text-sm text-muted-foreground mb-2">Distribution: {theoretical.symbol}</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="p-2 bg-muted rounded-lg">
              {theoretical.mean}
            </div>
            <div className="p-2 bg-muted rounded-lg">
              {theoretical.stdDev}
            </div>
            <div className="p-2 bg-muted rounded-lg">
              {theoretical.variance}
            </div>
            <div className="p-2 bg-muted rounded-lg">
              {theoretical.sem}
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardContent className="pt-4">
          <h3 className="font-medium flex items-center gap-2 mb-2">
            <Pi className="h-5 w-5" /> Sample Statistics
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            Based on {sampleMeans.length} samples of size {sampleSize}
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="p-2 bg-muted rounded-lg">
              x̄ = {stats.mean}
            </div>
            <div className="p-2 bg-muted rounded-lg">
              s = {stats.stdDev}
            </div>
            <div className="p-2 bg-muted rounded-lg">
              s² = {stats.variance}
            </div>
            <div className="p-2 bg-muted rounded-lg">
              SEM = {stats.sem}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
