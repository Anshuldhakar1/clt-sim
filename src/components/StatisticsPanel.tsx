
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
    if (sampleMeans.length === 0) return { mean: 0, variance: 0, stdDev: 0 };
    
    const mean = sampleMeans.reduce((sum, value) => sum + value, 0) / sampleMeans.length;
    const variance = sampleMeans.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / sampleMeans.length;
    const stdDev = Math.sqrt(variance);
    
    return { mean: mean.toFixed(2), variance: variance.toFixed(2), stdDev: stdDev.toFixed(2) };
  };

  // Get theoretical values based on distribution type
  const getTheoreticalValues = () => {
    switch (distribution) {
      case "normal":
        return {
          mean: "μ = 50",
          variance: "σ² = 225",
          stdDev: "σ = 15",
          symbol: "N(50, 15²)"
        };
      case "uniform":
        return {
          mean: "μ = 50",
          variance: "σ² = 533.33",
          stdDev: "σ = 23.09",
          symbol: "U(10, 90)"
        };
      case "skewed":
        return {
          mean: "μ ≈ 30",
          variance: "σ² ≈ 400",
          stdDev: "σ ≈ 20",
          symbol: "Exp(λ=0.5) × 20 + 10"
        };
      case "bimodal":
        return {
          mean: "μ = 50",
          variance: "σ² = 400",
          stdDev: "σ = 20",
          symbol: "0.5N(30,10²) + 0.5N(70,10²)"
        };
      default:
        return {
          mean: "μ",
          variance: "σ²",
          stdDev: "σ",
          symbol: ""
        };
    }
  };

  const stats = calculateStats();
  const theoretical = getTheoreticalValues();

  return (
    <Card className="w-full">
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="font-medium flex items-center gap-2">
              <Sigma className="h-5 w-5" /> Population Parameters
            </h3>
            <p className="text-sm text-muted-foreground">Distribution: {theoretical.symbol}</p>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="p-2 bg-muted rounded-lg">
                {theoretical.mean}
              </div>
              <div className="p-2 bg-muted rounded-lg">
                {theoretical.variance}
              </div>
              <div className="p-2 bg-muted rounded-lg">
                {theoretical.stdDev}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium flex items-center gap-2">
              <Pi className="h-5 w-5" /> Sample Statistics
            </h3>
            <p className="text-sm text-muted-foreground">Based on {sampleMeans.length} samples of size {sampleSize}</p>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="p-2 bg-muted rounded-lg">
                x̄ = {stats.mean}
              </div>
              <div className="p-2 bg-muted rounded-lg">
                s² = {stats.variance}
              </div>
              <div className="p-2 bg-muted rounded-lg">
                s = {stats.stdDev}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
