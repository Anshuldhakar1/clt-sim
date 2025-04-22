
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";
import { generateDistributionData } from "@/utils/distributions";

interface PopulationChartProps {
  distribution: string;
}

export function PopulationChart({ distribution }: PopulationChartProps) {
  const [data, setData] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    // Generate data points for the selected distribution
    const populationData = generateDistributionData(distribution, 1000);
    
    // Create bins for visualization
    const bins: Record<number, number> = {};
    const min = Math.floor(Math.min(...populationData));
    const max = Math.ceil(Math.max(...populationData));
    const binWidth = (max - min) / 30;
    
    // Initialize bins
    for (let i = min; i <= max; i += binWidth) {
      bins[i] = 0;
    }
    
    // Count values in each bin
    populationData.forEach(value => {
      const binKey = Math.floor((value - min) / binWidth) * binWidth + min;
      if (bins[binKey] !== undefined) {
        bins[binKey] += 1;
      }
    });
    
    // Convert to array format for Recharts
    const chartData = Object.entries(bins).map(([x, y]) => ({
      x: parseFloat(x),
      y: y / populationData.length // Normalize to get density
    }));
    
    setData(chartData);
  }, [distribution]);

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
