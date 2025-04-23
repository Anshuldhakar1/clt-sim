
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { parseCSVData, parseJSONData } from "@/utils/upload-utils";
import { setCustomPopulationData } from "@/utils/distributions";
import { Upload } from "lucide-react";

interface PopulationDataUploadProps {
  onDataUploaded: () => void;
  onResetToDefault: () => void;
}

export function PopulationDataUpload({ onDataUploaded, onResetToDefault }: PopulationDataUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        let data: number[] = [];
        
        if (file.name.endsWith('.csv')) {
          data = parseCSVData(content);
        } else if (file.name.endsWith('.json')) {
          data = parseJSONData(content);
        } else {
          toast.error("Unsupported file format. Please use CSV or JSON.");
          setIsUploading(false);
          return;
        }
        
        if (data.length === 0) {
          toast.error("No valid numerical data found in the file.");
          setIsUploading(false);
          return;
        }

        // Check if data has reasonable values
        if (data.some(val => !isFinite(val))) {
          toast.error("File contains invalid numerical values.");
          setIsUploading(false);
          return;
        }
        
        // Success - set the custom population data
        setCustomPopulationData(data);
        toast.success(`Uploaded ${data.length} data points successfully.`);
        onDataUploaded();
        
        // Reset the input
        e.target.value = '';
      } catch (error) {
        console.error("Error processing file:", error);
        toast.error("Error processing file. Please check the format.");
      } finally {
        setIsUploading(false);
      }
    };
    
    reader.onerror = () => {
      toast.error("Error reading file.");
      setIsUploading(false);
    };
    
    // Read the file
    if (file.name.endsWith('.csv') || file.name.endsWith('.txt')) {
      reader.readAsText(file);
    } else {
      reader.readAsText(file);
    }
  };
  
  const handleReset = () => {
    setCustomPopulationData(null);
    toast.success("Reset to default distribution.");
    onResetToDefault();
  };
  
  return (
    <Card className="w-full">
      <CardContent className="pt-4 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-lg">Population Data Upload</h3>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Input
              type="file"
              accept=".csv,.json,.txt"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="cursor-pointer"
            />
          </div>
          <Button 
            variant="secondary" 
            onClick={handleReset}
            size="sm"
            className="whitespace-nowrap"
          >
            Reset to Default
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground">
          <p>Supported formats: CSV or JSON files containing numerical data.</p>
          <p>CSV format: One value per line or comma-separated values.</p>
          <p>JSON format: An array of numbers or objects with numeric values.</p>
        </div>
      </CardContent>
    </Card>
  );
}
