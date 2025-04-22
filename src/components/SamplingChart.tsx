
import { useEffect, useState, useRef } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  Area,
  ComposedChart
} from "recharts";
import { generateHistogramBins, calculateMean, calculateStandardDeviation } from "@/utils/distributions";

interface SamplingChartProps {
  sampleMeans: number[];
  showTheoretical: boolean;
  colorGroups?: boolean;
}

// Function to get color for a bar based on index
const getBarColor = (index: number, total: number) => {
  // Use a set of predefined colors for visualization
  const colors = [
    "hsl(var(--chart-samples))",                // Default color
    "hsl(var(--chart-accent))",                 // Purple
    "hsl(var(--chart-primary))",                // Blue
    "#33C3F0",                                  // Sky Blue
    "#ea384c",                                  // Red
    "#8B5CF6",                                  // Vivid Purple
  ];
  
  if (!total || total <= 1) return colors[0];
  
  // When we have many samples, use color groups instead of individual colors
  const colorGroup = Math.floor(index / (total / (colors.length - 1)));
  return colors[Math.min(colorGroup, colors.length - 1)];
};

export function SamplingChart({ sampleMeans, showTheoretical, colorGroups = false }: SamplingChartProps) {
  const [data, setData] = useState<{ x: number; y: number; colorIndex?: number }[]>([]);
  const [meanValue, setMeanValue] = useState<number | null>(null);
  const [stdDev, setStdDev] = useState<number | null>(null);
  const [theoreticalCurve, setTheoreticalCurve] = useState<{ x: number; y: number }[]>([]);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sampleMeans.length > 0) {
      // Generate histogram bins from sample means
      const histogramData = generateHistogramBins(sampleMeans, 20);
      
      // Add color indexing if color groups are enabled
      if (colorGroups) {
        const dataWithColors = histogramData.map((bin, index) => ({
          ...bin,
          colorIndex: index
        }));
        setData(dataWithColors);
      } else {
        setData(histogramData);
      }
      
      // Calculate mean of sample means
      const mean = calculateMean(sampleMeans);
      setMeanValue(mean);
      
      // Calculate standard deviation for theoretical curve
      const sd = calculateStandardDeviation(sampleMeans);
      setStdDev(sd);
      
      // Generate theoretical normal curve data points
      if (mean !== null && sd !== null) {
        const minX = Math.min(...sampleMeans) - sd;
        const maxX = Math.max(...sampleMeans) + sd;
        const step = (maxX - minX) / 50;
        
        const theoreticalData = [];
        for (let x = minX; x <= maxX; x += step) {
          // Normal distribution PDF formula
          const exponent = -0.5 * Math.pow((x - mean) / sd, 2);
          const y = (1 / (sd * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
          theoreticalData.push({ x, y: y * 20 }); // Scale for visibility
        }
        
        setTheoreticalCurve(theoreticalData);
      }
    } else {
      setData([]);
      setMeanValue(null);
      setStdDev(null);
      setTheoreticalCurve([]);
    }
  }, [sampleMeans, colorGroups]);

  // Custom bar shape for color-coding
  const renderCustomBar = (props: any) => {
    const { x, y, width, height, colorIndex, index } = props;
    
    // Use color grouping if enabled
    const fill = colorGroups 
      ? getBarColor(colorIndex || index, data.length)
      : "hsl(var(--chart-samples))";
      
    return <rect x={x} y={y} width={width} height={height} fill={fill} />;
  };

  return (
    <div ref={chartRef} className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
            shape={renderCustomBar}
            isAnimationActive={true}
            animationDuration={300}
          />
          
          {showTheoretical && theoreticalCurve.length > 0 && (
            <Area
              type="monotone"
              dataKey="y"
              data={theoreticalCurve}
              stroke="#8B5CF6"
              fill="#8B5CF6"
              fillOpacity={0.2}
              isAnimationActive={true}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
