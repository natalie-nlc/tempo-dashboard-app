import React, { useState } from "react";
import { TimeRangeValue } from "../common/TimeRangeFilter";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import AvgDoseDeviationChart from "./AvgDoseDeviationChart";
import MachineDowntimeChart from "./MachineDowntimeChart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EngineeringPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRangeValue>("30d");

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Engineering Metrics</h1>
          <p className="text-muted-foreground">
            Advanced metrics for engineering team to monitor and troubleshoot
            machine performance
          </p>
        </div>
        <div className="w-[180px]">
          <Select
            value={timeRange}
            onValueChange={(value) => setTimeRange(value as TimeRangeValue)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-muted/20 p-4 rounded-lg">
          <p className="text-sm font-medium text-muted-foreground">
            Average Dose Deviation
          </p>
          <h3 className="text-2xl font-bold mt-1">±0.24g</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Across all devices
          </p>
        </div>
        <div className="bg-muted/20 p-4 rounded-lg">
          <p className="text-sm font-medium text-muted-foreground">
            Machines Within Tolerance
          </p>
          <h3 className="text-2xl font-bold mt-1">92.7%</h3>
          <p className="text-xs text-muted-foreground mt-1">
            ±0.5g target tolerance
          </p>
        </div>
        <div className="bg-muted/20 p-4 rounded-lg">
          <p className="text-sm font-medium text-muted-foreground">
            Total Downtime
          </p>
          <h3 className="text-2xl font-bold mt-1">247.3 hours</h3>
          <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Dose Deviation Analysis</CardTitle>
            <CardDescription>
              Average deviation between target and actual dose over time
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <AvgDoseDeviationChart timeRange={timeRange} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Machine Downtime Analysis</CardTitle>
            <CardDescription>
              Total time machines spent offline/disconnected over time (need to
              add the ability to pick out individual machines -- maybe a data
              table / leaderboard would be good better for that)
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <MachineDowntimeChart timeRange={timeRange} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EngineeringPage;
