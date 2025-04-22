import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Device, DeviceStatus, DeviceModel } from "@/types/device";
// Removed Coffee and Cog imports as they're no longer needed

interface DeviceTableProps {
  devices?: Device[];
  isLoading?: boolean;
}

const DeviceTable: React.FC<DeviceTableProps> = ({
  devices = mockDevices,
  isLoading = false,
}) => {
  const navigate = useNavigate();

  const handleDeviceClick = (deviceId: string) => {
    navigate(`/devices/${deviceId}`);
  };
  const [filters, setFilters] = useState({
    search: "",
    status: "all" as DeviceStatus | "all",
    model: "all" as DeviceModel | "all",
  });

  // Filter devices based on search term and filters
  const filteredDevices = devices.filter((device) => {
    // Search filter (device ID, name, or owner)
    const searchMatch =
      filters.search === "" ||
      device.id.toLowerCase().includes(filters.search.toLowerCase()) ||
      device.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      (device.owner?.toLowerCase() || "").includes(
        filters.search.toLowerCase(),
      ) ||
      device.serialNumber.toLowerCase().includes(filters.search.toLowerCase());

    // Status filter
    const statusMatch =
      filters.status === "all" || device.status === filters.status;

    // Model filter
    const modelMatch =
      filters.model === "all" || device.model === filters.model;

    return searchMatch && statusMatch && modelMatch;
  });

  if (isLoading) {
    return <div className="p-4">Loading device data...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by Device ID, Name, or Owner"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            value={filters.status}
            onValueChange={(value) =>
              setFilters({ ...filters, status: value as DeviceStatus | "all" })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-48">
          <Select
            value={filters.model}
            onValueChange={(value) =>
              setFilters({ ...filters, model: value as DeviceModel | "all" })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by Model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Models</SelectItem>
              <SelectItem value="prototype">Prototype</SelectItem>
              <SelectItem value="pre-series">Pre-Series</SelectItem>
              <SelectItem value="production">Production</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Device ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Last Connected</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDevices.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  No devices found matching the current filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredDevices.map((device) => (
                <TableRow
                  key={device.id}
                  onClick={() => handleDeviceClick(device.id)}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <TableCell className="font-mono text-xs">
                    {device.serialNumber}
                  </TableCell>
                  <TableCell>{device.name}</TableCell>
                  <TableCell>
                    <div
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        device.status === "online"
                          ? "bg-green-100 text-green-800"
                          : device.status === "warning"
                            ? "bg-red-100 text-red-800"
                            : device.status === "maintenance"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {device.status}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        device.model === "prototype"
                          ? "bg-purple-100 text-purple-800"
                          : device.model === "pre-series"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {device.model}
                    </div>
                  </TableCell>
                  <TableCell>{device.location}</TableCell>
                  <TableCell>{device.owner || "—"}</TableCell>
                  <TableCell>
                    {new Date(device.lastConnected).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DeviceTable;

// Mock data for development
// This is defined outside the component to avoid HMR issues
export const mockDevices: Device[] = [
  {
    id: "1",
    name: "Machine #A1201",
    status: "online",
    model: "production",
    location: "Café Zentral, Berlin",
    coordinates: [52.52, 13.405], // Berlin
    lastConnected: "2023-06-15T08:30:00Z",
    owner: "cafe_zentral",
    serialNumber: "BR-2023-1201",
    firmwareVersion: "1.2.5",
  },
  {
    id: "2",
    name: "Machine #G3405",
    status: "warning",
    model: "production",
    location: "Kaffeehaus, Munich",
    coordinates: [48.1351, 11.582], // Munich
    lastConnected: "2023-06-14T17:45:00Z",
    owner: "kaffeehaus_munich",
    serialNumber: "GR-2023-3405",
    firmwareVersion: "1.1.8",
  },
  {
    id: "3",
    name: "Machine #A1305",
    status: "maintenance",
    model: "prototype",
    location: "Espresso Bar, Hamburg",
    coordinates: [53.5511, 9.9937], // Hamburg
    lastConnected: "2023-06-10T09:15:00Z",
    owner: "espresso_lab",
    serialNumber: "BR-PROTO-1305",
    firmwareVersion: "0.9.2",
  },
  {
    id: "4",
    name: "Machine #G2201",
    status: "offline",
    model: "pre-series",
    location: "Kaffeelabor, Zurich",
    coordinates: [47.3769, 8.5417], // Zurich
    lastConnected: "2023-06-01T14:20:00Z",
    owner: "kaffeelabor_zurich",
    serialNumber: "GR-PRE-2201",
    firmwareVersion: "0.8.5",
  },
  {
    id: "5",
    name: "Machine #A1422",
    status: "online",
    model: "production",
    location: "Kaffeewerk, Frankfurt",
    coordinates: [50.1109, 8.6821], // Frankfurt
    lastConnected: "2023-06-15T10:05:00Z",
    owner: "kaffeewerk_ffm",
    serialNumber: "BR-2023-1422",
    firmwareVersion: "1.2.5",
  },
  {
    id: "6",
    name: "Machine #G4102",
    status: "online",
    model: "prototype",
    location: "Kaffeestube, Geneva",
    coordinates: [46.2044, 6.1432], // Geneva
    lastConnected: "2023-06-15T09:45:00Z",
    owner: "kaffeestube_geneva",
    serialNumber: "GR-PROTO-4102",
    firmwareVersion: "0.9.5",
  },
  {
    id: "7",
    name: "Machine #A1508",
    status: "warning",
    model: "pre-series",
    location: "Kaffeehaus, Cologne",
    coordinates: [50.9375, 6.9603], // Cologne
    lastConnected: "2023-06-14T16:30:00Z",
    owner: "kaffeehaus_cologne",
    serialNumber: "BR-PRE-1508",
    firmwareVersion: "1.0.2",
  },
  {
    id: "8",
    name: "Machine #G3901",
    status: "maintenance",
    model: "pre-series",
    location: "Kaffeelabor, Bern",
    coordinates: [46.948, 7.4474], // Bern
    lastConnected: "2023-06-12T11:20:00Z",
    owner: "kaffeelabor_bern",
    serialNumber: "GR-PRE-3901",
    firmwareVersion: "1.0.1",
  },
];
