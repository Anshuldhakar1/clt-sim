// Function to generate random numbers from different distributions

// Normal distribution using Box-Muller transform
export function generateNormal(mean = 0, stdDev = 1, size = 1): number[] {
  const result = [];
  for (let i = 0; i < size; i++) {
    // Box-Muller transform
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    result.push(z0 * stdDev + mean);
  }
  return result;
}

// Improved uniform distribution
export function generateUniform(min = 0, max = 1, size = 1): number[] {
  const result = [];
  const range = max - min;
  for (let i = 0; i < size; i++) {
    result.push(min + Math.random() * range);
  }
  return result;
}

// Right-skewed distribution (using exponential)
export function generateSkewed(lambda = 1, size = 1): number[] {
  const result = [];
  for (let i = 0; i < size; i++) {
    // Exponential distribution: -ln(U) / λ where U is uniform(0,1)
    const u = Math.random();
    result.push(-Math.log(u) / lambda);
  }
  return result;
}

// Bimodal distribution (mixture of two normals)
export function generateBimodal(mean1 = -2, mean2 = 2, stdDev = 1, size = 1): number[] {
  const result = [];
  for (let i = 0; i < size; i++) {
    // Choose one of the two normal distributions with equal probability
    const mean = Math.random() < 0.5 ? mean1 : mean2;
    // Generate from normal distribution with chosen mean
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    result.push(z0 * stdDev + mean);
  }
  return result;
}

// Store custom uploaded data
let customPopulationData: number[] | null = null;

// Function to set custom population data
export function setCustomPopulationData(data: number[] | null) {
  customPopulationData = data;
}

// Function to get custom population data
export function getCustomPopulationData(): number[] | null {
  return customPopulationData;
}

export function generateDistributionData(
  distribution: string,
  size: number,
  noiseLevel = 0,
  outlierLevel = 0
): number[] {
  // First check if we have custom data
  if (distribution === "custom" && customPopulationData && customPopulationData.length > 0) {
    // For custom data, we resample with replacement to get the requested size
    const result = [];
    for (let i = 0; i < size; i++) {
      const randomIndex = Math.floor(Math.random() * customPopulationData.length);
      result.push(customPopulationData[randomIndex]);
    }
    return result;
  }

  // Otherwise generate from the standard distributions
  let data;
  switch (distribution) {
    case "normal":
      data = generateNormal(50, 15, size);
      break;
    case "uniform":
      data = generateUniform(10, 90, size);
      break;
    case "skewed":
      data = generateSkewed(0.5, size).map(x => x * 20 + 10);
      break;
    case "bimodal":
      data = generateBimodal(30, 70, 10, size);
      break;
    default:
      data = generateNormal(50, 15, size);
  }

  // Apply noise and outliers if requested
  if (noiseLevel > 0) {
    const { addNoiseToData } = require('./upload-utils');
    data = addNoiseToData(data, noiseLevel);
  }
  
  if (outlierLevel > 0) {
    const { addOutliersToData } = require('./upload-utils');
    data = addOutliersToData(data, outlierLevel);
  }

  return data;
}

// Function to calculate the mean of an array of numbers
export function calculateMean(arr: number[]): number {
  if (arr.length === 0) return 0;
  const sum = arr.reduce((acc, val) => acc + val, 0);
  return sum / arr.length;
}

// Function to calculate variance of an array of numbers
export function calculateVariance(arr: number[], mean?: number): number {
  if (arr.length <= 1) return 0;
  const m = mean ?? calculateMean(arr);
  const squaredDifferences = arr.map(val => Math.pow(val - m, 2));
  return squaredDifferences.reduce((acc, val) => acc + val, 0) / arr.length;
}

// Function to calculate standard deviation
export function calculateStdDev(arr: number[], mean?: number): number {
  return Math.sqrt(calculateVariance(arr, mean));
}

// Export calculate standard deviation as an alias to calculateStdDev for compatibility
export const calculateStandardDeviation = calculateStdDev;

// Improved function to generate histogram bins with better binning
export function generateHistogramBins(data: number[], numBins = 20): { x: number, y: number }[] {
  if (data.length === 0) return [];
  
  // Find min and max of the data
  const min = Math.min(...data);
  const max = Math.max(...data);
  
  // Add a small buffer to min/max to ensure all data points are included
  const range = max - min;
  const bufferSize = range * 0.05; // 5% buffer
  const adjustedMin = min - bufferSize;
  const adjustedMax = max + bufferSize;
  
  // Calculate bin width
  const binWidth = (adjustedMax - adjustedMin) / numBins;
  
  // Initialize bins
  const bins = Array(numBins).fill(0).map((_, i) => ({
    x: adjustedMin + (i + 0.5) * binWidth, // Center of bin
    y: 0 // Count, initially 0
  }));
  
  // Count data points in each bin
  data.forEach(value => {
    const binIndex = Math.min(
      Math.floor((value - adjustedMin) / binWidth), 
      numBins - 1
    );
    if (binIndex >= 0 && binIndex < bins.length) {
      bins[binIndex].y += 1;
    }
  });
  
  // Normalize the bin heights to create a density plot
  const totalCount = data.length;
  return bins.map(bin => ({
    x: bin.x,
    // Normalize by count and bin width to get probability density
    y: bin.y / (totalCount * binWidth)
  }));
}
