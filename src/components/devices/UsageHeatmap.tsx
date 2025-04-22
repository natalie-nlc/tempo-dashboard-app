import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { TimeRangeValue } from "@/components/common/TimeRangeFilter";

interface UsageHeatmapProps {
  deviceId?: string;
  isLoading?: boolean;
  timeRange?: TimeRangeValue;
}

const UsageHeatmap: React.FC<UsageHeatmapProps> = ({
  deviceId = "1",
  isLoading = false,
}) => {
  // Generate random data for the heatmap based on deviceId to ensure consistency
  const generateHeatmapData = () => {
    // Seed the random generator with the deviceId to get consistent results
    const seed = parseInt(deviceId) || 1;
    const random = (min: number, max: number) => {
      const x = Math.sin(seed * 9999 + 1) * 10000;
      const r = x - Math.floor(x);
      return Math.floor(r * (max - min + 1) + min);
    };

    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    const hours = [
      "6AM",
      "7AM",
      "8AM",
      "9AM",
      "10AM",
      "11AM",
      "12PM",
      "1PM",
      "2PM",
      "3PM",
      "4PM",
      "5PM",
      "6PM",
      "7PM",
      "8PM",
    ];

    const data: { day: string; hour: string; value: number }[] = [];

    days.forEach((day, dayIndex) => {
      hours.forEach((hour, hourIndex) => {
        // Create patterns based on device ID and time
        let baseValue = 0;

        // Morning peak (7-9AM) on weekdays
        if (hourIndex >= 1 && hourIndex <= 3 && dayIndex < 5) {
          baseValue = random(3, 8);
        }
        // Lunch peak (12-2PM) on weekdays
        else if (hourIndex >= 6 && hourIndex <= 8 && dayIndex < 5) {
          baseValue = random(2, 6);
        }
        // Afternoon peak (3-5PM) on weekdays
        else if (hourIndex >= 9 && hourIndex <= 11 && dayIndex < 5) {
          baseValue = random(1, 5);
        }
        // Weekend patterns - more spread throughout the day
        else if (dayIndex >= 5) {
          if (hourIndex >= 2 && hourIndex <= 12) {
            baseValue = random(1, 4);
          }
        }
        // Low usage times
        else {
          baseValue = random(0, 2);
        }

        // Add some device-specific patterns
        let deviceFactor = 1;
        if (deviceId === "1" || deviceId === "3" || deviceId === "7") {
          deviceFactor = 1.2; // Busier machines
        } else if (deviceId === "4" || deviceId === "6") {
          deviceFactor = 0.7; // Less busy machines
        }

        const value = Math.min(
          10,
          Math.max(0, Math.round(baseValue * deviceFactor)),
        );
        data.push({ day, hour, value });
      });
    });

    return data;
  };

  const heatmapData = generateHeatmapData();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Usage Heatmap</CardTitle>
          <CardDescription>Loading data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] animate-pulse bg-gray-200 rounded-md"></div>
        </CardContent>
      </Card>
    );
  }

  // Color scale for the heatmap
  const getColor = (value: number) => {
    if (value === 0) return "bg-gray-100";
    if (value <= 2) return "bg-blue-100";
    if (value <= 4) return "bg-blue-200";
    if (value <= 6) return "bg-blue-300";
    if (value <= 8) return "bg-blue-400";
    return "bg-blue-500";
  };

  // Group data by day
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const hours = [
    "6AM",
    "7AM",
    "8AM",
    "9AM",
    "10AM",
    "11AM",
    "12PM",
    "1PM",
    "2PM",
    "3PM",
    "4PM",
    "5PM",
    "6PM",
    "7PM",
    "8PM",
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage Heatmap</CardTitle>
        <CardDescription>
          Average number of espresso shots pulled by day and time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Hours header */}
            <div className="flex">
              <div className="w-20"></div> {/* Empty cell for day labels */}
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="flex-1 text-center text-xs font-medium text-gray-500"
                >
                  {hour}
                </div>
              ))}
            </div>

            {/* Heatmap grid */}
            {days.map((day) => (
              <div key={day} className="flex">
                <div className="w-20 flex items-center text-xs font-medium text-gray-500">
                  {day}
                </div>
                {hours.map((hour) => {
                  const cell = heatmapData.find(
                    (d) => d.day === day && d.hour === hour,
                  );
                  const value = cell ? cell.value : 0;
                  return (
                    <div
                      key={`${day}-${hour}`}
                      className={`flex-1 h-8 ${getColor(value)} border border-white flex items-center justify-center text-xs font-medium`}
                      title={`${day} at ${hour}: ${value} shots`}
                    >
                      {value > 0 ? value : ""}
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Legend */}
            <div className="mt-4 flex items-center justify-end">
              <div className="text-xs text-gray-500 mr-2">Shots:</div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-100 border border-white mr-1"></div>
                <span className="text-xs mr-2">0</span>
                <div className="w-4 h-4 bg-blue-100 border border-white mr-1"></div>
                <span className="text-xs mr-2">1-2</span>
                <div className="w-4 h-4 bg-blue-200 border border-white mr-1"></div>
                <span className="text-xs mr-2">3-4</span>
                <div className="w-4 h-4 bg-blue-300 border border-white mr-1"></div>
                <span className="text-xs mr-2">5-6</span>
                <div className="w-4 h-4 bg-blue-400 border border-white mr-1"></div>
                <span className="text-xs mr-2">7-8</span>
                <div className="w-4 h-4 bg-blue-500 border border-white mr-1"></div>
                <span className="text-xs">9+</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsageHeatmap;
