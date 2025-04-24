import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import TimeRangeFilter, { TimeRangeValue } from "../common/TimeRangeFilter";

interface DailyShotsChartProps {
  className?: string;
  timeRange?: TimeRangeValue;
  onTimeRangeChange?: (value: TimeRangeValue) => void;
  data?: Array<{
    date: string;
    shots: number;
    devices: number;
  }>;
}

const DailyShotsChart: React.FC<DailyShotsChartProps> = ({
  className = "",
  timeRange: externalTimeRange,
  onTimeRangeChange: externalOnTimeRangeChange,
  data: externalData,
}) => {
  const [internalTimeRange, setInternalTimeRange] =
    React.useState<TimeRangeValue>("30d");

  // Use external time range if provided, otherwise use internal state
  const timeRange =
    externalTimeRange !== undefined ? externalTimeRange : internalTimeRange;

  // Use external data if provided, otherwise use mock data
  const [chartData, setChartData] = React.useState<
    Array<{
      date: string;
      shots: number;
      devices: number;
    }>
  >([]);

  // Mock data for daily shots across devices
  const mockDailyShotsData = [
    { date: "2023-06-01", shots: 1245, devices: 243 },
    { date: "2023-06-02", shots: 1356, devices: 245 },
    { date: "2023-06-03", shots: 1578, devices: 248 },
    { date: "2023-06-04", shots: 1298, devices: 242 },
    { date: "2023-06-05", shots: 1432, devices: 246 },
    { date: "2023-06-06", shots: 1567, devices: 249 },
    { date: "2023-06-07", shots: 1789, devices: 251 },
  ];

  // Generate more mock data for 30 days
  const generateMockData = () => {
    const data = [];
    const baseDate = new Date(2023, 5, 1); // June 1, 2023

    for (let i = 0; i < 30; i++) {
      const currentDate = new Date(baseDate);
      currentDate.setDate(baseDate.getDate() + i);
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;

      data.push({
        date: dateStr,
        shots: Math.floor(Math.random() * 800) + 1000, // Random between 1000-1800
        devices: Math.floor(Math.random() * 20) + 240, // Random between 240-260
      });
    }

    return data;
  };

  const fullMockData = React.useMemo(() => generateMockData(), []);

  // Fetch data based on time range
  React.useEffect(() => {
    // In a real application, this would be an API call
    const fetchData = async () => {
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Filter data based on timeRange
        let filteredData;

        if (timeRange === "24h") {
          filteredData = fullMockData.slice(-1);
        } else if (timeRange === "3d") {
          filteredData = fullMockData.slice(-3);
        } else if (timeRange === "7d") {
          filteredData = fullMockData.slice(-7);
        } else if (timeRange === "30d") {
          filteredData = fullMockData;
        } else {
          // Default to 30 days for other ranges
          filteredData = fullMockData;
        }

        setChartData(filteredData);
      } catch (error) {
        console.error("Error fetching daily shots data:", error);
        setChartData([]);
      }
    };

    fetchData();
  }, [timeRange, fullMockData]);

  // Use external data if provided, otherwise use fetched data
  const dailyShotsData = externalData || chartData;

  const handleTimeRangeChange = (value: TimeRangeValue) => {
    // If external handler is provided, use it
    if (externalOnTimeRangeChange) {
      externalOnTimeRangeChange(value);
    } else {
      // Otherwise use internal state
      setInternalTimeRange(value);
    }

    console.log(`Daily Shots Chart time range changed to ${value}`);
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Monthly Shots Across Devices</CardTitle>
          <CardDescription>
            Total number of espresso shots brewed per month across all connected
            devices
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={dailyShotsData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorShots" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorDevices" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="shots"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorShots)"
              name="Total Shots"
            />
            <Area
              type="monotone"
              dataKey="devices"
              stroke="#82ca9d"
              fillOpacity={1}
              fill="url(#colorDevices)"
              name="Active Devices"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default DailyShotsChart;
