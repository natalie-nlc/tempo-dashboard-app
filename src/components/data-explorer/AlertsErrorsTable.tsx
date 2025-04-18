import React, { useState } from "react";
import {
  Table,
  TableBody,
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
  AlertTriangle,
  Info,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface AlertEvent {
  id: string;
  deviceId: string;
  deviceName: string;
  eventName: string;
  eventType: "warning" | "error" | "info";
  timestamp: string;
  description: string;
  resolved: boolean;
}

interface AlertsErrorsTableProps {
  data?: AlertEvent[];
  isLoading?: boolean;
}

const mockAlertData: AlertEvent[] = [
  {
    id: "alert-001",
    deviceId: "56098276526738773",
    deviceName: "Machine #A1201",
    eventName: "FullDripTray",
    eventType: "warning",
    timestamp: "2023-06-15 08:26:22",
    description: "The drip tray is full and needs to be emptied",
    resolved: false,
  },
  {
    id: "alert-002",
    deviceId: "783698v9876797",
    deviceName: "Machine #G3405",
    eventName: "FilterIsStale",
    eventType: "warning",
    timestamp: "2023-06-15 07:45:10",
    description: "Too much time has passed since grinding",
    resolved: true,
  },
  {
    id: "alert-003",
    deviceId: "30997187364972892",
    deviceName: "Machine #A1305",
    eventName: "PostInstallation",
    eventType: "info",
    timestamp: "2023-06-14 14:22:05",
    description: "Post installation is running after firmware update",
    resolved: false,
  },
  {
    id: "alert-004",
    deviceId: "982173273462374232",
    deviceName: "Machine #G2201",
    eventName: "PostInstallationFailure",
    eventType: "error",
    timestamp: "2023-06-14 11:18:33",
    description: "Post installation failed after firmware update",
    resolved: false,
  },
  {
    id: "alert-005",
    deviceId: "56098276526738773",
    deviceName: "Machine #A1201",
    eventName: "LowWaterLevel",
    eventType: "warning",
    timestamp: "2023-06-14 09:05:47",
    description: "Not enough water available for the requested operation",
    resolved: true,
  },
  {
    id: "alert-006",
    deviceId: "783698v9876797",
    deviceName: "Machine #G3405",
    eventName: "FilterIsDepleted",
    eventType: "warning",
    timestamp: "2023-06-13 16:42:19",
    description: "Filter has already been used for brewing",
    resolved: false,
  },
  {
    id: "alert-007",
    deviceId: "30997187364972892",
    deviceName: "Machine #A1305",
    eventName: "NoDripTray",
    eventType: "warning",
    timestamp: "2023-06-13 14:30:55",
    description: "There is no drip tray available",
    resolved: true,
  },
  {
    id: "alert-008",
    deviceId: "982173273462374232",
    deviceName: "Machine #G2201",
    eventName: "UpdateUnfeasible",
    eventType: "info",
    timestamp: "2023-06-12 10:15:22",
    description: "The update process was started but aborted. No changes made.",
    resolved: true,
  },
  {
    id: "alert-009",
    deviceId: "56098276526738773",
    deviceName: "Machine #A1201",
    eventName: "PreHeating",
    eventType: "info",
    timestamp: "2023-06-12 08:20:11",
    description: "Brew head is preheating to the target temperature",
    resolved: true,
  },
  {
    id: "alert-010",
    deviceId: "783698v9876797",
    deviceName: "Machine #G3405",
    eventName: "UpdateInstallable",
    eventType: "info",
    timestamp: "2023-06-11 15:10:33",
    description: "New firmware update bundle is available and installable",
    resolved: false,
  },
];

const AlertsErrorsTable: React.FC<AlertsErrorsTableProps> = ({
  data = mockAlertData,
  isLoading = false,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [timeRange, setTimeRange] = useState("24h");
  const [searchTerm, setSearchTerm] = useState("");
  const [showWarnings, setShowWarnings] = useState(true);
  const [showErrors, setShowErrors] = useState(true);
  const [showInfo, setShowInfo] = useState(true);
  const [showResolved, setShowResolved] = useState(false);
  const itemsPerPage = 10;

  // Filter data based on all active filters
  const filteredData = data.filter((item) => {
    // Search filter
    const searchMatch =
      searchTerm === "" ||
      item.deviceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Event type filters
    const typeMatch =
      (item.eventType === "warning" && showWarnings) ||
      (item.eventType === "error" && showErrors) ||
      (item.eventType === "info" && showInfo);

    // Resolved status filter
    const resolvedMatch = showResolved || !item.resolved;

    return searchMatch && typeMatch && resolvedMatch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const getEventTypeStyles = (type: string) => {
    switch (type) {
      case "warning":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "error":
        return "bg-red-50 text-red-700 border-red-200";
      case "info":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "";
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "warning":
      case "error":
        return <AlertTriangle className="h-4 w-4 mr-1" />;
      case "info":
        return <Info className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
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
        <h2 className="text-2xl font-bold mb-4">Alerts & Errors</h2>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1">
            <Input
              placeholder="Search by device, event name, or description"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex space-x-2">
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
        </div>

        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="warning-filter"
              checked={showWarnings}
              onCheckedChange={(checked) => setShowWarnings(!!checked)}
            />
            <label
              htmlFor="warning-filter"
              className="text-sm font-medium leading-none flex items-center"
            >
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200 mr-1">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Warning
              </span>
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="error-filter"
              checked={showErrors}
              onCheckedChange={(checked) => setShowErrors(!!checked)}
            />
            <label
              htmlFor="error-filter"
              className="text-sm font-medium leading-none flex items-center"
            >
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200 mr-1">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Error
              </span>
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="info-filter"
              checked={showInfo}
              onCheckedChange={(checked) => setShowInfo(!!checked)}
            />
            <label
              htmlFor="info-filter"
              className="text-sm font-medium leading-none flex items-center"
            >
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 mr-1">
                <Info className="h-3 w-3 mr-1" />
                Information
              </span>
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="resolved-filter"
              checked={showResolved}
              onCheckedChange={(checked) => setShowResolved(!!checked)}
            />
            <label
              htmlFor="resolved-filter"
              className="text-sm font-medium leading-none"
            >
              Show Resolved
            </label>
          </div>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Date</TableHead>
              <TableHead>Device</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="w-1/3">Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  No alerts or errors match the current filters.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell className="text-muted-foreground">
                    {alert.timestamp}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{alert.deviceName}</div>
                    <div className="text-xs text-muted-foreground">
                      {alert.deviceId}
                    </div>
                  </TableCell>
                  <TableCell>{alert.eventName}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getEventTypeStyles(alert.eventType)}
                    >
                      <div className="flex items-center">
                        {getEventTypeIcon(alert.eventType)}
                        <span>
                          {alert.eventType.charAt(0).toUpperCase() +
                            alert.eventType.slice(1)}
                        </span>
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>{alert.description}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        alert.resolved
                          ? "bg-gray-100"
                          : "bg-green-100 text-green-800"
                      }
                    >
                      {alert.resolved ? "Resolved" : "Active"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      disabled={alert.resolved}
                    >
                      {!alert.resolved ? "Resolve" : ""}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
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

export default AlertsErrorsTable;
