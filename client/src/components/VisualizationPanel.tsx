import { useState } from "react";
import { useGraphContext } from "@/hooks/useGraphContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import GraphVisualization from "@/components/GraphVisualization";
import GraphComparison from "@/components/GraphComparison";
import TransactionLog from "@/components/TransactionLog";

export default function VisualizationPanel() {
  const { viewType, setViewType, resetGraph } = useGraphContext();

  const handleViewTypeChange = (value: string) => {
    setViewType(value as 'simplified' | 'raw');
  };

  return (
    <div className="w-full lg:w-2/3 space-y-6">
      {/* Graph View Card */}
      <Card className="bg-white rounded-xl shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
            <CardTitle className="font-heading font-semibold text-lg flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
              Debt Graph Visualization
            </CardTitle>
            
            <div className="flex flex-wrap items-center gap-2">
              <Button 
                variant="destructive" 
                size="sm"
                className="bg-red-500 hover:bg-red-600 text-white"
                onClick={resetGraph}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Reset Graph
              </Button>
              
              <RadioGroup 
                className="flex items-center space-x-2" 
                defaultValue={viewType}
                value={viewType}
                onValueChange={handleViewTypeChange}
              >
                <div className="flex items-center">
                  <RadioGroupItem value="simplified" id="simplified" className="h-4 w-4 text-primary-500" />
                  <Label htmlFor="simplified" className="ml-2 text-sm font-medium text-secondary-500">Simplified</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="raw" id="raw" className="h-4 w-4 text-primary-500" />
                  <Label htmlFor="raw" className="ml-2 text-sm font-medium text-secondary-500">Raw</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          {/* Graph Visualization */}
          <GraphVisualization />
        </CardContent>
      </Card>
      
      {/* Simplified vs Raw Graph Comparison */}
      <GraphComparison />
      
      {/* Transaction Log */}
      <TransactionLog />
    </div>
  );
}
