
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ComposedChart
} from "recharts";
import { generateHistogramBins, calculateMean, calculateStandardDeviation } from "@/utils/distributions";

interface SamplingChartProps {
  sampleMeans: number[];
  colorGroups?: boolean;
}

const getBarColor = (index: number, total: number) => {
  const colors = [
    "hsl(var(--chart-samples))",
    "hsl(var(--chart-accent))",
    "hsl(var(--chart-primary))",
    "#33C3F0",
    "#ea384c",
    "#8B5CF6",
  ];
  if (!total || total <= 1) return colors[0];
  const colorGroup = Math.floor(index / (total / (colors.length - 1)));
  return colors[Math.min(colorGroup, colors.length - 1)];
};

export function SamplingChart({ sampleMeans, colorGroups = false }: SamplingChartProps) {
  const [data, setData] = useState<{ x: number; y: number; colorIndex?: number }[]>([]);
  const [meanValue, setMeanValue] = useState<number | null>(null);
  const [stdDev, setStdDev] = useState<number | null>(null);

  useEffect(() => {
    if (sampleMeans.length > 0) {
      const histogramData = generateHistogramBins(sampleMeans, 20);
      if (colorGroups) {
        const dataWithColors = histogramData.map((bin, index) => ({
          ...bin,
          colorIndex: index
        }));
        setData(dataWithColors);
      } else {
        setData(histogramData);
      }
      const mean = calculateMean(sampleMeans);
      setMeanValue(mean);
      const sd = calculateStandardDeviation(sampleMeans);
      setStdDev(sd);
    } else {
      setData([]);
      setMeanValue(null);
      setStdDev(null);
    }
  }, [sampleMeans, colorGroups]);

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <div className="w-full h-full flex-1 min-h-[150px] sm:min-h-[180px] md:min-h-[200px]">
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
              shape={props => {
                const { x, y, width, height, colorIndex, index } = props as any;
                const fill = colorGroups
                  ? getBarColor(colorIndex || index, data.length)
                  : "hsl(var(--chart-samples))";
                return <rect x={x} y={y} width={width} height={height} fill={fill} />;
              }}
              isAnimationActive={true}
              animationDuration={300}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
