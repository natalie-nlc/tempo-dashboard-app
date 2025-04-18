import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  BarChart,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import FilterSection, { FilterValues } from "./FilterSection";

interface BrewEvent {
  eventId: string;
  deviceId: string;
  username: string;
  roastId: string;
  recipeId: string;
  timestamp: string;
  peakPressure: number;
}

interface DataTableProps {
  data?: BrewEvent[];
  isLoading?: boolean;
}

const mockData: BrewEvent[] = [
  {
    eventId: "3465921786324",
    deviceId: "56098276526738773",
    username: "Natalie",
    roastId: "004",
    recipeId: "21",
    timestamp: "2023-06-15 08:26:22",
    peakPressure: 6.2,
  },
  {
    eventId: "3465921786325",
    deviceId: "56098276526738773",
    username: "Natalie",
    roastId: "002",
    recipeId: "31",
    timestamp: "2023-06-15 07:45:10",
    peakPressure: 10.2,
  },
  {
    eventId: "3245645342578",
    deviceId: "783698v9876797",
    username: "Sneha",
    roastId: "004",
    recipeId: "21",
    timestamp: "2023-06-14 14:22:05",
    peakPressure: 7.9,
  },
  {
    eventId: "3465921786326",
    deviceId: "56098276526738773",
    username: "Natalie",
    roastId: "004",
    recipeId: "21",
    timestamp: "2023-06-14 11:18:33",
    peakPressure: 10.7,
  },
  {
    eventId: "3245645342579",
    deviceId: "783698v9876797",
    username: "Sneha",
    roastId: "001",
    recipeId: "32",
    timestamp: "2023-06-14 09:05:47",
    peakPressure: 11.2,
  },
  {
    eventId: "2359873947847",
    deviceId: "30997187364972892",
    username: "Milan",
    roastId: "001",
    recipeId: "32",
    timestamp: "2023-06-13 16:42:19",
    peakPressure: 8.8,
  },
  {
    eventId: "3465921786327",
    deviceId: "56098276526738773",
    username: "Natalie",
    roastId: "002",
    recipeId: "31",
    timestamp: "2023-06-13 14:30:55",
    peakPressure: 7.3,
  },
  {
    eventId: "3245645342580",
    deviceId: "783698v9876797",
    username: "Sneha",
    roastId: "003",
    recipeId: "28",
    timestamp: "2023-06-12 10:15:22",
    peakPressure: 6.9,
  },
  {
    eventId: "1298765432987",
    deviceId: "982173273462374232",
    username: "Herr Kaffee",
    roastId: "004",
    recipeId: "21",
    timestamp: "2023-06-12 08:20:11",
    peakPressure: 7.1,
  },
  {
    eventId: "1298765432988",
    deviceId: "982173273462374232",
    username: "Herr Kaffee",
    roastId: "004",
    recipeId: "21",
    timestamp: "2023-06-11 15:10:33",
    peakPressure: 5.9,
  },
];

