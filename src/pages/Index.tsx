
import { useState, useCallback } from "react";
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

const Index = () => {
  // State for control parameters
  const [sampleSize, setSampleSize] = useState<number>(30);
  const [numberOfSamples, setNumberOfSamples] = useState<number>(100);
  const [distribution, setDistribution] = useState<string>("normal");
  
  // State for sampling results
  const [sampleMeans, setSampleMeans] = useState<number[]>([]);
  const [samplesGenerated, setSamplesGenerated] = useState<number>(0);
  
  // For theory tabs (used only for active tab, but all tabs shown at bottom)
  const [theoryTab, setTheoryTab] = useState<string>("normal");

  // Detect mobile for responsive layout
  const isMobile = useIsMobile();

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
        const { generateDistributionData, calculateMean } = require("@/utils/distributions");
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
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto p-4 md:p-6 flex flex-col gap-6">
        {/* Controls at the very top */}
        <ControlPanel
          sampleSize={sampleSize}
          setSampleSize={setSampleSize}
          numberOfSamples={numberOfSamples}
          setNumberOfSamples={setNumberOfSamples}
          distribution={distribution}
          setDistribution={setDistribution}
          onSample={generateSamples}
          onReset={resetSampling}
        />

        {/* Charts section */}
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-2 gap-6'} h-[250px]`}>
          <ChartContainer title="Population Distribution">
            <PopulationChart distribution={distribution} />
          </ChartContainer>
          <ChartContainer title="Sampling Distribution of the Mean">
            <SamplingChart sampleMeans={sampleMeans} />
          </ChartContainer>
        </div>

        {/* Statistical Effects placed right below the graphs */}
        <StatisticalEffectPanel sampleSize={sampleSize} />

        {/* Statistics panels (Population Parameters & Sample Statistics) */}
        <StatisticsPanel 
          distribution={distribution}
          sampleMeans={sampleMeans}
          sampleSize={sampleSize}
        />

        {/* Distribution Comparison */}
        <ChartContainer title="Distribution Comparison">
          <OverlappingCurves 
            sampleMeans={sampleMeans} 
            distribution={distribution} 
            sampleSize={sampleSize} 
          />
        </ChartContainer>

        {/* Explanation Area */}
        <div className="grid grid-cols-1">
          <ExplanationArea 
            distribution={distribution}
            sampleSize={sampleSize}
            numberOfSamples={numberOfSamples}
            samplesGenerated={samplesGenerated}
          />
        </div>

        {/* Distribution Theories Tabs at the bottom, always visible */}
        <div>
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

