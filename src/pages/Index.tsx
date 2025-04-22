
import { useState, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { ControlPanel } from "@/components/ControlPanel";
import { ChartContainer } from "@/components/ChartContainer";
import { PopulationChart } from "@/components/PopulationChart";
import { SamplingChart } from "@/components/SamplingChart";
import { ExplanationArea } from "@/components/ExplanationArea";
import { generateDistributionData, calculateMean } from "@/utils/distributions";

const Index = () => {
  // State for control parameters
  const [sampleSize, setSampleSize] = useState<number>(30);
  const [numberOfSamples, setNumberOfSamples] = useState<number>(100);
  const [distribution, setDistribution] = useState<string>("normal");
  
  // State for sampling results
  const [sampleMeans, setSampleMeans] = useState<number[]>([]);
  const [samplesGenerated, setSamplesGenerated] = useState<number>(0);

  // Function to generate samples and calculate means
  const generateSamples = useCallback(() => {
    // Reset sampling
    setSampleMeans([]);
    setSamplesGenerated(0);
    
    // Start generating samples one by one with a delay to show animation
    let currentSample = 0;
    const interval = setInterval(() => {
      if (currentSample >= numberOfSamples) {
        clearInterval(interval);
        return;
      }
      
      // Generate one sample and calculate its mean
      const sample = generateDistributionData(distribution, sampleSize);
      const sampleMean = calculateMean(sample);
      
      // Update states
      setSampleMeans(prev => [...prev, sampleMean]);
      currentSample++;
      setSamplesGenerated(currentSample);
    }, 50); // 50ms between samples for smooth animation
    
    // Cleanup interval on component unmount or re-run
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[400px]">
          <ChartContainer title="Population Distribution">
            <PopulationChart distribution={distribution} />
          </ChartContainer>
          
          <ChartContainer title="Sampling Distribution of the Mean">
            <SamplingChart sampleMeans={sampleMeans} />
          </ChartContainer>
        </div>
        
        <ExplanationArea 
          distribution={distribution}
          sampleSize={sampleSize}
          numberOfSamples={numberOfSamples}
          samplesGenerated={samplesGenerated}
        />
      </main>
      
      <footer className="bg-background p-4 text-center text-sm text-muted-foreground border-t">
        <p>Chart Tales Explorer - Interactive Sampling Distribution Visualizer</p>
      </footer>
    </div>
  );
};

export default Index;
