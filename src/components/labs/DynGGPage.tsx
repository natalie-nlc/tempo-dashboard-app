import React from "react";
import DynGGTable from "./DynGGTable";

const DynGGPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">DynGG Performance Analysis</h1>
          <p className="text-muted-foreground">
            Monitor and analyze Dynamic Grind & Grind performance metrics across
            all devices
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-muted/20 p-4 rounded-lg">
          <p className="text-sm font-medium text-muted-foreground">
            Average Peak Pressure
          </p>
          <h3 className="text-2xl font-bold mt-1">8.24 bar</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Across all devices
          </p>
        </div>
        <div className="bg-muted/20 p-4 rounded-lg">
          <p className="text-sm font-medium text-muted-foreground">
            Devices in Target Range
          </p>
          <h3 className="text-2xl font-bold mt-1">76.3%</h3>
          <p className="text-xs text-muted-foreground mt-1">
            6-9 bar peak pressure
          </p>
        </div>
        <div className="bg-muted/20 p-4 rounded-lg">
          <p className="text-sm font-medium text-muted-foreground">
            Total Shots Analyzed
          </p>
          <h3 className="text-2xl font-bold mt-1">24,873</h3>
          <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
        </div>
      </div>

      <DynGGTable />
    </div>
  );
};

export default DynGGPage;
