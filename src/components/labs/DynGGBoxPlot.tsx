import React, { useState, useMemo } from "react";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ReferenceLine,
  Rectangle,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TimeRangeFilter, { TimeRangeValue } from "../common/TimeRangeFilter";
import { Device, DeviceModel } from "@/types/device";

interface PressureDataPoint {
  date: string;
  pressure: number;
  shotId: string;
  deviceId: string;
  roastType?: string;
}

interface BoxPlotData {
  deviceId: string;
  deviceName: string;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  mean: number;
  stdDev: number;
  model: DeviceModel;
  location: string;
}

interface DynGGBoxPlotProps {
  pressureData: PressureDataPoint[];
  devices: Device[];
  timeRange: TimeRangeValue;
  onTimeRangeChange: (value: TimeRangeValue) => void;
}

// Custom tooltip component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border border-border p-2 rounded-md shadow-md">
        <p className="font-medium">{data.deviceName}</p>
        <p>{`Median: ${data.median.toFixed(2)} bars`}</p>
        <p>{`Std Dev: ${data.stdDev.toFixed(2)}`}</p>
        <p>{`Range: ${data.min.toFixed(2)} - ${data.max.toFixed(2)} bars`}</p>
        <p>{`IQR: ${data.q1.toFixed(2)} - ${data.q3.toFixed(2)} bars`}</p>
        <p>{`Model: ${data.model}`}</p>
        <p>{`Location: ${data.location}`}</p>
      </div>
    );
  }
  return null;
};

// Custom box plot component
const BoxPlot = (props: any) => {
  const { x, y, width, height, payload } = props;
  const { min, q1, median, q3, max } = payload;

  // Calculate positions
  const middleX = x + width / 2;
  const boxWidth = width * 0.8;
  const boxX = x + width * 0.1;

  return (
    <g>
      {/* Min-Max Line */}
      <line
        x1={middleX}
        y1={y + height - (min * height) / 12}
        x2={middleX}
        y2={y + height - (max * height) / 12}
        stroke="#8884d8"
        strokeWidth={1}
      />

      {/* Min Whisker */}
      <line
        x1={boxX}
        y1={y + height - (min * height) / 12}
        x2={boxX + boxWidth}
        y2={y + height - (min * height) / 12}
        stroke="#8884d8"
        strokeWidth={1}
      />

      {/* Max Whisker */}
      <line
        x1={boxX}
        y1={y + height - (max * height) / 12}
        x2={boxX + boxWidth}
        y2={y + height - (max * height) / 12}
        stroke="#8884d8"
        strokeWidth={1}
      />

      {/* Box */}
      <rect
        x={boxX}
        y={y + height - (q3 * height) / 12}
        width={boxWidth}
        height={((q3 - q1) * height) / 12}
        fill="#8884d8"
        fillOpacity={0.5}
        stroke="#8884d8"
      />

      {/* Median Line */}
      <line
        x1={boxX}
        y1={y + height - (median * height) / 12}
        x2={boxX + boxWidth}
        y2={y + height - (median * height) / 12}
        stroke="#000"
        strokeWidth={2}
      />
    </g>
  );
};

