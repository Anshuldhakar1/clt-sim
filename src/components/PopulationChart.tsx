
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine
} from "recharts";
import { generateDistributionData, generateHistogramBins } from "@/utils/distributions";

interface PopulationChartProps {
  distribution: string;
  noiseLevel?: number;
  outlierLevel?: number;
}

export function PopulationChart({ 
  distribution, 
  noiseLevel = 0, 
  outlierLevel = 0 
}: PopulationChartProps) {
  const [data, setData] = useState<{ x: number; y: number }[]>([]);
  const [populationMean, setPopulationMean] = useState<number | null>(null);

  useEffect(() => {
    // Generate data points for the selected distribution
    const populationData = generateDistributionData(distribution, 2000, noiseLevel, outlierLevel);
    
    // Calculate the mean
    const mean = populationData.reduce((sum, val) => sum + val, 0) / populationData.length;
    setPopulationMean(mean);
    
    // Create bins for visualization with more detail
    const histogramData = generateHistogramBins(populationData, 40);
    setData(histogramData);
  }, [distribution, noiseLevel, outlierLevel]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <XAxis 
          dataKey="x" 
          type="number"
          domain={['auto', 'auto']}
          tickCount={5} 
          tickFormatter={(value) => value.toFixed(0)}
        />
        <YAxis hide />
        <Tooltip 
          formatter={(value: number) => [value.toFixed(3), "Density"]}
          labelFormatter={(value) => `Value: ${parseFloat(value).toFixed(1)}`}
        />
        {populationMean !== null && (
          <ReferenceLine
            x={populationMean}
            stroke="hsl(var(--chart-primary))"
            strokeDasharray="3 3"
            label={{ value: `μ = ${populationMean.toFixed(1)}`, position: 'top' }}
          />
        )}
        <Area 
          type="monotone" 
          dataKey="y" 
          stroke="hsl(var(--chart-primary))" 
          fill="hsl(var(--chart-distribution))" 
          fillOpacity={0.8}
          isAnimationActive={true}
          animationDuration={500}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
