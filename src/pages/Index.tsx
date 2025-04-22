
import { useState, useCallback, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { ControlPanel } from "@/components/ControlPanel";
import { ChartContainer } from "@/components/ChartContainer";
import { PopulationChart } from "@/components/PopulationChart";
import { SamplingChart } from "@/components/SamplingChart";
import { ExplanationArea } from "@/components/ExplanationArea";
import { StatisticsPanel } from "@/components/StatisticsPanel";
import { OverlappingCurves } from "@/components/OverlappingCurves";
import { StatisticalEffectPanel } from "@/components/StatisticalEffectPanel";
import { DistributionTheoryTabs } from "@/components/DistributionTheoryTabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { exportToPNG, parseUrlParams } from "@/utils/export-utils";
import { generateDistributionData, calculateMean } from "@/utils/distributions";

const Index = () => {
  // State for control parameters
  const [sampleSize, setSampleSize] = useState<number>(30);
  const [numberOfSamples, setNumberOfSamples] = useState<number>(100);
  const [distribution, setDistribution] = useState<string>("normal");
  const [showNormalCurve, setShowNormalCurve] = useState<boolean>(false);
  const [activeScenario, setActiveScenario] = useState<string | null>(null);

  // State for sampling results
  const [sampleMeans, setSampleMeans] = useState<number[]>([]);
  const [samplesGenerated, setSamplesGenerated] = useState<number>(0);

  // For theory tabs (used only for active tab, but all tabs shown at bottom)
  const [theoryTab, setTheoryTab] = useState<string>("normal");

  // Refs for chart exporting
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const samplingChartRef = useRef<HTMLDivElement>(null);

  // Detect mobile for responsive layout
  const isMobile = useIsMobile();

  // Effect to handle URL parameters
  useEffect(() => {
    const params = parseUrlParams();
    if (Object.keys(params).length > 0) {
      if (params.sampleSize !== undefined) setSampleSize(params.sampleSize);
      if (params.numberOfSamples !== undefined) setNumberOfSamples(params.numberOfSamples);
      if (params.distribution !== undefined) setDistribution(params.distribution);
      if (params.showNormalCurve !== undefined) setShowNormalCurve(params.showNormalCurve);
    }
  }, []);

  // Function to generate samples with faster animation
  const generateSamples = useCallback(() => {
    setSampleMeans([]);
    setSamplesGenerated(0);

    let currentSample = 0;
    const interval = setInterval(() => {
      if (currentSample >= numberOfSamples) {
        clearInterval(interval);
        return;
      }
      const batchSize = Math.max(1, Math.floor(numberOfSamples / 50));
      for (let i = 0; i < batchSize && currentSample < numberOfSamples; i++) {
        const sample = generateDistributionData(distribution, sampleSize);
        const sampleMean = calculateMean(sample);
        setSampleMeans((prev: number[]) => [...prev, sampleMean]);
        currentSample++;
      }
      setSamplesGenerated(currentSample);
    }, 40);
    return () => clearInterval(interval);
  }, [distribution, numberOfSamples, sampleSize]);

  // Reset function
  const resetSampling = () => {
    setSampleMeans([]);
    setSamplesGenerated(0);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden" ref={mainContainerRef}>
      <Navbar />
      <main className="flex-1 container mx-auto p-2 md:p-6 pb-16 flex flex-col gap-5 md:gap-6">
        <ControlPanel
          sampleSize={sampleSize}
          setSampleSize={setSampleSize}
          numberOfSamples={numberOfSamples}
          setNumberOfSamples={setNumberOfSamples}
          distribution={distribution}
          setDistribution={setDistribution}
          onSample={generateSamples}
          onReset={resetSampling}
          activeScenario={activeScenario}
          setActiveScenario={setActiveScenario}
        />

        <div className={`grid w-full ${
          isMobile
            ? "grid-cols-1 gap-2"
            : "grid-cols-1 md:grid-cols-2 gap-6"
        }`}>
          {/* Population Chart */}
          <ChartContainer title="Population Distribution">
            <div className={`w-full ${isMobile ? "min-h-[220px] h-[220px]" : "h-[260px]"}`}>
              <PopulationChart distribution={distribution} />
            </div>
          </ChartContainer>
          {/* Sampling Distribution */}
          <ChartContainer title="Sampling Distribution of the Mean">
            <div ref={samplingChartRef} className={`w-full ${isMobile ? "min-h-[220px] h-[220px]" : "h-[260px]"}`}>
              <SamplingChart
                sampleMeans={sampleMeans}
                colorGroups={true}
              />
            </div>
          </ChartContainer>
        </div>
        
        <StatisticalEffectPanel sampleSize={sampleSize} />

        <StatisticsPanel
          distribution={distribution}
          sampleMeans={sampleMeans}
          sampleSize={sampleSize}
        />

        <ChartContainer title="Distribution Comparison">
          <OverlappingCurves
            sampleMeans={sampleMeans}
            distribution={distribution}
            sampleSize={sampleSize}
          />
        </ChartContainer>

        <div className="grid grid-cols-1">
          <ExplanationArea
            distribution={distribution}
            sampleSize={sampleSize}
            numberOfSamples={numberOfSamples}
            samplesGenerated={samplesGenerated}
          />
        </div>

        {/* Distribution Theory Tabs */}
        <div className="mb-16 md:mb-24">
          <DistributionTheoryTabs
            distribution={theoryTab}
            onTabChange={setTheoryTab}
          />
        </div>
      </main>
    </div>
  );
};

export default Index;