const DynGGBoxPlot: React.FC<DynGGBoxPlotProps> = ({
  pressureData,
  devices,
  timeRange,
  onTimeRangeChange,
}) => {
  const [selectedModel, setSelectedModel] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedRoastType, setSelectedRoastType] = useState<string>("all");

  // Get unique locations from devices
  const locations = useMemo(() => {
    const uniqueLocations = new Set(devices.map((device) => device.location));
    return ["all", ...Array.from(uniqueLocations)];
  }, [devices]);

  // Get unique models from devices
  const models = useMemo(() => {
    const uniqueModels = new Set(devices.map((device) => device.model));
    return ["all", ...Array.from(uniqueModels)];
  }, [devices]);

  // Get unique roast types from pressure data
  const roastTypes = useMemo(() => {
    const uniqueRoastTypes = new Set(
      pressureData
        .filter((point) => point.roastType)
        .map((point) => point.roastType),
    );
    return ["all", ...Array.from(uniqueRoastTypes)];
  }, [pressureData]);

  // Process data for box plot
  const boxPlotData = useMemo(() => {
    // Group data by device
    const deviceGroups: Record<string, number[]> = {};

    // Filter data based on selections
    const filteredData = pressureData.filter((point) => {
      const device = devices.find((d) => d.id === point.deviceId);
      if (!device) return false;

      const modelMatch =
        selectedModel === "all" || device.model === selectedModel;
      const locationMatch =
        selectedLocation === "all" || device.location === selectedLocation;
      const roastMatch =
        selectedRoastType === "all" ||
        (point.roastType && point.roastType === selectedRoastType);

      return modelMatch && locationMatch && roastMatch;
    });

    // Group pressure values by device
    filteredData.forEach((point) => {
      if (!deviceGroups[point.deviceId]) {
        deviceGroups[point.deviceId] = [];
      }
      deviceGroups[point.deviceId].push(point.pressure);
    });

    // Calculate statistics for each device
    const result: BoxPlotData[] = Object.keys(deviceGroups).map((deviceId) => {
      const device = devices.find((d) => d.id === deviceId);
      const values = deviceGroups[deviceId].sort((a, b) => a - b);

      // Calculate quartiles
      const min = values[0];
      const max = values[values.length - 1];
      const q1 = values[Math.floor(values.length * 0.25)];
      const median = values[Math.floor(values.length * 0.5)];
      const q3 = values[Math.floor(values.length * 0.75)];

      // Calculate mean and standard deviation
      const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
      const variance =
        values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
        values.length;
      const stdDev = Math.sqrt(variance);

      return {
        deviceId,
        deviceName: device?.name || deviceId,
        min,
        q1,
        median,
        q3,
        max,
        mean,
        stdDev,
        model: device?.model || "unknown",
        location: device?.location || "unknown",
      };
    });

    // Sort by median pressure
    return result.sort((a, b) => a.median - b.median);
  }, [
    pressureData,
    devices,
    selectedModel,
    selectedLocation,
    selectedRoastType,
  ]);

  return (
    <Card className="w-full mt-6">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 gap-4">
        <div>
          <CardTitle>Machine Pressure Distribution</CardTitle>
          <CardDescription>
            Box plot showing peak pressure distribution across machines
          </CardDescription>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Model" />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model === "all" ? "All Models" : model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedLocation}
              onValueChange={setSelectedLocation}
            >
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location === "all" ? "All Locations" : location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedRoastType}
              onValueChange={setSelectedRoastType}
            >
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Roast Type" />
              </SelectTrigger>
              <SelectContent>
                {roastTypes.map((roast) => (
                  <SelectItem key={roast} value={roast}>
                    {roast === "all" ? "All Roasts" : roast}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-auto mt-2 sm:mt-0">
            <TimeRangeFilter
              value={timeRange}
              onChange={onTimeRangeChange}
              className="w-full sm:w-auto"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] md:h-[400px] lg:h-[500px] transition-all duration-300">
          {boxPlotData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={boxPlotData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                className="transition-all duration-300"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="deviceName"
                  angle={-45}
                  textAnchor="end"
                  height={70}
                  interval={0}
                  tick={{ fontSize: 12 }}
                  tickLine={{ stroke: "#94a3b8" }}
                />
                <YAxis
                  domain={[4, 12]}
                  label={{
                    value: "Peak Pressure (bar)",
                    angle: -90,
                    position: "insideLeft",
                    style: { textAnchor: "middle", fill: "#64748b" },
                  }}
                  tick={{ fontSize: 12 }}
                  tickLine={{ stroke: "#94a3b8" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine
                  y={6}
                  stroke="#10b981"
                  strokeDasharray="3 3"
                  label={{
                    value: "Min Target",
                    position: "left",
                    fill: "#10b981",
                  }}
                />
                <ReferenceLine
                  y={9}
                  stroke="#10b981"
                  strokeDasharray="3 3"
                  label={{
                    value: "Max Target",
                    position: "left",
                    fill: "#10b981",
                  }}
                />
                {boxPlotData.length > 0 &&
                  boxPlotData.map((entry, index) => (
                    <Rectangle
                      key={`boxplot-${index}`}
                      x={index * (100 / boxPlotData.length) + "%"}
                      y={0}
                      width={100 / boxPlotData.length + "%"}
                      height="100%"
                      fill="transparent"
                      shape={<BoxPlot payload={entry} />}
                    />
                  ))}
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full bg-muted/10 rounded-md">
              <p className="text-muted-foreground">
                No data available for the selected filters
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DynGGBoxPlot;
