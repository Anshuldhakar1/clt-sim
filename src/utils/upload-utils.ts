
// Utility functions for handling data uploads and noise

/**
 * Parse CSV data into numerical array
 * @param csvContent CSV content as string
 * @returns Array of numbers
 */
export function parseCSVData(csvContent: string): number[] {
  try {
    // Split by new lines and commas, filter empty strings, and convert to numbers
    const data = csvContent
      .split(/[\r\n,]+/)
      .filter(val => val.trim() !== '')
      .map(val => {
        const num = parseFloat(val.trim());
        return isNaN(num) ? null : num;
      })
      .filter((val): val is number => val !== null);

    return data;
  } catch (error) {
    console.error('Error parsing CSV data:', error);
    return [];
  }
}

/**
 * Parse JSON data into numerical array
 * @param jsonContent JSON content as string
 * @returns Array of numbers
 */
export function parseJSONData(jsonContent: string): number[] {
  try {
    const parsed = JSON.parse(jsonContent);
    
    // If it's an array of numbers directly
    if (Array.isArray(parsed) && parsed.every(item => typeof item === 'number')) {
      return parsed;
    }
    
    // If it's an object with a data property that is an array
    if (parsed.data && Array.isArray(parsed.data)) {
      return parsed.data.filter(item => typeof item === 'number');
    }
    
    // If it's an array of objects with a value property
    if (Array.isArray(parsed) && parsed[0] && typeof parsed[0] === 'object') {
      // Try to extract numerical values from common field names
      const valueFields = ['value', 'y', 'data', 'val'];
      for (const field of valueFields) {
        if (typeof parsed[0][field] === 'number') {
          return parsed.map(item => item[field]).filter(val => typeof val === 'number');
        }
      }
    }
    
    console.error('Unsupported JSON format');
    return [];
  } catch (error) {
    console.error('Error parsing JSON data:', error);
    return [];
  }
}

/**
 * Add noise to a dataset
 * @param data Original data array
 * @param noiseLevel Noise level (0-1)
 * @returns Data with added noise
 */
export function addNoiseToData(data: number[], noiseLevel: number): number[] {
  if (noiseLevel === 0) return [...data];
  
  // Calculate the standard deviation of the data to scale noise appropriately
  const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
  const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
  const stdDev = Math.sqrt(variance);
  
  // Scale factor determines noise intensity (0-1 range to be multiplied by stdDev)
  const scaleFactor = noiseLevel * 0.5; // Max noise up to 50% of stdDev
  
  return data.map(val => {
    // Generate noise with normal distribution
    const u1 = Math.random();
    const u2 = Math.random();
    const noise = stdDev * scaleFactor * Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return val + noise;
  });
}

/**
 * Add outliers to a dataset
 * @param data Original data array
 * @param outlierLevel Outlier level (0-1)
 * @returns Data with added outliers
 */
export function addOutliersToData(data: number[], outlierLevel: number): number[] {
  if (outlierLevel === 0) return [...data];

  const result = [...data];
  
  // Calculate statistics for outlier generation
  const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
  const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
  const stdDev = Math.sqrt(variance);
  
  // Number of outliers to add (between 1 and 5% of data points)
  const outlierCount = Math.max(1, Math.floor(data.length * outlierLevel * 0.05));
  
  // Generate outliers
  for (let i = 0; i < outlierCount; i++) {
    // Randomly decide if outlier is high or low
    const isHigh = Math.random() > 0.5;
    
    // Generate outlier (3-6 standard deviations away from mean)
    const deviations = 3 + Math.random() * 3;
    const outlierValue = isHigh 
      ? mean + stdDev * deviations 
      : mean - stdDev * deviations;
    
    // Replace a random element in the array with the outlier
    const idx = Math.floor(Math.random() * result.length);
    result[idx] = outlierValue;
  }
  
  return result;
}
