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
  Legend,
  ResponsiveContainer,
  ZAxis,
} from "recharts";
import TimeRangeFilter, { TimeRangeValue } from "../common/TimeRangeFilter";

interface EspressoRangeChartProps {
  className?: string;
  timeRange?: TimeRangeValue;
  onTimeRangeChange?: (value: TimeRangeValue) => void;
  data?: Array<{
    date: string;
    shots: number;
    deviceCount: number;
  }>;
}

const EspressoRangeChart: React.FC<EspressoRangeChartProps> = ({
  className = "",
  timeRange: externalTimeRange,
  onTimeRangeChange,
  data: externalData,
}) => {
  // Initialize internal state with a default value
  const [internalTimeRange, setInternalTimeRange] =
    React.useState<TimeRangeValue>("30d");

  // Use external time range if provided, otherwise use internal state
  const timeRange = externalTimeRange || internalTimeRange;

  // Generate more realistic mock data for 30 days with multiple data points per day
  const generateMockData = () => {
    const data = [];
    const baseDate = new Date(2023, 5, 1); // June 1, 2023

    for (let i = 0; i < 30; i++) {
      const currentDate = new Date(baseDate);
      currentDate.setDate(baseDate.getDate() + i);
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;

      // Generate 3-6 different shot count values for each day
      const numDataPoints = Math.floor(Math.random() * 4) + 3; // 3-6 data points per day

      // Create a set of unique shot values to avoid duplicates
      const shotValues = new Set();

      // Most values should be below 6, with some outliers up to 30
      while (shotValues.size < numDataPoints) {
        // 80% chance of value below 6, 20% chance of higher value
        const shotValue =
          Math.random() < 0.8
            ? Math.floor(Math.random() * 6) + 1 // 1-6 shots (common)
            : Math.floor(Math.random() * 25) + 6; // 6-30 shots (less common)

        shotValues.add(shotValue);
      }

      // Convert set to array and create data points
      [...shotValues].forEach((shotValue) => {
        // More devices for common shot values (1-3), fewer for higher values
        let deviceCount;
        if (shotValue <= 3) {
          deviceCount = Math.floor(Math.random() * 20) + 10; // 10-30 devices
        } else if (shotValue <= 6) {
          deviceCount = Math.floor(Math.random() * 10) + 5; // 5-15 devices
        } else {
          deviceCount = Math.floor(Math.random() * 5) + 1; // 1-5 devices
        }

        data.push({
          date: dateStr,
          shots: shotValue,
          deviceCount: deviceCount,
        });
      });
    }

    return data;
  };

  const fullMockData = React.useMemo(() => generateMockData(), []);

  // State to hold filtered data
  const [filteredData, setFilteredData] = React.useState<
    Array<{
      date: string;
      shots: number;
      deviceCount: number;
    }>
  >([]);

  // Fetch data based on time range
  React.useEffect(() => {
    // In a real application, this would fetch data from an API
    console.log(`Fetching espresso range data for time range: ${timeRange}`);

    // Filter data based on timeRange
    let newFilteredData;

    if (
      timeRange === "30m" ||
      timeRange === "1h" ||
      timeRange === "4h" ||
      timeRange === "8h"
    ) {
      // For short time ranges, show just the most recent day with fewer data points
      newFilteredData = fullMockData.slice(-1).map((item) => ({
        ...item,
        deviceCount: Math.floor(item.deviceCount * 0.5), // Reduce device count to simulate fewer devices in shorter timeframes
      }));
    } else if (timeRange === "24h") {
      newFilteredData = fullMockData.slice(-1);
    } else if (timeRange === "3d") {
      newFilteredData = fullMockData.slice(-3);
    } else if (timeRange === "7d") {
      newFilteredData = fullMockData.slice(-7);
    } else if (timeRange === "30d") {
      newFilteredData = fullMockData;
    } else if (timeRange === "custom") {
      // For custom range, we would normally filter based on the custom date range
      // For now, just use the last 14 days as a placeholder
      newFilteredData = fullMockData.slice(-14);
    } else {
      // Default to 30 days for other ranges
      newFilteredData = fullMockData;
    }

    setFilteredData(newFilteredData);
  }, [timeRange, fullMockData]);

  // Use external data if provided, otherwise use filtered data
  const espressoRangeData = externalData || filteredData;

  const handleTimeRangeChange = (value: TimeRangeValue) => {
    // Always update internal state for this component
    setInternalTimeRange(value);

    // If external handler is provided, call it as well
    if (onTimeRangeChange) {
      onTimeRangeChange(value);
    }

    console.log(`Espresso Range Chart: Time range changed to ${value}`);
  };

  // Generate a loading state based on time range
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    // Simulate loading state when time range changes
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [timeRange]);

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Espresso Shots Distribution</CardTitle>
          <CardDescription>
            Each bubble shows the number of devices with a specific shot count
            per day
          </CardDescription>
        </div>
        <TimeRangeFilter value={timeRange} onChange={handleTimeRangeChange} />
      </CardHeader>
      <CardContent className="h-[300px]">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                name="Date"
                type="category"
                allowDuplicatedCategory={false}
              />
              <YAxis
                dataKey="shots"
                name="Shots"
                label={{
                  value: "Shots per device",
                  angle: -90,
                  position: "insideLeft",
                }}
                domain={[0, 30]}
                allowDataOverflow={true}
              />
              <ZAxis
                dataKey="deviceCount"
                range={[60, 400]}
                name="Device Count"
              />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(value, name, props) => {
                  if (name === "Device Count") {
                    return [`${value} devices`, "Device Count"];
                  } else if (name === "Shots") {
                    return [`${value} shots per device`, "Shots"];
                  }
                  return [value, name];
                }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-2 border border-gray-200 rounded-md shadow-sm">
                        <p className="font-medium">{label}</p>
                        <p className="text-sm">{`${payload[0].value} shots per device`}</p>
                        <p className="text-sm">{`${payload[1].value} devices with this count`}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Scatter
                name="Devices with Shot Count"
                data={espressoRangeData}
                fill="#8884d8"
                shape="circle"
              />
            </ScatterChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default EspressoRangeChart;
