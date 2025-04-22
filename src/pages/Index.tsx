
import { useState, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { ControlPanel } from "@/components/ControlPanel";
import { ChartContainer } from "@/components/ChartContainer";
import { PopulationChart } from "@/components/PopulationChart";
import { SamplingChart } from "@/components/SamplingChart";
import { ExplanationArea } from "@/components/ExplanationArea";
import { StatisticsPanel } from "@/components/StatisticsPanel";
import { DistributionTheory } from "@/components/DistributionTheory";
import { OverlappingCurves } from "@/components/OverlappingCurves";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateDistributionData, calculateMean } from "@/utils/distributions";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  // State for control parameters
  const [sampleSize, setSampleSize] = useState<number>(30);
  const [numberOfSamples, setNumberOfSamples] = useState<number>(100);
  const [distribution, setDistribution] = useState<string>("normal");
  
  // State for sampling results
  const [sampleMeans, setSampleMeans] = useState<number[]>([]);
  const [samplesGenerated, setSamplesGenerated] = useState<number>(0);
  
  // Detect mobile for responsive layout
  const isMobile = useIsMobile();

  // Function to generate samples with faster animation
  const generateSamples = useCallback(() => {
    // Reset sampling
    setSampleMeans([]);
    setSamplesGenerated(0);
    
    // Start generating samples with improved animation timing
    let currentSample = 0;
    const interval = setInterval(() => {
      if (currentSample >= numberOfSamples) {
        clearInterval(interval);
        return;
      }
      
      // Generate multiple samples per tick for smoother animation
      const batchSize = Math.max(1, Math.floor(numberOfSamples / 50));
      for (let i = 0; i < batchSize && currentSample < numberOfSamples; i++) {
        const sample = generateDistributionData(distribution, sampleSize);
        const sampleMean = calculateMean(sample);
        setSampleMeans(prev => [...prev, sampleMean]);
        currentSample++;
      }
      setSamplesGenerated(currentSample);
    }, 40); // Slightly slower for better visualization
    
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
        
        {/* Responsive chart layout */}
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-2 gap-6'} h-[250px]`}>
          <ChartContainer title="Population Distribution">
            <PopulationChart distribution={distribution} />
          </ChartContainer>
          
          <ChartContainer title="Sampling Distribution of the Mean">
            <SamplingChart sampleMeans={sampleMeans} />
          </ChartContainer>
        </div>

        {/* Comparison chart that shows both distributions together */}
        <ChartContainer title="Distribution Comparison">
          <OverlappingCurves 
            sampleMeans={sampleMeans} 
            distribution={distribution} 
            sampleSize={sampleSize} 
          />
        </ChartContainer>

        {/* Statistics and theory information */}
        <StatisticsPanel 
          distribution={distribution}
          sampleMeans={sampleMeans}
          sampleSize={sampleSize}
        />
        
        {/* Tabs for theory and explanation on mobile */}
        {isMobile ? (
          <Tabs defaultValue="explanation">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="explanation">How It Works</TabsTrigger>
              <TabsTrigger value="theory">Distribution Theory</TabsTrigger>
            </TabsList>
            <TabsContent value="explanation">
              <ExplanationArea 
                distribution={distribution}
                sampleSize={sampleSize}
                numberOfSamples={numberOfSamples}
                samplesGenerated={samplesGenerated}
              />
            </TabsContent>
            <TabsContent value="theory">
              <DistributionTheory distribution={distribution} />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ExplanationArea 
              distribution={distribution}
              sampleSize={sampleSize}
              numberOfSamples={numberOfSamples}
              samplesGenerated={samplesGenerated}
            />
            <DistributionTheory distribution={distribution} />
          </div>
        )}
      </main>
      
      <footer className="bg-background p-4 text-center text-sm text-muted-foreground border-t">
        <p>Chart Tales Explorer - Interactive Sampling Distribution Visualizer</p>
      </footer>
    </div>
  );
};

export default Index;
