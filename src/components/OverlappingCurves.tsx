
import { useEffect, useState } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from "recharts";
import { generateDistributionData, generateHistogramBins } from "@/utils/distributions";

interface OverlappingCurvesProps {
  sampleMeans: number[];
  distribution: string;
  sampleSize: number;
}

export function OverlappingCurves({ sampleMeans, distribution, sampleSize }: OverlappingCurvesProps) {
  const [data, setData] = useState<{ x: number; population: number; sampling: number }[]>([]);

  useEffect(() => {
    if (sampleMeans.length === 0) return;

    // Generate population data
    const populationData = generateDistributionData(distribution, 2000);
    const populationBins = generateHistogramBins(populationData, 30);
    
    // Generate sampling distribution bins
    const samplingBins = generateHistogramBins(sampleMeans, 30);
    
    // Normalize both distributions for better comparison
    const normalizeData = (bins: { x: number; y: number }[]) => {
      const maxY = Math.max(...bins.map(bin => bin.y));
      return bins.map(bin => ({ x: bin.x, y: bin.y / maxY }));
    };
    
    const normalizedPopulation = normalizeData(populationBins);
    const normalizedSampling = normalizeData(samplingBins);
    
    // Create merged dataset with common x-axis
    // Using linear interpolation to align the data points
    const minX = Math.min(
      normalizedPopulation[0]?.x || 0, 
      normalizedSampling[0]?.x || 0
    );
    const maxX = Math.max(
      normalizedPopulation[normalizedPopulation.length - 1]?.x || 100, 
      normalizedSampling[normalizedSampling.length - 1]?.x || 100
    );
    
    const step = (maxX - minX) / 50;
    const mergedData = [];
    
    for (let x = minX; x <= maxX; x += step) {
      const populationY = interpolate(normalizedPopulation, x);
      const samplingY = interpolate(normalizedSampling, x);
      
      mergedData.push({
        x: parseFloat(x.toFixed(1)),
        population: populationY,
        sampling: samplingY
      });
    }
    
    setData(mergedData);
  }, [sampleMeans, distribution, sampleSize]);

  // Linear interpolation helper function
  const interpolate = (bins: { x: number; y: number }[], x: number): number => {
    // Find the two closest bins
    const lowerBin = bins.filter(bin => bin.x <= x).sort((a, b) => b.x - a.x)[0];
    const upperBin = bins.filter(bin => bin.x >= x).sort((a, b) => a.x - b.x)[0];
    
    if (!lowerBin) return upperBin?.y || 0;
    if (!upperBin) return lowerBin?.y || 0;
    if (lowerBin.x === upperBin.x) return lowerBin.y;
    
    // Linear interpolation formula: y = y1 + (x - x1) * (y2 - y1) / (x2 - x1)
    return lowerBin.y + 
      (x - lowerBin.x) * (upperBin.y - lowerBin.y) / (upperBin.x - lowerBin.x);
  };

  if (sampleMeans.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        Generate samples to see the comparison between distributions
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <XAxis 
          dataKey="x" 
          type="number"
          domain={['auto', 'auto']}
          tickCount={5}
          tickFormatter={(value) => value.toFixed(0)}
        />
        <YAxis hide />
        <Tooltip 
          formatter={(value: number) => [value.toFixed(3), "Relative Frequency"]}
          labelFormatter={(value) => `Value: ${parseFloat(value).toFixed(1)}`}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="population" 
          name="Population Distribution" 
          stroke="hsl(var(--chart-primary))" 
          dot={false}
          activeDot={{ r: 4 }}
          strokeWidth={2}
        />
        <Line 
          type="monotone" 
          dataKey="sampling" 
          name={`Sampling Distribution (n=${sampleSize})`} 
          stroke="hsl(var(--chart-accent))" 
          dot={false}
          activeDot={{ r: 4 }}
          strokeWidth={2}
          strokeDasharray="5 5"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
