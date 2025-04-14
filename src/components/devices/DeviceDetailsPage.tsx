import React, { useEffect, useState, useId } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Device } from "@/types/device";
import UserInsightsSection from "./UserInsightsSection";
import MachineUsageByTime from "./MachineUsageByTime";
import MachineUsageFrequency from "./MachineUsageFrequency";
import CoffeePreferencePieChart from "./CoffeePreferencePieChart";
import UsageHeatmap from "./UsageHeatmap";

// Import mock data for development
import { mockDevices } from "./DeviceTable";

const DeviceDetailsPage: React.FC = () => {
  const { deviceId } = useParams<{ deviceId: string }>();
  const [device, setDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);
  const [showWarnings, setShowWarnings] = useState(true);
  const [showInformation, setShowInformation] = useState(true);
  const switchId = useId();

  useEffect(() => {
    // In a real application, this would be an API call
    // For now, we'll use the mock data
    const fetchDevice = () => {
      setLoading(true);
      try {
        // Find the device in our mock data
        const foundDevice = mockDevices.find((d) => d.id === deviceId);
        if (foundDevice) {
          setDevice(foundDevice);
        }
      } catch (error) {
        console.error("Error fetching device:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDevice();
  }, [deviceId]);

  if (loading) {
    return <div className="p-6">Loading device details...</div>;
  }

  if (!device) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Device not found</h1>
        <Link to="/devices">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Devices
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/devices">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Devices
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Device Details</h1>
        </div>
        <div className="text-sm text-muted-foreground">{device.name}</div>
      </div>

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="usage">Usage Insights</TabsTrigger>
          <TabsTrigger value="admin">Admin Options</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Device Stats</CardTitle>
                  <CardDescription>
                    Key performance metrics for this device
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-muted/20 p-4 rounded-lg">
                      <p className="text-sm font-medium text-muted-foreground">
                        Total Brews
                      </p>
                      <h3 className="text-2xl font-bold mt-1">1,248</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        +124 from last month
                      </p>
                    </div>
                    <div className="bg-muted/20 p-4 rounded-lg">
                      <p className="text-sm font-medium text-muted-foreground">
                        Avg. Daily Brews
                      </p>
                      <h3 className="text-2xl font-bold mt-1">
                        {device.id === "1"
                          ? "5"
                          : device.id === "2"
                            ? "3"
                            : device.id === "3"
                              ? "6"
                              : device.id === "4"
                                ? "2"
                                : device.id === "5"
                                  ? "4"
                                  : device.id === "6"
                                    ? "1"
                                    : device.id === "7"
                                      ? "5"
                                      : device.id === "8"
                                        ? "3"
                                        : "4"}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Last 7 days
                      </p>
                    </div>
                    <div className="bg-muted/20 p-4 rounded-lg">
                      <p className="text-sm font-medium text-muted-foreground">
                        Beans Ground
                      </p>
                      <h3 className="text-2xl font-bold mt-1">
                        {device.id === "1"
                          ? "12.4"
                          : device.id === "2"
                            ? "8.7"
                            : device.id === "3"
                              ? "15.2"
                              : device.id === "4"
                                ? "5.3"
                                : device.id === "5"
                                  ? "10.1"
                                  : device.id === "6"
                                    ? "3.8"
                                    : device.id === "7"
                                      ? "11.5"
                                      : device.id === "8"
                                        ? "7.6"
                                        : "9.2"}{" "}
                        kg
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Total usage
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Alerts & Errors</CardTitle>
                  <CardDescription>
                    Recent alerts and errors from this device
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="warning-filter"
                          defaultChecked
                          onCheckedChange={(checked) => {
                            setShowWarnings(checked === true);
                          }}
                        />
                        <label
                          htmlFor="warning-filter"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Warning
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="info-filter"
                          defaultChecked
                          onCheckedChange={(checked) => {
                            setShowInformation(checked === true);
                          }}
                        />
                        <label
                          htmlFor="info-filter"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Information
                        </label>
                      </div>
                    </div>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Event Name</TableHead>
                            <TableHead>Event Type</TableHead>
                            <TableHead>Description</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {device.id === "1" && (
                            <>
                              <TableRow
                                className={!showInformation ? "hidden" : ""}
                              >
                                <TableCell>
                                  {new Date().toLocaleString()}
                                </TableCell>
                                <TableCell>PreHeating</TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className="bg-blue-50 text-blue-700 border-blue-200"
                                  >
                                    Information
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  brew head is preheating to the target
                                  temperature
                                </TableCell>
                              </TableRow>
                              <TableRow
                                className={!showInformation ? "hidden" : ""}
                              >
                                <TableCell>
                                  {new Date(
                                    Date.now() - 86400000,
                                  ).toLocaleString()}
                                </TableCell>
                                <TableCell>UpdateInstallable</TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className="bg-blue-50 text-blue-700 border-blue-200"
                                  >
                                    Information
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  new firmware update bundle is available and
                                  installable
                                </TableCell>
                              </TableRow>
                            </>
                          )}

                          {device.id === "2" && (
                            <>
                              <TableRow
                                className={!showWarnings ? "hidden" : ""}
                              >
                                <TableCell>
                                  {new Date().toLocaleString()}
                                </TableCell>
                                <TableCell>FullDripTray</TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className="bg-yellow-50 text-yellow-700 border-yellow-200"
                                  >
                                    Warning
                                  </Badge>
                                </TableCell>
                                <TableCell>the driptray is full</TableCell>
                              </TableRow>
                              <TableRow
                                className={!showWarnings ? "hidden" : ""}
                              >
                                <TableCell>
                                  {new Date(
                                    Date.now() - 3600000,
                                  ).toLocaleString()}
                                </TableCell>
                                <TableCell>FilterIsStale</TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className="bg-yellow-50 text-yellow-700 border-yellow-200"
                                  >
                                    Warning
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  too much time has passed since grinding
                                </TableCell>
                              </TableRow>
                            </>
                          )}

                          {device.id === "3" && (
                            <>
                              <TableRow
                                className={!showWarnings ? "hidden" : ""}
                              >
                                <TableCell>
                                  {new Date().toLocaleString()}
                                </TableCell>
                                <TableCell>PostInstallation</TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className="bg-yellow-50 text-yellow-700 border-yellow-200"
                                  >
                                    Warning
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  post installation is running. A post
                                  installation is performed after the reboot
                                  after an update.
                                </TableCell>
                              </TableRow>
                            </>
                          )}

                          {device.id === "4" && (
                            <>
                              <TableRow
                                className={!showInformation ? "hidden" : ""}
                              >
                                <TableCell>
                                  {new Date(
                                    Date.now() - 172800000,
                                  ).toLocaleString()}
                                </TableCell>
                                <TableCell>Rollback</TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className="bg-blue-50 text-blue-700 border-blue-200"
                                  >
                                    Information
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  a rollback was performed because an update
                                  failed
                                </TableCell>
                              </TableRow>
                              <TableRow
                                className={!showWarnings ? "hidden" : ""}
                              >
                                <TableCell>
                                  {new Date(
                                    Date.now() - 172900000,
                                  ).toLocaleString()}
                                </TableCell>
                                <TableCell>PostInstallationFailure</TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className="bg-yellow-50 text-yellow-700 border-yellow-200"
                                  >
                                    Warning
                                  </Badge>
                                </TableCell>
                                <TableCell>post installation failed</TableCell>
                              </TableRow>
                            </>
                          )}

                          {device.id === "5" && (
                            <>
                              <TableRow
                                className={!showInformation ? "hidden" : ""}
                              >
                                <TableCell>
                                  {new Date(
                                    Date.now() - 1800000,
                                  ).toLocaleString()}
                                </TableCell>
                                <TableCell>PreHeating</TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className="bg-blue-50 text-blue-700 border-blue-200"
                                  >
                                    Information
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  brew head is preheating to the target
                                  temperature
                                </TableCell>
                              </TableRow>
                            </>
                          )}

                          {device.id === "6" && (
                            <>
                              <TableRow
                                className={!showInformation ? "hidden" : ""}
                              >
                                <TableCell>
                                  {new Date(
                                    Date.now() - 43200000,
                                  ).toLocaleString()}
                                </TableCell>
                                <TableCell>UpdateInstallable</TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className="bg-blue-50 text-blue-700 border-blue-200"
                                  >
                                    Information
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  new firmware update bundle is available and
                                  installable
                                </TableCell>
                              </TableRow>
                            </>
                          )}

                          {device.id === "7" && (
                            <>
                              <TableRow
                                className={!showWarnings ? "hidden" : ""}
                              >
                                <TableCell>
                                  {new Date().toLocaleString()}
                                </TableCell>
                                <TableCell>LowWaterLevel</TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className="bg-yellow-50 text-yellow-700 border-yellow-200"
                                  >
                                    Warning
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  not enough water available for the requested
                                  operation
                                </TableCell>
                              </TableRow>
                              <TableRow
                                className={!showWarnings ? "hidden" : ""}
                              >
                                <TableCell>
                                  {new Date(
                                    Date.now() - 7200000,
                                  ).toLocaleString()}
                                </TableCell>
                                <TableCell>FilterIsDepleted</TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className="bg-yellow-50 text-yellow-700 border-yellow-200"
                                  >
                                    Warning
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  filter has already been used for brewing
                                </TableCell>
                              </TableRow>
                            </>
                          )}

                          {device.id === "8" && (
                            <>
                              <TableRow
                                className={!showWarnings ? "hidden" : ""}
                              >
                                <TableCell>
                                  {new Date(
                                    Date.now() - 10800000,
                                  ).toLocaleString()}
                                </TableCell>
                                <TableCell>NoDripTray</TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className="bg-yellow-50 text-yellow-700 border-yellow-200"
                                  >
                                    Warning
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  there is either no driptray available
                                </TableCell>
                              </TableRow>
                              <TableRow
                                className={!showInformation ? "hidden" : ""}
                              >
                                <TableCell>
                                  {new Date(
                                    Date.now() - 259200000,
                                  ).toLocaleString()}
                                </TableCell>
                                <TableCell>UpdateUnfeasible</TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className="bg-blue-50 text-blue-700 border-blue-200"
                                  >
                                    Information
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  The update process was started but aborted.
                                  The installed software components were not
                                  changed.
                                </TableCell>
                              </TableRow>
                              <TableRow
                                className={!showWarnings ? "hidden" : ""}
                              >
                                <TableCell>
                                  {new Date(
                                    Date.now() - 259300000,
                                  ).toLocaleString()}
                                </TableCell>
                                <TableCell>PostInstallationFailure</TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className="bg-yellow-50 text-yellow-700 border-yellow-200"
                                  >
                                    Warning
                                  </Badge>
                                </TableCell>
                                <TableCell>post installation failed</TableCell>
                              </TableRow>
                            </>
                          )}

                          {(!device.id.match(/^[1-8]$/) ||
                            (!showWarnings && !showInformation)) && (
                            <TableRow>
                              <TableCell
                                colSpan={4}
                                className="text-center text-muted-foreground"
                              >
                                {!showWarnings && !showInformation
                                  ? "No alerts or errors match the current filters"
                                  : "No alerts or errors for this device"}
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Device Information</CardTitle>
                  <CardDescription>
                    Comprehensive information about this device
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Device ID / Serial Number
                      </p>
                      <p className="font-mono">{device.serialNumber}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Status
                      </p>
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
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Customer Name
                      </p>
                      <p>{device.owner || "—"}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Location
                      </p>
                      <p>{device.location}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">Model</p>
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
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Purchase Date
                      </p>
                      <p>January 15, 2023</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Ship Date
                      </p>
                      <p>January 20, 2023</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Last Connected
                      </p>
                      <p>{new Date(device.lastConnected).toLocaleString()}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Firmware Version
                      </p>
                      <p className="font-mono">{device.firmwareVersion}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Coordinates
                      </p>
                      <p className="font-mono">
                        {device.coordinates[0]}, {device.coordinates[1]}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="usage" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MachineUsageByTime />
            <MachineUsageFrequency />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-10 gap-6">
            <div className="md:col-span-7">
              <UsageHeatmap deviceId={deviceId} />
            </div>
            <div className="md:col-span-3">
              <CoffeePreferencePieChart />
            </div>
          </div>

          <UserInsightsSection />
        </TabsContent>

        <TabsContent value="admin" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Administrative Controls</CardTitle>
              <CardDescription>
                Device management and configuration options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      Toggle DynGG On/Off
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id={switchId}
                      defaultChecked
                      onCheckedChange={(checked) => {
                        const statusText = document.getElementById(
                          `${switchId}-status`,
                        );
                        if (statusText) {
                          statusText.textContent = checked
                            ? "DynGG on"
                            : "DynGG off";
                        }
                      }}
                    />
                    <span
                      id={`${switchId}-status`}
                      className="text-sm text-muted-foreground"
                    >
                      DynGG on
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      Prompt to update device
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      Send email
                    </Button>
                    <Button variant="outline" size="sm">
                      Send popup on display
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        Inject Events for Troubleshooting
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-md p-4 space-y-3 bg-muted/20">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Roast ID</label>
                      <Select defaultValue="1">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select Roast ID" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 20 }, (_, i) => i + 1).map(
                            (id) => (
                              <SelectItem key={id} value={id.toString()}>
                                {id}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Recipe ID</label>
                      <Select defaultValue="1">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select Recipe ID" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 40 }, (_, i) => i + 1).map(
                            (id) => (
                              <SelectItem key={id} value={id.toString()}>
                                {id}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Grind Size</label>
                      <Input
                        type="number"
                        className="w-[180px]"
                        placeholder="Enter grind size"
                        defaultValue="18"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">
                        Total Dose Weight
                      </label>
                      <Input
                        type="number"
                        className="w-[180px]"
                        placeholder="Enter dose weight"
                        defaultValue="20"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Admin Settings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      Open
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeviceDetailsPage;
