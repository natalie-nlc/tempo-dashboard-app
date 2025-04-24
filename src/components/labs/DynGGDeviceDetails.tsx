import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
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
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";
import { mockDevices } from "../devices/DeviceTable";
import { Device } from "@/types/device";
import TimeRangeFilter, { TimeRangeValue } from "../common/TimeRangeFilter";

interface PressureDataPoint {
  date: string;
  pressure: number;
  shotId: string;
}

const generateMockPressureData = (
  deviceId: string,
  days: number = 30,
): PressureDataPoint[] => {
  const data: PressureDataPoint[] = [];
  const now = new Date();

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

  // Generate data points for each day
  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Generate 1-5 shots per day
    const shotsPerDay = Math.floor(Math.random() * 5) + 1;

    for (let j = 0; j < shotsPerDay; j++) {
      // Add some randomness to the pressure
      const randomVariation = (Math.random() * 2 - 1) * variation;
      const pressure = basePressure + randomVariation;

      // Add some time variation within the day
      const hours = Math.floor(Math.random() * 12) + 8; // Between 8am and 8pm
      const minutes = Math.floor(Math.random() * 60);
      date.setHours(hours, minutes);

      data.push({
        date: date.toISOString(),
        pressure: Math.max(4, Math.min(12, pressure)), // Clamp between 4-12 bars
        shotId: `${deviceId}-${date.getTime()}`,
      });
    }
  }

  // Sort by date ascending
  return data.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
};

// Import Table components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DynGGDeviceDetails: React.FC = () => {
  const { deviceId } = useParams<{ deviceId: string }>();
  const [device, setDevice] = useState<Device | null>(null);
  const [pressureData, setPressureData] = useState<PressureDataPoint[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRangeValue>("30d");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    if (!deviceId) return;

    setLoading(true);

    // Find device in mock data
    const foundDevice = mockDevices.find((d) => d.id === deviceId);
    if (foundDevice) {
      setDevice(foundDevice);
    }

    // Generate pressure data based on time range
    let days = 30;
    switch (timeRange) {
      case "7d":
        days = 7;
        break;
      case "30d":
        days = 30;
        break;
      case "90d":
        days = 90;
        break;
      default:
        days = 30;
    }

    const data = generateMockPressureData(deviceId, days);
    setPressureData(data);
    setLoading(false);
  }, [deviceId, timeRange]);

  if (loading) {
    return <div className="p-6">Loading device details...</div>;
  }

  if (!device) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Device not found</h1>
        <Link to="/labs/dyngg">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to DynGG Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  // Calculate statistics
  const avgPressure =
    pressureData.reduce((sum, point) => sum + point.pressure, 0) /
    pressureData.length;
  const squaredDiffs = pressureData.map((point) =>
    Math.pow(point.pressure - avgPressure, 2),
  );
  const variance =
    squaredDiffs.reduce((sum, diff) => sum + diff, 0) / pressureData.length;
  const stdDev = Math.sqrt(variance);
  const inTargetRange = pressureData.filter(
    (point) => point.pressure >= 6 && point.pressure <= 9,
  ).length;
  const percentInRange = (inTargetRange / pressureData.length) * 100;

  // Format dates for display
  const formattedData = pressureData.map((point) => ({
    ...point,
    formattedDate: new Date(point.date).toLocaleDateString(),
  }));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/labs/dyngg">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to DynGG Dashboard
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">
            DynGG Performance: {device.name}
          </h1>
        </div>
        <TimeRangeFilter value={timeRange} onChange={setTimeRange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-muted/20 p-4 rounded-lg">
          <p className="text-sm font-medium text-muted-foreground">
            Average Peak Pressure
          </p>
          <h3 className="text-2xl font-bold mt-1">
            {avgPressure.toFixed(2)} bar
          </h3>
        </div>
        <div className="bg-muted/20 p-4 rounded-lg">
          <p className="text-sm font-medium text-muted-foreground">
            Standard Deviation
          </p>
          <h3 className="text-2xl font-bold mt-1">{stdDev.toFixed(2)}</h3>
        </div>
        <div className="bg-muted/20 p-4 rounded-lg">
          <p className="text-sm font-medium text-muted-foreground">
            % in Target Range
          </p>
          <h3 className="text-2xl font-bold mt-1">
            {percentInRange.toFixed(1)}%
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            6-9 bar peak pressure
          </p>
        </div>
        <div className="bg-muted/20 p-4 rounded-lg">
          <p className="text-sm font-medium text-muted-foreground">
            Total Shots
          </p>
          <h3 className="text-2xl font-bold mt-1">{pressureData.length}</h3>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Peak Pressure Over Time</CardTitle>
          <CardDescription>
            Shot-by-shot peak pressure readings for {device.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={formattedData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="formattedDate"
                  label={{
                    value: "Date",
                    position: "insideBottom",
                    offset: -10,
                  }}
                />
                <YAxis
                  domain={[4, 12]}
                  label={{
                    value: "Peak Pressure (bar)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  formatter={(value: number) => [
                    `${value.toFixed(2)} bar`,
                    "Peak Pressure",
                  ]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Legend />
                <ReferenceLine
                  y={6}
                  stroke="#10b981"
                  strokeDasharray="3 3"
                  label="Min Target"
                />
                <ReferenceLine
                  y={9}
                  stroke="#10b981"
                  strokeDasharray="3 3"
                  label="Max Target"
                />
                <Line
                  type="monotone"
                  dataKey="pressure"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                  name="Peak Pressure"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Shot Details</CardTitle>
          <CardDescription>
            Individual shot data for {device.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shot ID</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Peak Pressure</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pressureData
                  .slice()
                  .reverse()
                  .slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage,
                  )
                  .map((shot) => (
                    <TableRow key={shot.shotId}>
                      <TableCell className="font-mono">{shot.shotId}</TableCell>
                      <TableCell>
                        {new Date(shot.date).toLocaleString()}
                      </TableCell>
                      <TableCell>{shot.pressure.toFixed(2)} bar</TableCell>
                      <TableCell>
                        {shot.pressure >= 6 && shot.pressure <= 9 ? (
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-800 border-green-200"
                          >
                            In Target Range
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-red-100 text-red-800 border-red-200"
                          >
                            Out of Range
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between px-4 py-2 border-t">
              <div className="flex items-center space-x-2">
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(Number(value));
                    setCurrentPage(1); // Reset to first page when changing items per page
                  }}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Per page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Showing{" "}
                  {Math.min(
                    (currentPage - 1) * itemsPerPage + 1,
                    pressureData.length,
                  )}{" "}
                  to {Math.min(currentPage * itemsPerPage, pressureData.length)}{" "}
                  of {pressureData.length} shots
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(
                        prev + 1,
                        Math.ceil(pressureData.length / itemsPerPage),
                      ),
                    )
                  }
                  disabled={
                    currentPage >= Math.ceil(pressureData.length / itemsPerPage)
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DynGGDeviceDetails;
