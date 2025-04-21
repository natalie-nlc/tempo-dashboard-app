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
    {
      title: "Maintenance Alerts",
      value: "12",
      change: "-3",
      trend: "down",
      timeRange: "last week",
      description: "Pending maintenance issues",
      icon: <AlertTriangleIcon className="h-4 w-4 text-muted-foreground" />,
    },
  ];

  // Mock data for usage chart
  const usageData = [
    { name: "12 AM", brews: 42, grinds: 38 },
    { name: "3 AM", brews: 18, grinds: 15 },
    { name: "6 AM", brews: 125, grinds: 118 },
    { name: "9 AM", brews: 357, grinds: 340 },
    { name: "12 PM", brews: 280, grinds: 265 },
    { name: "3 PM", brews: 252, grinds: 240 },
    { name: "6 PM", brews: 185, grinds: 170 },
    { name: "9 PM", brews: 98, grinds: 85 },
  ];

  return (
    <div className="flex flex-col gap-6 p-6 bg-background">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Ecosystem Dashboard
        </h1>
        <Tabs defaultValue="overview" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          </TabsList>
        </Tabs>
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
        {/* Usage Trends Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Usage Trends</CardTitle>
            <CardDescription>
              Hourly brew and grind activity across all devices
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={usageData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorBrews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorGrinds" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="brews"
                  stroke="#8884d8"
                  fillOpacity={1}
                  fill="url(#colorBrews)"
                />
                <Area
                  type="monotone"
                  dataKey="grinds"
                  stroke="#82ca9d"
                  fillOpacity={1}
                  fill="url(#colorGrinds)"
                />
              </AreaChart>
            </ResponsiveContainer>
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

      {/* DynGG Performance Chart */}
      <div className="grid gap-4 md:grid-cols-1">
        <DynGGPerformanceChart
          timeRange={timeRange}
          onTimeRangeChange={onTimeRangeChange}
        />
      </div>

      {/* Brew Activity Heatmap */}
      <div className="grid gap-4 md:grid-cols-1">
        <UsageHeatmap
          timeRange={timeRange}
          onTimeRangeChange={onTimeRangeChange}
        />
      </div>

      {/* Daily Shots Chart */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        <DailyShotsChart
          data={dailyShotsData}
          timeRange={timeRange}
          onTimeRangeChange={onTimeRangeChange}
        />
        <EspressoRangeChart
          data={espressoRangeData}
          timeRange={timeRange}
          onTimeRangeChange={onTimeRangeChange}
        />
      </div>

      {/* Machine Performance Scatter Plot */}
      <MachinePerformanceScatter
        timeRange={timeRange}
        onTimeRangeChange={onTimeRangeChange}
      />

      {/* Performance Charts */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>
            Key performance indicators across the ecosystem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PerformanceCharts />
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
