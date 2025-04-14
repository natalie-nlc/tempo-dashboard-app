import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion } from "framer-motion";

interface PerformanceChartsProps {
  data?: {
    usageData: Array<{
      date: string;
      brews: number;
      grinds: number;
    }>;
    deviceTypeData: Array<{
      name: string;
      value: number;
      color: string;
    }>;
    performanceData: Array<{
      metric: string;
      value: number;
      target: number;
    }>;
  };
}

const defaultData = {
  usageData: [
    { date: "Jan", brews: 65, grinds: 42 },
    { date: "Feb", brews: 59, grinds: 38 },
    { date: "Mar", brews: 80, grinds: 56 },
    { date: "Apr", brews: 81, grinds: 55 },
    { date: "May", brews: 56, grinds: 40 },
    { date: "Jun", brews: 55, grinds: 45 },
    { date: "Jul", brews: 40, grinds: 30 },
  ],
  deviceTypeData: [
    { name: "Espresso Machines", value: 65, color: "#8884d8" },
    { name: "Grinders", value: 35, color: "#82ca9d" },
  ],
  performanceData: [
    { metric: "Brew Time", value: 28, target: 30 },
    { metric: "Temperature", value: 92, target: 94 },
    { metric: "Pressure", value: 9, target: 9 },
    { metric: "Grind Size", value: 18, target: 20 },
    { metric: "Extraction", value: 22, target: 25 },
  ],
};

const PerformanceCharts: React.FC<PerformanceChartsProps> = ({
  data = defaultData,
}) => {
  const [timeRange, setTimeRange] = useState("7d");
  const [chartType, setChartType] = useState("usage");

  return (
    <div className="w-full space-y-4 bg-background">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Performance Analytics</h2>
        <div className="flex space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs
        defaultValue="usage"
        className="w-full"
        onValueChange={setChartType}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="usage">Usage Trends</TabsTrigger>
          <TabsTrigger value="devices">Device Distribution</TabsTrigger>
          <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="usage" className="mt-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Usage Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.usageData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="brews"
                        stroke="#8884d8"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="grinds"
                        stroke="#82ca9d"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="devices" className="mt-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Device Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.deviceTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {data.deviceTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="performance" className="mt-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="metric" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" name="Current" />
                      <Bar dataKey="target" fill="#82ca9d" name="Target" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceCharts;
