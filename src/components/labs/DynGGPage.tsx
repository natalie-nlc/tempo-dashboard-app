import React, { useState } from "react";
import DynGGTable from "./DynGGTable";
import DynGGBoxPlot from "./DynGGBoxPlot";
import { mockDevices } from "../devices/DeviceTable";
import { TimeRangeValue } from "../common/TimeRangeFilter";

// Generate mock pressure data for the storyboard
const generateMockPressureData = (deviceId: string, count: number = 50) => {
  const data = [];
  const roastTypes = [
    "Roaring Volcano",
    "Glowing Beach",
    "Vibrant Jungle",
    "Calm Lake",
  ];

  // Find the device to customize data based on model
  const device = mockDevices.find((d) => d.id === deviceId);
  const isProduction = device?.model === "production";
  const isPreSeries = device?.model === "pre-series";

  // Base pressure and variation based on device type
  let basePressure = 8;
  let variation = 1.5;

  if (isProduction) {
    basePressure = 8.2;
    variation = 0.8;
  } else if (isPreSeries) {
    basePressure = 7.8;
    variation = 1.2;
  }

  for (let i = 0; i < count; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));

    // Add some randomness to the pressure
    const randomVariation = (Math.random() * 2 - 1) * variation;
    const pressure = basePressure + randomVariation;

    data.push({
      date: date.toISOString(),
      pressure: Math.max(4, Math.min(12, pressure)),
      shotId: `${deviceId}-${date.getTime()}`,
      deviceId: deviceId, // Ensure deviceId is properly set
      roastType: roastTypes[Math.floor(Math.random() * roastTypes.length)],
    });
  }

  return data;
};

// Generate data for all devices
const generateAllDevicesData = () => {
  const allData = [];
  for (const device of mockDevices) {
    const deviceData = generateMockPressureData(device.id, 50);
    allData.push(...deviceData);
  }
  return allData;
};

const DynGGPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRangeValue>("30d");
  const allPressureData = generateAllDevicesData();

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

      {/* Box Plot Component */}
      <DynGGBoxPlot
        pressureData={allPressureData}
        devices={mockDevices}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
      />
    </div>
  );
};

export default DynGGPage;
