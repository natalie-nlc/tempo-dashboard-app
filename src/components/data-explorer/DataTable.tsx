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
import { ChevronLeft, ChevronRight, Download, BarChart } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
    timestamp: "2023-18-03 08:26:22",
    peakPressure: 6.2,
  },
  {
    eventId: "3465921786324",
    deviceId: "56098276526738773",
    username: "Natalie",
    roastId: "002",
    recipeId: "31",
    timestamp: "2023-18-03 08:26:22",
    peakPressure: 10.2,
  },
  {
    eventId: "3245645342578",
    deviceId: "783698v9876797",
    username: "Sneha",
    roastId: "004",
    recipeId: "21",
    timestamp: "2023-18-03 08:26:22",
    peakPressure: 7.9,
  },
  {
    eventId: "3465921786324",
    deviceId: "56098276526738773",
    username: "Natalie",
    roastId: "004",
    recipeId: "21",
    timestamp: "2023-18-03 08:26:22",
    peakPressure: 10.7,
  },
  {
    eventId: "3245645342578",
    deviceId: "783698v9876797",
    username: "Sneha",
    roastId: "001",
    recipeId: "32",
    timestamp: "2023-18-03 08:26:22",
    peakPressure: 11.2,
  },
  {
    eventId: "2359873947847",
    deviceId: "30997187364972892",
    username: "Milan",
    roastId: "001",
    recipeId: "32",
    timestamp: "2023-18-03 08:26:22",
    peakPressure: 8.8,
  },
  {
    eventId: "3465921786324",
    deviceId: "56098276526738773",
    username: "Natalie",
    roastId: "002",
    recipeId: "31",
    timestamp: "2023-18-03 08:26:22",
    peakPressure: 7.3,
  },
  {
    eventId: "3245645342578",
    deviceId: "783698v9876797",
    username: "Sneha",
    roastId: "003",
    recipeId: "28",
    timestamp: "2023-18-03 08:26:22",
    peakPressure: 6.9,
  },
  {
    eventId: "1298765432987",
    deviceId: "982173273462374232",
    username: "Herr Kaffee",
    roastId: "004",
    recipeId: "21",
    timestamp: "2023-18-03 08:26:22",
    peakPressure: 7.1,
  },
  {
    eventId: "1298765432987",
    deviceId: "982173273462374232",
    username: "Herr Kaffee",
    roastId: "004",
    recipeId: "21",
    timestamp: "2023-18-03 08:26:22",
    peakPressure: 5.9,
  },
];

const DataTable: React.FC<DataTableProps> = ({
  data = mockData,
  isLoading = false,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [timeRange, setTimeRange] = useState("24h");
  const [activeFilters, setActiveFilters] = useState<FilterValues>({
    eventId: "",
    deviceId: "",
    username: "",
    roastId: "",
    recipeId: "",
  });
  const itemsPerPage = 10;

  // Apply filters when the Apply Filters button is clicked
  const handleApplyFilters = (filters: FilterValues) => {
    setActiveFilters(filters);
    setCurrentPage(1); // Reset to first page when filters change
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
          .includes(activeFilters.recipeId.toLowerCase()))
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

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
          <Button variant="outline" className="w-1/3">
            Grind & Brew Pairs
          </Button>
          <Button variant="outline" className="w-1/3 bg-slate-300">
            All Grind Data
          </Button>
          <Button variant="outline" className="w-1/3 bg-slate-300">
            All Brew Data
          </Button>
        </div>
      </div>

      <FilterSection
        onApplyFilters={handleApplyFilters}
        initialFilters={activeFilters}
      />

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Last 24 hours" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
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
              <TableHead>Event ID</TableHead>
              <TableHead>Device ID</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Roast ID</TableHead>
              <TableHead>Recipe ID</TableHead>
              <TableHead>Grind Event Time</TableHead>
              <TableHead>Peak Pressure</TableHead>
              <TableHead>Chart</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((event, index) => (
              <TableRow key={index}>
                <TableCell>{event.eventId}</TableCell>
                <TableCell>{event.deviceId}</TableCell>
                <TableCell>{event.username}</TableCell>
                <TableCell>{event.roastId}</TableCell>
                <TableCell>{event.recipeId}</TableCell>
                <TableCell className="text-muted-foreground">
                  {event.timestamp}
                </TableCell>
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
          {filteredData.length} results
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
