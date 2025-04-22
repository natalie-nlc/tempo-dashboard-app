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
  X,
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
import LineGraph from "./LineGraph";

export interface BrewEvent {
  eventId: string;
  deviceId: string;
  username: string;
  roastId: string;
  recipeId: string;
  timestamp: string;
  peakPressure: number;
  consumableId: number;
  roastDate: string;
  consumableOpenDays: number;
  model: string;
  totalDoseWeight: number;
  brewDuration: number;
  brewerHeadTemp: number[];
  flowPump1: number[];
  fthHeater1: number[];
  pressureCircuit1: number[];
  volumePump1: number[];
}

interface DataTableProps {
  data?: BrewEvent[];
  isLoading?: boolean;
}

import { generateMockBrewEvents } from "@/utils/mockData";

const mockData: BrewEvent[] = generateMockBrewEvents();

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<BrewEvent | null>(null);
  const itemsPerPage = 10;

  const handleApplyFilters = (filters: FilterValues) => {
    setActiveFilters(filters);
    setCurrentPage(1);
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

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
      item.peakPressure >= pressureRange[0] &&
      item.peakPressure <= pressureRange[1]
    );
  });

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
      case "consumableId":
        valueA = a.consumableId;
        valueB = b.consumableId;
        break;
      case "roastDate":
        valueA = a.roastDate;
        valueB = b.roastDate;
        break;
      case "consumableOpenDays":
        valueA = a.consumableOpenDays;
        valueB = b.consumableOpenDays;
        break;
      case "model":
        valueA = a.model;
        valueB = b.model;
        break;
      case "totalDoseWeight":
        valueA = a.totalDoseWeight;
        valueB = b.totalDoseWeight;
        break;
      case "brewDuration":
        valueA = a.brewDuration;
        valueB = b.brewDuration;
        break;
      default:
        return 0;
    }

    if (
      sortColumn === "peakPressure" ||
      sortColumn === "consumableId" ||
      sortColumn === "consumableOpenDays" ||
      sortColumn === "totalDoseWeight" ||
      sortColumn === "brewDuration"
    ) {
      return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
    }

    if (sortDirection === "asc") {
      return valueA.localeCompare(valueB);
    } else {
      return valueB.localeCompare(valueA);
    }
  });

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

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="flex w-full bg-background">
      <div
        className={`${sidebarOpen ? "w-2/3" : "w-full"} p-6 transition-all duration-300`}
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Grind & Brew Events</h2>
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

          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </Button>
        </div>

        <div className="border rounded-md overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead
                  onClick={() => handleSort("timestamp")}
                  className="cursor-pointer hover:bg-muted whitespace-nowrap"
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
                <TableHead>Device</TableHead>
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
                <TableHead
                  onClick={() => handleSort("consumableId")}
                  className="cursor-pointer hover:bg-muted"
                >
                  <div className="flex items-center">
                    Consumable ID
                    {sortColumn === "consumableId" ? (
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
                  onClick={() => handleSort("roastDate")}
                  className="cursor-pointer hover:bg-muted"
                >
                  <div className="flex items-center">
                    Roast Date
                    {sortColumn === "roastDate" ? (
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
                  onClick={() => handleSort("consumableOpenDays")}
                  className="cursor-pointer hover:bg-muted"
                >
                  <div className="flex items-center">
                    Open Days
                    {sortColumn === "consumableOpenDays" ? (
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
                  onClick={() => handleSort("model")}
                  className="cursor-pointer hover:bg-muted"
                >
                  <div className="flex items-center">
                    Model
                    {sortColumn === "model" ? (
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
                  onClick={() => handleSort("totalDoseWeight")}
                  className="cursor-pointer hover:bg-muted"
                >
                  <div className="flex items-center">
                    Dose Weight (g)
                    {sortColumn === "totalDoseWeight" ? (
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
                  onClick={() => handleSort("brewDuration")}
                  className="cursor-pointer hover:bg-muted"
                >
                  <div className="flex items-center">
                    Brew Duration (s)
                    {sortColumn === "brewDuration" ? (
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
                  <TableCell className="text-muted-foreground whitespace-nowrap">
                    {event.timestamp}
                  </TableCell>
                  <TableCell>{event.eventId}</TableCell>
                  <TableCell>{event.deviceId}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() =>
                        window.open(`/devices/${event.deviceId}`, "_blank")
                      }
                    >
                      <span>Open Device</span>
                    </Button>
                  </TableCell>
                  <TableCell>{event.username}</TableCell>
                  <TableCell>{event.roastId}</TableCell>
                  <TableCell>{event.recipeId}</TableCell>
                  <TableCell className={getPressureColor(event.peakPressure)}>
                    {event.peakPressure}
                  </TableCell>
                  <TableCell>{event.consumableId}</TableCell>
                  <TableCell>{event.roastDate}</TableCell>
                  <TableCell>{event.consumableOpenDays}</TableCell>
                  <TableCell>{event.model}</TableCell>
                  <TableCell>{event.totalDoseWeight.toFixed(1)}</TableCell>
                  <TableCell>{event.brewDuration}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => {
                        setSelectedEvent(event);
                        setSidebarOpen(true);
                      }}
                    >
                      <BarChart className="h-4 w-4" />
                      <span>Open Charts</span>
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

      {/* Side panel for charts */}
      {sidebarOpen && (
        <div className="w-1/3 border-l border-border p-4 bg-background transition-all duration-300 overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Event Charts</h3>
            <Button variant="ghost" size="icon" onClick={handleCloseSidebar}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {selectedEvent && (
            <div className="space-y-4">
              <div className="p-4 border rounded-md bg-muted/20">
                <h4 className="font-medium mb-2">Event Details</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Event ID:</div>
                  <div className="font-medium">{selectedEvent.eventId}</div>
                  <div>Device ID:</div>
                  <div className="font-medium">{selectedEvent.deviceId}</div>
                  <div>Username:</div>
                  <div className="font-medium">{selectedEvent.username}</div>
                  <div>Timestamp:</div>
                  <div className="font-medium">{selectedEvent.timestamp}</div>
                  <div>Peak Pressure:</div>
                  <div className="font-medium">
                    {selectedEvent.peakPressure} bar
                  </div>
                  <div>Dose Weight:</div>
                  <div className="font-medium">
                    {selectedEvent.totalDoseWeight.toFixed(1)} g
                  </div>
                  <div>Brew Duration:</div>
                  <div className="font-medium">
                    {selectedEvent.brewDuration} s
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-md">
                <h4 className="font-medium mb-4">Sensor Data Over Time</h4>
                {selectedEvent && (
                  <LineGraph
                    data={[
                      {
                        name: "Brewer Head Temp",
                        color: "#ef4444",
                        data: selectedEvent.brewerHeadTemp.map(
                          (value, index) => ({
                            time: index,
                            value: value,
                          }),
                        ),
                      },
                      {
                        name: "Flow Pump 1",
                        color: "#3b82f6",
                        data: selectedEvent.flowPump1.map((value, index) => ({
                          time: index,
                          value: value,
                        })),
                      },
                      {
                        name: "FTH Heater 1",
                        color: "#f59e0b",
                        data: selectedEvent.fthHeater1.map((value, index) => ({
                          time: index,
                          value: value,
                        })),
                      },
                      {
                        name: "Pressure Circuit 1",
                        color: "#10b981",
                        data: selectedEvent.pressureCircuit1.map(
                          (value, index) => ({
                            time: index,
                            value: value,
                          }),
                        ),
                      },
                      {
                        name: "Volume Pump 1",
                        color: "#8b5cf6",
                        data: selectedEvent.volumePump1.map((value, index) => ({
                          time: index,
                          value: value,
                        })),
                      },
                    ]}
                    title="Sensor Readings"
                    xLabel="Time"
                    yLabel="Value"
                    height={300}
                    startTime={selectedEvent.timestamp}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DataTable;
