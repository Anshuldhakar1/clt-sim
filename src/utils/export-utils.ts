
import { toast } from "@/hooks/use-toast";

/**
 * Exports a chart element as a PNG image
 * @param elementId The ID of the element to export
 * @param filename The filename for the exported image
 */
export const exportToPNG = async (elementRef: React.RefObject<HTMLElement>, filename = 'chart-export.png') => {
  if (!elementRef.current) {
    toast({
      title: "Export Failed",
      description: "Could not find the chart to export.",
      variant: "destructive",
    });
    return;
  }
  
  try {
    // Dynamically import html2canvas for better performance
    const html2canvasModule = await import('html2canvas');
    const html2canvas = html2canvasModule.default;
    
    // Create canvas from the element
    const canvas = await html2canvas(elementRef.current, {
      scale: 2, // Higher resolution
      backgroundColor: null, // Transparent background
      logging: false,
    });
    
    // Convert to blob
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
      }, 'image/png');
    });
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Successful",
      description: `Saved as ${filename}`,
    });
  } catch (error) {
    console.error('Error exporting chart:', error);
    toast({
      title: "Export Failed",
      description: "An error occurred while exporting the chart.",
      variant: "destructive",
    });
  }
};

/**
 * Generates a shareable URL with the current simulation parameters
 */
export const generateShareableUrl = (params: {
  sampleSize: number;
  numberOfSamples: number;
  distribution: string;
  showNormalCurve: boolean;
}) => {
  // Create URL parameters
  const urlParams = new URLSearchParams();
  urlParams.set('n', params.sampleSize.toString());
  urlParams.set('samples', params.numberOfSamples.toString());
  urlParams.set('dist', params.distribution);
  urlParams.set('curve', params.showNormalCurve ? '1' : '0');
  
  // Generate full URL
  const url = `${window.location.origin}${window.location.pathname}?${urlParams.toString()}`;
  
  // Copy to clipboard
  navigator.clipboard.writeText(url)
    .then(() => {
      toast({
        title: "URL Copied to Clipboard",
        description: "Share this link to show others your exact simulation settings.",
      });
    })
    .catch((error) => {
      console.error('Error copying URL:', error);
      toast({
        title: "Error Copying URL",
        description: "Could not copy to clipboard. Try again later.",
        variant: "destructive",
      });
    });
    
  return url;
};

/**
 * Parse URL parameters for CLT simulation
 */
export const parseUrlParams = (): {
  sampleSize?: number;
  numberOfSamples?: number;
  distribution?: string;
  showNormalCurve?: boolean;
} => {
  const params = new URLSearchParams(window.location.search);
  
  const result: {
    sampleSize?: number;
    numberOfSamples?: number;
    distribution?: string;
    showNormalCurve?: boolean;
  } = {};
  
  // Parse sample size
  const n = params.get('n');
  if (n && !isNaN(Number(n))) {
    result.sampleSize = Number(n);
  }
  
  // Parse number of samples
  const samples = params.get('samples');
  if (samples && !isNaN(Number(samples))) {
    result.numberOfSamples = Number(samples);
  }
  
  // Parse distribution
  const dist = params.get('dist');
  if (dist && ['normal', 'uniform', 'skewed', 'bimodal'].includes(dist)) {
    result.distribution = dist;
  }
  
  // Parse show normal curve
  const curve = params.get('curve');
  if (curve !== null) {
    result.showNormalCurve = curve === '1';
  }
  
  return result;
};
