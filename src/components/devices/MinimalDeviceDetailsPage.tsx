import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Device } from "@/types/device";

// Import mock data for development
import { mockDevices } from "./DeviceTable";

const MinimalDeviceDetailsPage: React.FC = () => {
  const { deviceId } = useParams<{ deviceId: string }>();
  const [device, setDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real application, this would be an API call
    const fetchDevice = () => {
      setLoading(true);
      try {
        // Find the device in our mock data
        const foundDevice = mockDevices.find((d) => d.id === deviceId);
        if (foundDevice) {
          // Add maintenance data
          const deviceWithMaintenance = {
            ...foundDevice,
            lastDescaling: "2023-10-15T10:30:00Z",
            lastFilterChange: "2024-01-05T10:30:00Z",
          };
          setDevice(deviceWithMaintenance);
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
    <div className="p-6">
      <div className="flex items-center space-x-4 mb-6">
        <Link to="/devices">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Devices
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Device Details</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Device Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Device Name</p>
              <p>{device.name}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Serial Number</p>
              <p className="font-mono">{device.serialNumber}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {device.status}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Last Descaling
              </p>
              <p>
                {device.lastDescaling
                  ? new Date(device.lastDescaling).toLocaleDateString()
                  : "No record"}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Last Filter Change
              </p>
              <p>
                {device.lastFilterChange
                  ? new Date(device.lastFilterChange).toLocaleDateString()
                  : "No record"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MinimalDeviceDetailsPage;
