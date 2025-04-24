import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Device } from "@/types/device";

// Import mock data
import { mockDevices } from "./DeviceTable";

const NewDeviceDetailsPage: React.FC = () => {
  const { deviceId } = useParams<{ deviceId: string }>();
  const [device, setDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevice = async () => {
      setLoading(true);
      try {
        // Find device in mock data
        const foundDevice = mockDevices.find((d) => d.id === deviceId);

        if (foundDevice) {
          // Add maintenance data
          const enhancedDevice = {
            ...foundDevice,
            lastDescaling: "2023-10-15T10:30:00Z",
            lastFilterChange: "2024-01-05T10:30:00Z",
          };
          setDevice(enhancedDevice);
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
        <h1 className="text-2xl font-bold">Device Details: {device.name}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Device Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Device ID</p>
                <p>{device.id}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Serial Number
                </p>
                <p className="font-mono">{device.serialNumber}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {device.status}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Model</p>
                <p>{device.model}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Location</p>
                <p>{device.location}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Last Connected
                </p>
                <p>{new Date(device.lastConnected).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Maintenance Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
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

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Next Scheduled Maintenance
                </p>
                <p>
                  {device.lastDescaling
                    ? new Date(
                        new Date(device.lastDescaling).getTime() +
                          90 * 24 * 60 * 60 * 1000,
                      ).toLocaleDateString()
                    : "Not scheduled"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Maintenance Status
                </p>
                <div
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    !device.lastDescaling
                      ? "bg-red-100 text-red-800"
                      : new Date(device.lastDescaling).getTime() +
                            90 * 24 * 60 * 60 * 1000 <
                          Date.now()
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                  }`}
                >
                  {!device.lastDescaling
                    ? "Never Serviced"
                    : new Date(device.lastDescaling).getTime() +
                          90 * 24 * 60 * 60 * 1000 <
                        Date.now()
                      ? "Service Due"
                      : "Good Standing"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewDeviceDetailsPage;