const DataTable: React.FC<DataTableProps> = ({
  data = mockData,
  isLoading = false,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [timeRange, setTimeRange] = useState("24h");
  const [activeTab, setActiveTab] = useState("pairs"); // pairs, grind, brew
  const [activeFilters, setActiveFilters] = useState<FilterValues>({
    eventId: "",
    deviceId: "",
    username: "",
    roastId: "",
    recipeId: "",
  });
  const [pressureRange, setPressureRange] = useState<[number, number]>([
    0.5, 15.0,
  ]);
  const [sortColumn, setSortColumn] = useState<string | null>("timestamp");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const itemsPerPage = 10;

  // Apply filters when the Apply Filters button is clicked
  const handleApplyFilters = (filters: FilterValues) => {
    setActiveFilters(filters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Handle column sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Toggle direction if same column clicked
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new column and default to ascending
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Filter data based on all active filters
  const filteredData = data.filter((item) => {
    return (
      (activeFilters.eventId === "" ||
        item.eventId
          .toLowerCase()
          .includes(activeFilters.eventId.toLowerCase())) &&
      (activeFilters.deviceId === "" ||
        item.deviceId
          .toLowerCase()
          .includes(activeFilters.deviceId.toLowerCase())) &&
      (activeFilters.username === "" ||
        item.username
          .toLowerCase()
          .includes(activeFilters.username.toLowerCase())) &&
      (activeFilters.roastId === "" ||
        item.roastId
          .toLowerCase()
          .includes(activeFilters.roastId.toLowerCase())) &&
      (activeFilters.recipeId === "" ||
        item.recipeId
          .toLowerCase()
          .includes(activeFilters.recipeId.toLowerCase())) &&
      // Filter by pressure range
      item.peakPressure >= pressureRange[0] &&
      item.peakPressure <= pressureRange[1]
    );
  });

  // Sort the filtered data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;

    let valueA, valueB;

    switch (sortColumn) {
      case "eventId":
        valueA = a.eventId;
        valueB = b.eventId;
        break;
      case "deviceId":
        valueA = a.deviceId;
        valueB = b.deviceId;
        break;
      case "username":
        valueA = a.username;
        valueB = b.username;
        break;
      case "roastId":
        valueA = a.roastId;
        valueB = b.roastId;
        break;
      case "recipeId":
        valueA = a.recipeId;
        valueB = b.recipeId;
        break;
      case "timestamp":
        valueA = a.timestamp;
        valueB = b.timestamp;
        break;
      case "peakPressure":
        valueA = a.peakPressure;
        valueB = b.peakPressure;
        break;
      default:
        return 0;
    }

    // Handle numeric values
    if (sortColumn === "peakPressure") {
      return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
    }

    // Handle string values
    if (sortDirection === "asc") {
      return valueA.localeCompare(valueB);
    } else {
      return valueB.localeCompare(valueA);
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const getPressureColor = (pressure: number) => {
    if (pressure > 10) return "text-red-500";
    if (pressure > 8) return "text-orange-500";
    if (pressure > 7) return "text-green-500";
    return "text-blue-500";
  };

  if (isLoading) {
    return (
      <div className="w-full h-full bg-background p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
          <div className="h-60 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-background">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Brew & Grind Events</h2>
        <div className="flex space-x-2 mb-4">
          <Button
            variant={activeTab === "pairs" ? "default" : "outline"}
            className="w-1/3"
            onClick={() => setActiveTab("pairs")}
          >
            Grind & Brew Pairs
          </Button>
          <Button
            variant={activeTab === "grind" ? "default" : "outline"}
            className="w-1/3"
            onClick={() => setActiveTab("grind")}
          >
            All Grind Data
          </Button>
          <Button
            variant={activeTab === "brew" ? "default" : "outline"}
            className="w-1/3"
            onClick={() => setActiveTab("brew")}
          >
            All Brew Data
          </Button>
        </div>
      </div>

      <FilterSection
        onApplyFilters={handleApplyFilters}
        initialFilters={activeFilters}
      />

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30m">Past 30 minutes</SelectItem>
              <SelectItem value="1h">Past 1 hour</SelectItem>
              <SelectItem value="4h">Past 4 hours</SelectItem>
              <SelectItem value="8h">Past 8 hours</SelectItem>
              <SelectItem value="24h">Past 24 hours</SelectItem>
              <SelectItem value="3d">Past 3 days</SelectItem>
              <SelectItem value="7d">Past 7 days</SelectItem>
              <SelectItem value="30d">Past 30 days</SelectItem>
              <SelectItem value="custom">Custom Range...</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex flex-col space-y-1 min-w-[300px]">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Peak Pressure Range</span>
              <span className="text-sm text-muted-foreground">
                {pressureRange[0].toFixed(1)} - {pressureRange[1].toFixed(1)}{" "}
                bar
              </span>
            </div>
            <Slider
              defaultValue={[0.5, 15.0]}
              value={pressureRange}
              onValueChange={setPressureRange}
              min={0.5}
              max={15.0}
              step={0.1}
              className="w-full"
            />
          </div>

          {timeRange === "custom" && (
            <div className="flex items-center space-x-2 ml-2">
              <input
                type="datetime-local"
                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                onChange={(e) =>
                  console.log("Start date changed:", e.target.value)
                }
              />
              <span className="text-sm text-muted-foreground">to</span>
              <input
                type="datetime-local"
                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                onChange={(e) =>
                  console.log("End date changed:", e.target.value)
                }
              />
              <Button size="sm" variant="outline">
                Apply
              </Button>
            </div>
          )}
        </div>

        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Download className="h-4 w-4" />
          <span>Download</span>
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead
                onClick={() => handleSort("timestamp")}
                className="cursor-pointer hover:bg-muted"
              >
                <div className="flex items-center">
                  Grind Event Time
                  {sortColumn === "timestamp" ? (
                    sortDirection === "asc" ? (
                      <ArrowUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ArrowDown className="ml-1 h-4 w-4" />
                    )
                  ) : (
                    <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
                  )}
                </div>
              </TableHead>
              <TableHead
                onClick={() => handleSort("eventId")}
                className="cursor-pointer hover:bg-muted"
              >
                <div className="flex items-center">
                  Event ID
                  {sortColumn === "eventId" ? (
                    sortDirection === "asc" ? (
                      <ArrowUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ArrowDown className="ml-1 h-4 w-4" />
                    )
                  ) : (
                    <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
                  )}
                </div>
              </TableHead>
              <TableHead
                onClick={() => handleSort("deviceId")}
                className="cursor-pointer hover:bg-muted"
              >
                <div className="flex items-center">
                  Device ID
                  {sortColumn === "deviceId" ? (
                    sortDirection === "asc" ? (
                      <ArrowUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ArrowDown className="ml-1 h-4 w-4" />
                    )
                  ) : (
                    <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
                  )}
                </div>
              </TableHead>
              <TableHead
                onClick={() => handleSort("username")}
                className="cursor-pointer hover:bg-muted"
              >
                <div className="flex items-center">
                  Username
                  {sortColumn === "username" ? (
                    sortDirection === "asc" ? (
                      <ArrowUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ArrowDown className="ml-1 h-4 w-4" />
                    )
                  ) : (
                    <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
                  )}
                </div>
              </TableHead>
              <TableHead
                onClick={() => handleSort("roastId")}
                className="cursor-pointer hover:bg-muted"
              >
                <div className="flex items-center">
                  Roast ID
                  {sortColumn === "roastId" ? (
                    sortDirection === "asc" ? (
                      <ArrowUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ArrowDown className="ml-1 h-4 w-4" />
                    )
                  ) : (
                    <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
                  )}
                </div>
              </TableHead>
              <TableHead
                onClick={() => handleSort("recipeId")}
                className="cursor-pointer hover:bg-muted"
              >
                <div className="flex items-center">
                  Recipe ID
                  {sortColumn === "recipeId" ? (
                    sortDirection === "asc" ? (
                      <ArrowUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ArrowDown className="ml-1 h-4 w-4" />
                    )
                  ) : (
                    <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
                  )}
                </div>
              </TableHead>
              <TableHead
                onClick={() => handleSort("peakPressure")}
                className="cursor-pointer hover:bg-muted"
              >
                <div className="flex items-center">
                  Peak Pressure
                  {sortColumn === "peakPressure" ? (
                    sortDirection === "asc" ? (
                      <ArrowUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ArrowDown className="ml-1 h-4 w-4" />
                    )
                  ) : (
                    <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
                  )}
                </div>
              </TableHead>
              <TableHead>Chart</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((event, index) => (
              <TableRow key={index}>
                <TableCell className="text-muted-foreground">
                  {event.timestamp}
                </TableCell>
                <TableCell>{event.eventId}</TableCell>
                <TableCell>{event.deviceId}</TableCell>
                <TableCell>{event.username}</TableCell>
                <TableCell>{event.roastId}</TableCell>
                <TableCell>{event.recipeId}</TableCell>
                <TableCell className={getPressureColor(event.peakPressure)}>
                  {event.peakPressure}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <BarChart className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          {sortedData.length} results
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNumber = i + 1;
            return (
              <Button
                key={i}
                variant={currentPage === pageNumber ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(pageNumber)}
              >
                {pageNumber}
              </Button>
            );
          })}
          {totalPages > 5 && <span>...</span>}
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
