
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine
} from "recharts";
import { generateHistogramBins } from "@/utils/distributions";

interface SamplingChartProps {
  sampleMeans: number[];
}

export function SamplingChart({ sampleMeans }: SamplingChartProps) {
  const [data, setData] = useState<{ x: number; y: number }[]>([]);
  const [meanValue, setMeanValue] = useState<number | null>(null);

  useEffect(() => {
    if (sampleMeans.length > 0) {
      // Generate histogram bins from sample means
      const histogramData = generateHistogramBins(sampleMeans, 20);
      setData(histogramData);
      
      // Calculate mean of sample means
      const mean = sampleMeans.reduce((acc, val) => acc + val, 0) / sampleMeans.length;
      setMeanValue(mean);
    } else {
      setData([]);
      setMeanValue(null);
    }
  }, [sampleMeans]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <XAxis 
          dataKey="x" 
          type="number"
          domain={['auto', 'auto']}
          tickCount={5}
          tickFormatter={(value) => value.toFixed(0)}
        />
        <YAxis hide />
        <Tooltip 
          formatter={(value: number) => [value, "Frequency"]}
          labelFormatter={(value) => `Mean: ${parseFloat(value).toFixed(1)}`}
        />
        {meanValue !== null && (
          <ReferenceLine
            x={meanValue}
            stroke="hsl(var(--chart-accent))"
            strokeDasharray="3 3"
            label={{ value: `μ = ${meanValue.toFixed(1)}`, position: 'top' }}
          />
        )}
        <Bar 
          dataKey="y" 
          fill="hsl(var(--chart-samples))" 
          isAnimationActive={true}
          animationDuration={300}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
