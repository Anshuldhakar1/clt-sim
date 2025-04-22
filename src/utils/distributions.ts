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

// Updated uniform distribution with better range handling
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

// Updated generateDistributionData with adjusted parameters
export function generateDistributionData(
  distribution: string,
  size: number
): number[] {
  switch (distribution) {
    case "normal":
      return generateNormal(50, 15, size);
    case "uniform":
      return generateUniform(10, 90, size); // Fixed uniform range
    case "skewed":
      return generateSkewed(0.5, size).map(x => x * 20 + 10);
    case "bimodal":
      return generateBimodal(30, 70, 10, size);
    default:
      return generateNormal(50, 15, size);
  }
}

// Function to calculate the mean of an array of numbers
export function calculateMean(arr: number[]): number {
  if (arr.length === 0) return 0;
  const sum = arr.reduce((acc, val) => acc + val, 0);
  return sum / arr.length;
}

// Function to generate bins for histogram
export function generateHistogramBins(data: number[], numBins = 20): { x: number, y: number }[] {
  if (data.length === 0) return [];
  
  // Find min and max of the data
  const min = Math.min(...data);
  const max = Math.max(...data);
  
  // Calculate bin width
  const binWidth = (max - min) / numBins;
  
  // Initialize bins
  const bins = Array(numBins).fill(0).map((_, i) => ({
    x: min + (i + 0.5) * binWidth, // Center of bin
    y: 0 // Count, initially 0
  }));
  
  // Count data points in each bin
  data.forEach(value => {
    const binIndex = Math.min(Math.floor((value - min) / binWidth), numBins - 1);
    if (binIndex >= 0 && binIndex < bins.length) {
      bins[binIndex].y += 1;
    }
  });
  
  return bins;
}
