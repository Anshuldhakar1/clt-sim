
import { Card, CardContent } from "@/components/ui/card";
import { generateDistributionData } from "@/utils/distributions";
import { useEffect, useState } from "react";

interface PopulationStatisticsPanelProps {
  distribution: string;
  noiseLevel?: number;
  outlierLevel?: number;
}

export function PopulationStatisticsPanel({ 
  distribution,
  noiseLevel = 0,
  outlierLevel = 0
}: PopulationStatisticsPanelProps) {
  const [stats, setStats] = useState({
    mean: 0,
    median: 0,
    variance: 0,
    skewness: 0
  });

  useEffect(() => {
    // Generate a large sample to approximate population parameters
    const populationData = generateDistributionData(distribution, 10000, noiseLevel, outlierLevel);
    
    // Calculate statistics
    const n = populationData.length;
    const mean = populationData.reduce((sum, val) => sum + val, 0) / n;
    
    // Sort data for median
    const sortedData = [...populationData].sort((a, b) => a - b);
    const median = n % 2 === 0 
      ? (sortedData[n/2 - 1] + sortedData[n/2]) / 2 
      : sortedData[Math.floor(n/2)];
    
    // Calculate variance
    const variance = populationData.reduce((sum, val) => 
      sum + Math.pow(val - mean, 2), 0) / n;
    
    // Calculate skewness
    const stdDev = Math.sqrt(variance);
    const skewness = populationData.reduce((sum, val) => 
      sum + Math.pow((val - mean) / stdDev, 3), 0) / n;

    setStats({
      mean: Number(mean.toFixed(2)),
      median: Number(median.toFixed(2)),
      variance: Number(variance.toFixed(2)),
      skewness: Number(skewness.toFixed(2))
    });
  }, [distribution, noiseLevel, outlierLevel]);

  return (
    <Card className="w-full">
      <CardContent className="pt-4">
        <h3 className="font-medium text-lg mb-3">Population Summary Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Mean (μ)</div>
            <div className="font-mono text-lg">{stats.mean}</div>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Median</div>
            <div className="font-mono text-lg">{stats.median}</div>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Variance (σ²)</div>
            <div className="font-mono text-lg">{stats.variance}</div>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Skewness</div>
            <div className="font-mono text-lg">{stats.skewness}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
