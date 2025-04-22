
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
import { Toggle } from "@/components/ui/toggle";
import { Label } from "@/components/ui/label";

interface SamplingChartProps {
  sampleMeans: number[];
  showTheoretical: boolean;
  setShowTheoretical?: (x: boolean) => void;
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

export function SamplingChart({ sampleMeans, showTheoretical, setShowTheoretical, colorGroups = false }: SamplingChartProps) {
  const [data, setData] = useState<{ x: number; y: number; colorIndex?: number }[]>([]);
  const [meanValue, setMeanValue] = useState<number | null>(null);
  const [stdDev, setStdDev] = useState<number | null>(null);
  const [theoreticalCurve, setTheoreticalCurve] = useState<{ x: number; y: number }[]>([]);
  const chartRef = useRef<HTMLDivElement>(null);

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
      if (mean !== null && sd !== null && sd > 0) {
        const minX = Math.min(...sampleMeans) - sd;
        const maxX = Math.max(...sampleMeans) + sd;
        const step = (maxX - minX) / 80;
        const theoreticalData = [];
        for (let x = minX; x <= maxX; x += step) {
          const exponent = -0.5 * Math.pow((x - mean) / sd, 2);
          const y = (1 / (sd * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
          theoreticalData.push({ x, y: y * 20 });
        }
        setTheoreticalCurve(theoreticalData);
      } else {
        setTheoreticalCurve([]);
      }
    } else {
      setData([]);
      setMeanValue(null);
      setStdDev(null);
      setTheoreticalCurve([]);
    }
  }, [sampleMeans, colorGroups]);

  // Toggle directly above chart
  return (
    <div className="w-full h-full flex flex-col gap-2">
      {typeof setShowTheoretical === "function" && (
        <div className="flex items-center gap-2 justify-end mb-2 pl-2">
          <Toggle
            pressed={showTheoretical}
            onPressedChange={setShowTheoretical}
            className="mr-2"
            aria-label="Toggle Normal Curve"
            size="sm"
          />
          <Label className="mb-0 text-sm select-none">Show Theoretical Normal Curve</Label>
        </div>
      )}
      <div ref={chartRef} className="w-full h-full flex-1">
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
            {showTheoretical && theoreticalCurve.length > 0 && (
              <Area
                type="monotone"
                dataKey="y"
                data={theoreticalCurve}
                stroke="#8B5CF6"
                fill="none"
                dot={false}
                isAnimationActive={false}
                strokeWidth={3}
                legendType="none"
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
