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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ActivityIcon,
  AlertTriangleIcon,
  CoffeeIcon,
  Settings2Icon,
} from "lucide-react";
import DeviceStatusGrid from "./DeviceStatusGrid";
import PerformanceCharts from "./PerformanceCharts";

interface DashboardOverviewProps {
  // Props can be added as needed
}

const DashboardOverview: React.FC<DashboardOverviewProps> = () => {
  // Mock data for KPI cards
  const kpiData = [
    {
      title: "Active Devices",
      value: "243",
      change: "+12%",
      trend: "up",
      description: "From last month",
      icon: <ActivityIcon className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Brews Today",
      value: "1,842",
      change: "+18%",
      trend: "up",
      description: "From yesterday",
      icon: <CoffeeIcon className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Maintenance Alerts",
      value: "12",
      change: "-3",
      trend: "down",
      description: "From last week",
      icon: <AlertTriangleIcon className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Avg. Performance",
      value: "94%",
      change: "+2%",
      trend: "up",
      description: "From last month",
      icon: <Settings2Icon className="h-4 w-4 text-muted-foreground" />,
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

  // Mock data for device types
  const deviceTypeData = [
    { name: "Espresso Machines", value: 156 },
    { name: "Grinders", value: 87 },
    { name: "Combo Units", value: 43 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

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
              <p className="text-xs text-muted-foreground flex items-center">
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
                <span className="ml-1">{kpi.description}</span>
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

        {/* Device Types Distribution */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Device Distribution</CardTitle>
            <CardDescription>Types of devices in the ecosystem</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deviceTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {deviceTypeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Device Status Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Device Status</CardTitle>
          <CardDescription>
            Current status of all connected devices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DeviceStatusGrid />
        </CardContent>
      </Card>

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
