import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ActivityIcon,
  AlertTriangleIcon,
  CoffeeIcon,
  Settings2Icon,
} from "lucide-react";
import PerformanceCharts from "./PerformanceCharts";
import DailyShotsChart from "./DailyShotsChart";
import EspressoRangeChart from "./EspressoRangeChart";
import RoastRecipePieChart from "./RoastRecipePieChart";
import UsageHeatmap from "./UsageHeatmap";
import MachinePerformanceScatter from "./MachinePerformanceScatter";
import DynGGPerformanceChart from "./DynGGPerformanceChart";
import TimeRangeFilter, { TimeRangeValue } from "../common/TimeRangeFilter";

interface DashboardOverviewProps {
  shotAccuracy?: {
    value: string;
    description: string;
    change?: string;
  };
  activeDevices?: {
    value: string;
    description: string;
  };
  totalDevices?: {
    value: string;
    description: string;
  };
  totalBeansGround?: {
    value: string;
    description: string;
  };
  timeRange?: TimeRangeValue;
  onTimeRangeChange?: (value: TimeRangeValue) => void;
  dailyShotsData?: Array<{
    date: string;
    shots: number;
    devices: number;
  }>;
  espressoRangeData?: Array<{
    date: string;
    shots: number;
    deviceCount: number;
  }>;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  shotAccuracy,
  activeDevices,
  totalDevices,
  totalBeansGround,
  timeRange = "30d",
  onTimeRangeChange = () => {},
  dailyShotsData,
  espressoRangeData,
}) => {
  // Mock data for KPI cards
  const kpiData = [
    {
      title: "Active nunc. Devices",
      value: activeDevices?.value || "243",
      change: "+12%",
      trend: "up",
      timeRange: "last month",
      description: activeDevices?.description || "Connected and operational",
      icon: <ActivityIcon className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Total nunc. Devices",
      value: totalDevices?.value || "268",
      change: "+3.5%",
      trend: "up",
      timeRange: "last quarter",
      description: totalDevices?.description || "Across all locations",
      icon: <ActivityIcon className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Shot Accuracy",
      value: shotAccuracy?.value || "91.2%",
      change: shotAccuracy?.change || "+1.5%",
      trend: "up",
      timeRange: "last 24 hours",
      description:
        shotAccuracy?.description || "Peak pressure between 6-9 bars",
      icon: <Settings2Icon className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Total Shots Brewed",
      value: "24,568",
      change: "+5.2%",
      trend: "up",
      timeRange: "last week",
      description: "Cumulative espresso shots",
      icon: <CoffeeIcon className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Total Beans Ground",
      value: totalBeansGround?.value || "1,245 kg",
      change: "+8.7%",
      trend: "up",
      timeRange: "last 30 days",
      description: totalBeansGround?.description || "Coffee beans processed",
      icon: <CoffeeIcon className="h-4 w-4 text-muted-foreground" />,
    },
  ];

  // Removed mock data for usage chart as it's no longer needed

  return (
    <div className="flex flex-col gap-6 p-6 bg-background">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Ecosystem Dashboard
        </h1>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              {kpi.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs flex items-center">
                {kpi.trend === "up" ? (
                  <ArrowUpIcon className="mr-1 h-4 w-4 text-emerald-500" />
                ) : (
                  <ArrowDownIcon className="mr-1 h-4 w-4 text-rose-500" />
                )}
                <span
                  className={
                    kpi.trend === "up" ? "text-emerald-500" : "text-rose-500"
                  }
                >
                  {kpi.change}
                </span>
                <span className="ml-1 text-muted-foreground">
                  {kpi.timeRange || ""}
                </span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {kpi.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Daily Shots Chart (moved to replace Usage Trends) */}
        <Card className="col-span-4">
          <CardContent className="h-[300px]">
            <DailyShotsChart
              data={dailyShotsData}
              timeRange={timeRange}
              onTimeRangeChange={onTimeRangeChange}
            />
          </CardContent>
        </Card>

        {/* Roast & Recipe Distribution */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Roast & Recipe Distribution</CardTitle>
            <CardDescription>
              Popular roasts and recipes across all devices
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex flex-col">
            <RoastRecipePieChart
              timeRange={timeRange}
              onTimeRangeChange={onTimeRangeChange}
            />
          </CardContent>
        </Card>
      </div>

      {/* DynGG Performance Chart and Brew Activity Heatmap */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        <DynGGPerformanceChart
          timeRange={timeRange}
          onTimeRangeChange={onTimeRangeChange}
        />
        <UsageHeatmap
          timeRange={timeRange}
          onTimeRangeChange={onTimeRangeChange}
        />
      </div>

      {/* Espresso Range Chart and Machine Performance Scatter Plot */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        <EspressoRangeChart
          data={espressoRangeData}
          timeRange={timeRange}
          onTimeRangeChange={onTimeRangeChange}
        />
        <MachinePerformanceScatter
          timeRange={timeRange}
          onTimeRangeChange={onTimeRangeChange}
        />
      </div>

      {/* Performance Charts section removed */}
    </div>
  );
};

export default DashboardOverview;
