import React, { useEffect, useState } from "react";
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
import { Device } from "@/types/device";

// Import mock data for development
import { mockDevices } from "./DeviceTable";

const DeviceDetailsPage: React.FC = () => {
  const { deviceId } = useParams<{ deviceId: string }>();
  const [device, setDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Device Information</CardTitle>
                <CardDescription>
                  Basic information about this device
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Device ID
                    </p>
                    <p className="font-mono">{device.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Serial Number
                    </p>
                    <p className="font-mono">{device.serialNumber}</p>
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
                    <p className="text-sm font-medium text-gray-500">Status</p>
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
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Home Location</CardTitle>
                <CardDescription>
                  Where this device is being used
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Town</p>
                  <p>{device.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Coordinates
                  </p>
                  <p className="font-mono">
                    {device.coordinates[0]}, {device.coordinates[1]}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer & Connection</CardTitle>
                <CardDescription>Home user information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Customer Name
                  </p>
                  <p>{device.owner || "—"}</p>
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
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="usage" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Usage Insights</CardTitle>
              <CardDescription>
                Performance metrics and usage patterns for this device
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border rounded-md">
                <p className="text-muted-foreground">
                  Usage data visualization will appear here
                </p>
              </div>
            </CardContent>
          </Card>
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
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="w-full justify-start">
                    Restart Device
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Update Firmware
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Schedule Home Visit
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Export Device Logs
                  </Button>
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
