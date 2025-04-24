import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, BarChart, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Device, DeviceModel } from "@/types/device";
import { mockDevices } from "../devices/DeviceTable";

interface DynGGDeviceData {
  id: string;
  name: string;
  model: DeviceModel;
  avgPeakPressure: number;
  standardDeviation: number;
  totalShots: number;
  targetRangePercentage: number;
}

const generateMockDynGGData = (): DynGGDeviceData[] => {
  return mockDevices.map((device) => {
    // Generate random but plausible data for each device
    const avgPeakPressure = 6 + Math.random() * 4; // Between 6-10 bars
    const standardDeviation = 0.2 + Math.random() * 1.2; // Between 0.2-1.4
    const totalShots = Math.floor(100 + Math.random() * 900); // Between 100-1000 shots

    // Calculate percentage in target range (6-9 bars)
    // More likely to be in range for production models, less for prototypes
    let targetRangePercentage;
    if (device.model === "production") {
      targetRangePercentage = 70 + Math.random() * 25; // 70-95%
    } else if (device.model === "pre-series") {
      targetRangePercentage = 60 + Math.random() * 25; // 60-85%
    } else {
      targetRangePercentage = 40 + Math.random() * 35; // 40-75%
    }

    return {
      id: device.id,
      name: device.name,
      model: device.model,
      avgPeakPressure,
      standardDeviation,
      totalShots,
      targetRangePercentage,
    };
  });
};

type SortField =
  | "id"
  | "model"
  | "avgPeakPressure"
  | "standardDeviation"
  | "totalShots"
  | "targetRangePercentage";

const DynGGTable: React.FC = () => {
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [data] = useState<DynGGDeviceData[]>(generateMockDynGGData());
  const [minPressure, setMinPressure] = useState<string>("");
  const [maxPressure, setMaxPressure] = useState<string>("");
  const [filteredData, setFilteredData] = useState<DynGGDeviceData[]>(data);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  useEffect(() => {
    // Apply filters
    let result = [...data];

    // Filter by pressure range if values are provided
    if (minPressure !== "" || maxPressure !== "") {
      const min = minPressure !== "" ? parseFloat(minPressure) : 0;
      const max = maxPressure !== "" ? parseFloat(maxPressure) : 100; // Set a high upper bound

      result = result.filter((device) => {
        return device.avgPeakPressure >= min && device.avgPeakPressure <= max;
      });
    }

    setFilteredData(result);
  }, [data, minPressure, maxPressure]);

  const sortedData = [...filteredData].sort((a, b) => {
    let valueA = a[sortField];
    let valueB = b[sortField];

    if (typeof valueA === "string" && typeof valueB === "string") {
      return sortDirection === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    // For numeric values
    return sortDirection === "asc"
      ? (valueA as number) - (valueB as number)
      : (valueB as number) - (valueA as number);
  });

  const getModelBadgeStyle = (model: DeviceModel) => {
    switch (model) {
      case "prototype":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "pre-series":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "production":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTargetRangeStyle = (percentage: number) => {
    if (percentage >= 80) return "text-green-600 font-medium";
    if (percentage >= 60) return "text-amber-600 font-medium";
    return "text-red-600 font-medium";
  };

  const handleMinPressureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinPressure(e.target.value);
  };

  const handleMaxPressureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxPressure(e.target.value);
  };

  const clearFilters = () => {
    setMinPressure("");
    setMaxPressure("");
  };

  return (
    <div className="w-full">
      <div className="mb-4 p-4 rounded-md border bg-muted/10">
        <div className="flex items-center gap-2 mb-2">
          <Filter className="h-4 w-4" />
          <h3 className="text-sm font-medium">Filter by Peak Pressure</h3>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="min-pressure">Min Pressure (bar)</Label>
            <Input
              id="min-pressure"
              type="number"
              placeholder="Min"
              value={minPressure}
              onChange={handleMinPressureChange}
              className="w-24"
              min="0"
              step="0.1"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="max-pressure">Max Pressure (bar)</Label>
            <Input
              id="max-pressure"
              type="number"
              placeholder="Max"
              value={maxPressure}
              onChange={handleMaxPressureChange}
              className="w-24"
              min="0"
              step="0.1"
            />
          </div>
          <div className="flex items-end">
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort("id")}
              >
                <div className="flex items-center">
                  Device ID
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Device Name</TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort("model")}
              >
                <div className="flex items-center">
                  Model Type
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort("avgPeakPressure")}
              >
                <div className="flex items-center">
                  Avg Peak Pressure
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort("standardDeviation")}
              >
                <div className="flex items-center">
                  Std Deviation
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort("totalShots")}
              >
                <div className="flex items-center">
                  Total Shots
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort("targetRangePercentage")}
              >
                <div className="flex items-center">
                  % in Target Range
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((device) => (
              <TableRow key={device.id}>
                <TableCell className="font-mono">{device.id}</TableCell>
                <TableCell>{device.name}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getModelBadgeStyle(device.model)}
                  >
                    {device.model}
                  </Badge>
                </TableCell>
                <TableCell>{device.avgPeakPressure.toFixed(2)} bar</TableCell>
                <TableCell>{device.standardDeviation.toFixed(2)}</TableCell>
                <TableCell>{device.totalShots.toLocaleString()}</TableCell>
                <TableCell
                  className={getTargetRangeStyle(device.targetRangePercentage)}
                >
                  {device.targetRangePercentage.toFixed(1)}%
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() =>
                      window.open(`/labs/dyngg/${device.id}`, "_blank")
                    }
                  >
                    <BarChart className="h-4 w-4" />
                    <span>View Details</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DynGGTable;
