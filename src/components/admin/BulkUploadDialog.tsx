import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Download, Upload, FileUp } from "lucide-react";

type BulkUploadDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: any[]) => Promise<void>;
  entityType: 'products' | 'bundles';
  sampleData: any[];
};

const BulkUploadDialog = ({ 
  isOpen, 
  onClose, 
  onUpload, 
  entityType, 
  sampleData 
}: BulkUploadDialogProps) => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const resetState = () => {
    setSelectedFile(null);
    setIsUploading(false);
  };
  
  const handleClose = () => {
    resetState();
    onClose();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        toast({
          title: "Invalid file format",
          description: "Please upload a CSV file",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };
  
  const downloadTemplate = () => {
    // Create a CSV string from the sample data
    const headers = Object.keys(sampleData[0]).join(',');
    const rows = sampleData.map(item => Object.values(item).map(value => {
      // Handle objects by stringifying them
      if (typeof value === 'object' && value !== null) {
        return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
      }
      // Handle strings by wrapping in quotes and escaping existing quotes
      if (typeof value === 'string') {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(','));
    
    const csvContent = [headers, ...rows].join('\n');
    
    // Create a Blob and download it
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${entityType}_template.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const parseCSV = (text: string): any[] => {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    
    return lines.slice(1)
      .filter(line => line.trim() !== '')
      .map(line => {
        const values: string[] = [];
        let insideQuote = false;
        let currentValue = '';
        
        // Parse CSV respecting quoted values that might contain commas
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') {
            insideQuote = !insideQuote;
          } else if (char === ',' && !insideQuote) {
            values.push(currentValue);
            currentValue = '';
          } else {
            currentValue += char;
          }
        }
        values.push(currentValue); // Add the last value
        
        // Create object from headers and values
        const obj: Record<string, any> = {};
        headers.forEach((header, index) => {
          let value = values[index] || '';
          // Try to parse JSON objects or arrays
          if (value.startsWith('{') || value.startsWith('[')) {
            try {
              value = JSON.parse(value.replace(/^"(.*)"$/, '$1'));
            } catch (e) {
              // Keep as string if parsing fails
            }
          }
          // Try to convert numbers - but keep as their native type, not as string
          else if (!isNaN(Number(value)) && value.trim() !== '') {
            value = Number(value);
          }
          // Convert boolean strings - but keep as their native type, not as string
          else if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
            value = value.toLowerCase() === 'true';
          }
          obj[header] = value;
        });
        
        return obj;
      });
  };
  
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    try {
      const text = await selectedFile.text();
      const parsedData = parseCSV(text);
      
      await onUpload(parsedData);
      
      toast({
        title: "Upload successful",
        description: `${parsedData.length} ${entityType} have been uploaded`,
      });
      
      handleClose();
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload failed",
        description: (error as Error).message || `Failed to upload ${entityType}`,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bulk Upload {entityType}</DialogTitle>
          <DialogDescription>
            Upload multiple {entityType} at once using a CSV file.
            Download the template below to see the required format.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <Button 
            variant="outline" 
            onClick={downloadTemplate} 
            className="w-full"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Template CSV
          </Button>
          
          <div className="border-2 border-dashed border-primary/20 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
            <label className="cursor-pointer w-full h-full block">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <FileUp className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm font-medium">
                {selectedFile ? selectedFile.name : 'Click to upload your CSV file'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Only CSV files are supported
              </p>
            </label>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button
            variant="outline"
            onClick={handleClose}
            className="sm:mt-0 mt-2"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="sm:ml-3"
          >
            {isUploading ? 'Uploading...' : 'Upload File'}
            <Upload className="ml-2 h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkUploadDialog;
