import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TimeRangeFilter, { TimeRangeValue } from "../common/TimeRangeFilter";

interface DevicePerformanceHistogramProps {
  deviceId: string;
  timeRange?: TimeRangeValue;
  onTimeRangeChange?: (value: TimeRangeValue) => void;
}

// Roast types
const roastTypes = [
  { id: "all", name: "All Roasts" },
  { id: "roaring_volcano", name: "Roaring Volcano" },
  { id: "glowing_beach", name: "Glowing Beach" },
  { id: "vibrant_jungle", name: "Vibrant Jungle" },
  { id: "calm_lake", name: "Calm Lake" },
];

// Generate mock data for the histogram based on deviceId
const generateMockData = (deviceId: string) => {
  // Create pressure ranges from 0 to 25 in increments of 1
  const pressureRanges = Array.from({ length: 26 }, (_, i) => i);

  // Generate random counts for each pressure range with a normal-ish distribution
  // centered around 9-10 bars (typical espresso pressure)
  return pressureRanges.map((pressure) => {
    // Create a distribution that peaks around 9-10 bars
    let count = 0;
    if (pressure >= 5 && pressure <= 14) {
      // Higher counts in the typical espresso range
      const distance = Math.abs(pressure - 9.5);
      // Use deviceId to create slightly different distributions for each device
      const deviceFactor = parseInt(deviceId) || 1;
      count =
        Math.floor(Math.random() * 100) +
        100 -
        distance * 20 +
        (deviceFactor % 5) * 10;
      count = Math.max(count, 5); // Ensure at least some shots in this range
    } else {
      // Lower counts outside the typical range
      count = Math.floor(Math.random() * 20);
    }

    return {
      pressure,
      count,
      // We'll calculate percentage later based on filtered data
    };
  });
};

const DevicePerformanceHistogram: React.FC<DevicePerformanceHistogramProps> = ({
  deviceId,
  timeRange = "24h",
  onTimeRangeChange = () => {},
}) => {
  const [selectedRoastType, setSelectedRoastType] = useState<string>("all");

  // Generate mock data based on deviceId
  const mockData = useMemo(() => generateMockData(deviceId), [deviceId]);

  // In a real application, this would filter data based on the selected roast type and time range
  const filteredData = useMemo(() => {
    // For now, we'll just return the mock data
    // In a real app, this would filter based on selectedRoastType and timeRange
    let filtered = [...mockData];

    // Calculate total count for percentage calculation
    const totalCount = filtered.reduce((sum, item) => sum + item.count, 0);

    // Add percentage to each item
    return filtered.map((item) => ({
      ...item,
      percentage: ((item.count / totalCount) * 100).toFixed(1),
    }));
  }, [mockData, selectedRoastType, timeRange]);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border p-2 rounded-md shadow-md">
          <p className="font-medium">{`Pressure: ${data.pressure} bars`}</p>
          <p>{`Count: ${data.count} shots`}</p>
          <p>{`Percentage: ${data.percentage}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Device Performance Histogram</CardTitle>
          <CardDescription>
            Distribution of peak pressure values for this device
          </CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Select
            value={selectedRoastType}
            onValueChange={setSelectedRoastType}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Roast Type" />
            </SelectTrigger>
            <SelectContent>
              {roastTypes.map((roast) => (
                <SelectItem key={roast.id} value={roast.id}>
                  {roast.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <TimeRangeFilter value={timeRange} onChange={onTimeRangeChange} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="pressure"
                label={{
                  value: "Peak Pressure (bars)",
                  position: "insideBottom",
                  offset: -5,
                }}
              />
              <YAxis
                label={{
                  value: "Percentage of Shots (%)",
                  angle: -90,
                  position: "insideLeft",
                }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="percentage" fill="#8884d8">
                {filteredData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.pressure >= 6 && entry.pressure <= 9
                        ? "#4CAF50"
                        : "#8884d8"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default DevicePerformanceHistogram;
