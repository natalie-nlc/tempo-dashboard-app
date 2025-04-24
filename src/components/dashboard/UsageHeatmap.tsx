import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ResponsiveContainer } from "recharts";
import TimeRangeFilter, { TimeRangeValue } from "../common/TimeRangeFilter";

interface UsageHeatmapProps {
  timeRange?: TimeRangeValue;
  onTimeRangeChange?: (value: TimeRangeValue) => void;
}

type HeatmapDataPoint = {
  dayOfWeek: number;
  hourOfDay: number;
  brews: number;
};

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const UsageHeatmap: React.FC<UsageHeatmapProps> = ({
  timeRange: externalTimeRange = "30d",
  onTimeRangeChange: externalOnTimeRangeChange,
}) => {
  // Use internal state if no external control is provided
  const [internalTimeRange, setInternalTimeRange] =
    useState<TimeRangeValue>("30d");

  // Use external time range if provided, otherwise use internal state
  const timeRange =
    externalTimeRange !== undefined ? externalTimeRange : internalTimeRange;

  const handleTimeRangeChange = (value: TimeRangeValue) => {
    // If external handler is provided, use it
    if (externalOnTimeRangeChange) {
      externalOnTimeRangeChange(value);
    } else {
      // Otherwise use internal state
      setInternalTimeRange(value);
    }
    console.log(`Usage Heatmap time range changed to ${value}`);
  };
  const [heatmapData, setHeatmapData] = useState<HeatmapDataPoint[]>([]);

  // Generate mock data for the heatmap
  useEffect(() => {
    const mockData: HeatmapDataPoint[] = [];

    // Generate data for each day and hour
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        // Create patterns in the data
        let brews = 0;

        // Weekday morning peak (7-9 AM)
        if (day < 5 && hour >= 7 && hour <= 9) {
          brews = Math.floor(Math.random() * 50) + 100;
        }
        // Weekday afternoon peak (12-2 PM)
        else if (day < 5 && hour >= 12 && hour <= 14) {
          brews = Math.floor(Math.random() * 40) + 80;
        }
        // Weekday evening peak (5-7 PM)
        else if (day < 5 && hour >= 17 && hour <= 19) {
          brews = Math.floor(Math.random() * 60) + 120;
        }
        // Weekend mid-morning peak (9-11 AM)
        else if (day >= 5 && hour >= 9 && hour <= 11) {
          brews = Math.floor(Math.random() * 70) + 140;
        }
        // Weekend afternoon (2-5 PM)
        else if (day >= 5 && hour >= 14 && hour <= 17) {
          brews = Math.floor(Math.random() * 50) + 100;
        }
        // Low activity periods
        else if (hour >= 0 && hour <= 5) {
          brews = Math.floor(Math.random() * 10) + 5;
        }
        // Other times - moderate activity
        else {
          brews = Math.floor(Math.random() * 30) + 30;
        }

        mockData.push({
          dayOfWeek: day,
          hourOfDay: hour,
          brews,
        });
      }
    }

    setHeatmapData(mockData);
  }, [timeRange]);

  // Function to get color based on brew count
  const getColor = (brews: number) => {
    if (brews < 20) return "#f7fbff";
    if (brews < 40) return "#deebf7";
    if (brews < 60) return "#c6dbef";
    if (brews < 80) return "#9ecae1";
    if (brews < 100) return "#6baed6";
    if (brews < 120) return "#4292c6";
    if (brews < 140) return "#2171b5";
    return "#084594";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Aggregate Brew Times by Day & Hour</CardTitle>
          <CardDescription>
            Brew activity by hour of day and day of week, with darker colors
            indicating higher brewing activity. Helps identify peak usage
            patterns.
          </CardDescription>
        </div>
        <TimeRangeFilter value={timeRange} onChange={handleTimeRangeChange} />
      </CardHeader>
      <CardContent className="h-[400px]">
        <div className="flex h-full w-full flex-col">
          <div className="flex items-center mb-2">
            <div className="w-[60px]"></div>
            {Array.from({ length: 24 }).map((_, hour) => (
              <div
                key={`hour-${hour}`}
                className="flex-1 text-center text-xs text-muted-foreground"
              >
                {hour}
              </div>
            ))}
          </div>

          <div className="flex-1 flex flex-col">
            {daysOfWeek.map((day, dayIndex) => (
              <div key={day} className="flex flex-1 items-center">
                <div className="w-[60px] text-xs text-muted-foreground">
                  {day}
                </div>
                <div className="flex-1 flex">
                  {Array.from({ length: 24 }).map((_, hour) => {
                    const dataPoint = heatmapData.find(
                      (d) => d.dayOfWeek === dayIndex && d.hourOfDay === hour,
                    );
                    const brews = dataPoint?.brews || 0;
                    return (
                      <div
                        key={`${day}-${hour}`}
                        className="flex-1 m-[1px] rounded-sm flex items-center justify-center"
                        style={{
                          backgroundColor: getColor(brews),
                          height: "100%",
                        }}
                        title={`${day} ${hour}:00 - ${brews} brews`}
                      >
                        <span className="text-[8px] text-muted-foreground">
                          {brews > 0 && brews}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-center">
            <div className="flex items-center">
              <span className="text-xs text-muted-foreground mr-2">Brews:</span>
              <div className="flex">
                {[
                  "0-20",
                  "20-40",
                  "40-60",
                  "60-80",
                  "80-100",
                  "100-120",
                  "120-140",
                  "140+",
                ].map((range, i) => (
                  <div key={range} className="flex flex-col items-center mx-1">
                    <div
                      className="w-4 h-4"
                      style={{ backgroundColor: getColor(i * 20 + 10) }}
                    ></div>
                    <span className="text-[8px] text-muted-foreground">
                      {range}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsageHeatmap;
