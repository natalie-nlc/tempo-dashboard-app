import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
  Legend,
  ReferenceLine,
} from "recharts";
import TimeRangeFilter, { TimeRangeValue } from "../common/TimeRangeFilter";

interface MachineData {
  id: string;
  name: string;
  totalShots: number;
  outsidePressureRangePercent: number;
  status: string;
  hardwareVersion?: string;
  model?: string;
}

interface MachinePerformanceScatterProps {
  data?: MachineData[];
  timeRange?: TimeRangeValue;
  onTimeRangeChange?: (value: TimeRangeValue) => void;
  hardwareVersions?: string[];
  models?: string[];
}

const MachinePerformanceScatter: React.FC<MachinePerformanceScatterProps> = ({
  data = [],
  timeRange = "30d",
  onTimeRangeChange = () => {},
  hardwareVersions = [],
  models = [],
}) => {
  const [selectedHardwareVersion, setSelectedHardwareVersion] = React.useState<
    string | null
  >(null);
  const [selectedModel, setSelectedModel] = React.useState<string | null>(null);
  // Mock data if no data is provided
  const mockData: MachineData[] = [
    {
      id: "m1",
      name: "Machine 1",
      totalShots: 450,
      outsidePressureRangePercent: 12,
      status: "online",
      hardwareVersion: "v1.2",
      model: "prototype",
    },
    {
      id: "m2",
      name: "Machine 2",
      totalShots: 780,
      outsidePressureRangePercent: 8,
      status: "online",
      hardwareVersion: "v1.2",
      model: "pre-series",
    },
    {
      id: "m3",
      name: "Machine 3",
      totalShots: 320,
      outsidePressureRangePercent: 5,
      status: "online",
      hardwareVersion: "v1.3",
      model: "production",
    },
    {
      id: "m4",
      name: "Machine 4",
      totalShots: 890,
      outsidePressureRangePercent: 18,
      status: "warning",
      hardwareVersion: "v1.3",
      model: "pre-series",
    },
    {
      id: "m5",
      name: "Machine 5",
      totalShots: 150,
      outsidePressureRangePercent: 25,
      status: "warning",
      hardwareVersion: "v1.1",
      model: "prototype",
    },
    {
      id: "m6",
      name: "Machine 6",
      totalShots: 650,
      outsidePressureRangePercent: 22,
      status: "warning",
      hardwareVersion: "v1.2",
      model: "pre-series",
    },
    {
      id: "m7",
      name: "Machine 7",
      totalShots: 720,
      outsidePressureRangePercent: 3,
      status: "online",
      hardwareVersion: "v1.3",
      model: "production",
    },
    {
      id: "m8",
      name: "Machine 8",
      totalShots: 510,
      outsidePressureRangePercent: 7,
      status: "online",
      hardwareVersion: "v1.2",
      model: "production",
    },
    {
      id: "m9",
      name: "Machine 9",
      totalShots: 830,
      outsidePressureRangePercent: 28,
      status: "maintenance",
      hardwareVersion: "v1.1",
      model: "prototype",
    },
    {
      id: "m10",
      name: "Machine 10",
      totalShots: 210,
      outsidePressureRangePercent: 4,
      status: "online",
      hardwareVersion: "v1.3",
      model: "production",
    },
  ];

  // Use provided data or mock data
  const baseData = data.length > 0 ? data : mockData;

  // Get unique hardware versions and models for filters
  const availableHardwareVersions =
    hardwareVersions.length > 0
      ? hardwareVersions
      : [
          ...new Set(
            baseData.map((item) => item.hardwareVersion).filter(Boolean),
          ),
        ];

  const availableModels =
    models.length > 0
      ? models
      : [...new Set(baseData.map((item) => item.model).filter(Boolean))];

  // Filter data based on selected hardware version and model
  const displayData = baseData.filter((item) => {
    if (
      selectedHardwareVersion &&
      item.hardwareVersion !== selectedHardwareVersion
    ) {
      return false;
    }
    if (selectedModel && item.model !== selectedModel) {
      return false;
    }
    return true;
  });

  // Calculate median values for reference lines
  const medianShots =
    displayData.reduce((sum, item) => sum + item.totalShots, 0) /
    displayData.length;
  const medianOutsidePercent =
    displayData.reduce(
      (sum, item) => sum + item.outsidePressureRangePercent,
      0,
    ) / displayData.length;

  // Custom tooltip to show machine details
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-md p-2 shadow-md">
          <p className="font-semibold">{data.name}</p>
          <p className="text-sm">
            Total Shots: <span className="font-medium">{data.totalShots}</span>
          </p>
          <p className="text-sm">
            Outside Pressure Range:{" "}
            <span className="font-medium">
              {data.outsidePressureRangePercent}%
            </span>
          </p>
          <p className="text-sm">
            Status:{" "}
            <span
              className={`font-medium ${data.status === "online" ? "text-green-500" : data.status === "warning" ? "text-amber-500" : "text-red-500"}`}
            >
              {data.status}
            </span>
          </p>
          {data.hardwareVersion && (
            <p className="text-sm">
              Hardware Version:{" "}
              <span className="font-medium">{data.hardwareVersion}</span>
            </p>
          )}
          {data.model && (
            <p className="text-sm">
              Model: <span className="font-medium">{data.model}</span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-4">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>
            Correlation: Usage vs. % shots outside target pressure range
          </CardTitle>
          <CardDescription>
            Machines with high usage and pressure issues are highlighted in
            orange. This visual is an example of something we could use to
            identify whether more usage leads to more performance issues (and at
            a consitent rate or increasing), and identify specific outliers.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <TimeRangeFilter value={timeRange} onChange={onTimeRangeChange} />
          <select
            className="h-8 w-40 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={selectedHardwareVersion || ""}
            onChange={(e) => setSelectedHardwareVersion(e.target.value || null)}
          >
            <option value="">All Hardware</option>
            {availableHardwareVersions.map((version) => (
              <option key={version} value={version}>
                {version}
              </option>
            ))}
          </select>
          <select
            className="h-8 w-40 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={selectedModel || ""}
            onChange={(e) => setSelectedModel(e.target.value || null)}
          >
            <option value="">All Models</option>
            {availableModels.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis
              type="number"
              dataKey="totalShots"
              name="Total Shots"
              label={{
                value: "Total Shots (30 days)",
                position: "insideBottom",
                offset: -10,
              }}
              domain={[0, "dataMax + 100"]}
            />
            <YAxis
              type="number"
              dataKey="outsidePressureRangePercent"
              name="Outside Pressure Range"
              label={{
                value: "% Outside Pressure Range",
                angle: -90,
                position: "insideLeft",
              }}
              unit="%"
              domain={[0, 30]}
            />
            <ZAxis range={[60, 60]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />

            {/* Reference lines for quadrants */}
            <ReferenceLine
              x={medianShots}
              stroke="#666"
              strokeDasharray="3 3"
              label={{
                value: "Median Usage",
                position: "insideTopRight",
                fill: "#666",
              }}
            />
            <ReferenceLine
              y={medianOutsidePercent}
              stroke="#666"
              strokeDasharray="3 3"
              label={{
                value: "Median %",
                position: "insideRightTop",
                fill: "#666",
              }}
            />

            {/* Normal machines */}
            <Scatter
              name="Normal Performance"
              data={displayData.filter(
                (machine) =>
                  machine.totalShots < medianShots ||
                  machine.outsidePressureRangePercent < medianOutsidePercent,
              )}
              fill="#8884d8"
            />

            {/* Highlighted machines (high usage, high outside pressure %) */}
            <Scatter
              name="Needs Attention"
              data={displayData.filter(
                (machine) =>
                  machine.totalShots >= medianShots &&
                  machine.outsidePressureRangePercent >= medianOutsidePercent,
              )}
              fill="#ff7300"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default MachinePerformanceScatter;
