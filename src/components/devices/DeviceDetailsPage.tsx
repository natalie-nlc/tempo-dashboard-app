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
import DeviceHistory, { DeviceEvent } from "./DeviceHistory";
import DeviceInformation from "./DeviceInformation";
import DeviceEventCard from "./DeviceEventCard";
import { BrewEvent } from "@/components/data-explorer/DataTable";

// Import mock data from DataTable for development
import { mockData as dataExplorerMockData } from "@/components/data-explorer/DataTable";

// Convert DataTable BrewEvents to DeviceEvents
const convertBrewEventToDeviceEvent = (brewEvent: BrewEvent): DeviceEvent => {
  return {
    id: brewEvent.eventId,
    deviceId: brewEvent.deviceId,
    eventType: "brew",
    timestamp: brewEvent.timestamp,
    description: `Brew event with peak pressure ${brewEvent.peakPressure}`,
    details: {
      username: brewEvent.username,
      roastId: brewEvent.roastId,
      recipeId: brewEvent.recipeId,
      peakPressure: `${brewEvent.peakPressure} bar`,
    },
  };
};

// Mock device events for development
const mockDeviceEvents: DeviceEvent[] = [
  // Original mock events
  {
    id: "evt-001",
    deviceId: "1",
    eventType: "connection",
    timestamp: "2023-06-15T08:30:00Z",
    description: "Device connected",
  },
  {
    id: "evt-003",
    deviceId: "1",
    eventType: "maintenance",
    timestamp: "2023-06-14T14:00:00Z",
    description: "Water filter replaced",
  },
  {
    id: "evt-004",
    deviceId: "1",
    eventType: "error",
    timestamp: "2023-06-13T10:45:00Z",
    description: "Water tank empty",
  },
  {
    id: "evt-005",
    deviceId: "2",
    eventType: "update",
    timestamp: "2023-06-14T17:30:00Z",
    description: "Firmware updated to v1.1.8",
  },
  {
    id: "evt-006",
    deviceId: "2",
    eventType: "error",
    timestamp: "2023-06-14T17:45:00Z",
    description: "Temperature sensor malfunction",
  },

  // New mock events for BR-2023-1201
  {
    id: "evt-101",
    deviceId: "BR-2023-1201",
    eventType: "brew",
    timestamp: "2023-10-15T09:30:00Z",
    description: "Espresso brew completed",
    details: {
      recipeId: "ESP-001",
      brewTime: "25s",
      waterTemperature: "93°C",
      pressureProfile: "9 bar",
      coffeeWeight: "18g",
      extractionWeight: "36g",
    },
  },
  {
    id: "evt-102",
    deviceId: "BR-2023-1201",
    eventType: "brew",
    timestamp: "2023-10-15T14:45:00Z",
    description: "Americano brew completed",
    details: {
      recipeId: "AMR-002",
      brewTime: "30s",
      waterTemperature: "94°C",
      pressureProfile: "9 bar",
      coffeeWeight: "18g",
      extractionWeight: "40g",
    },
  },
  {
    id: "evt-103",
    deviceId: "BR-2023-1201",
    eventType: "maintenance",
    timestamp: "2023-10-14T18:00:00Z",
    description: "Descaling completed",
    details: {
      maintenanceType: "Descaling",
      technician: "System",
      duration: "45 minutes",
    },
  },

  // New mock events for GR-2023-3405
  {
    id: "evt-201",
    deviceId: "GR-2023-3405",
    eventType: "grind",
    timestamp: "2023-10-15T09:25:00Z",
    description: "Espresso grind completed",
    details: {
      grindSize: "Fine",
      coffeeWeight: "18g",
      grindTime: "8.5s",
      beanType: "Ethiopian Yirgacheffe",
    },
  },
  {
    id: "evt-202",
    deviceId: "GR-2023-3405",
    eventType: "grind",
    timestamp: "2023-10-15T14:40:00Z",
    description: "Filter grind completed",
    details: {
      grindSize: "Medium",
      coffeeWeight: "22g",
      grindTime: "10.2s",
      beanType: "Colombian Supremo",
    },
  },
  {
    id: "evt-203",
    deviceId: "GR-2023-3405",
    eventType: "error",
    timestamp: "2023-10-14T16:30:00Z",
    description: "Grinder jam detected",
    details: {
      errorCode: "GR-JAM-001",
      resolution: "Auto-cleared after retry",
    },
  },

  // New mock events for BR-PROTO-1305
  {
    id: "evt-301",
    deviceId: "BR-PROTO-1305",
    eventType: "brew",
    timestamp: "2023-10-15T10:15:00Z",
    description: "Prototype pressure profiling test",
    details: {
      testId: "PROTO-TEST-42",
      pressureProfile: "Variable (6-9-6 bar)",
      waterTemperature: "92°C",
      result: "Successful",
      notes: "Flavor profile improved with variable pressure",
    },
  },
  {
    id: "evt-302",
    deviceId: "BR-PROTO-1305",
    eventType: "brew",
    timestamp: "2023-10-15T11:30:00Z",
    description: "Prototype temperature stability test",
    details: {
      testId: "PROTO-TEST-43",
      temperatureVariation: "±0.3°C",
      brewTime: "28s",
      result: "Successful",
      notes: "Temperature stability within target range",
    },
  },
  {
    id: "evt-303",
    deviceId: "BR-PROTO-1305",
    eventType: "update",
    timestamp: "2023-10-14T09:00:00Z",
    description: "Prototype firmware updated",
    details: {
      version: "0.9.5-beta",
      changes:
        "Improved pressure sensor calibration, Added new temperature control algorithm",
      updateTime: "3 minutes",
    },
  },
];

const DeviceDetailsPage: React.FC = () => {
  const { deviceId } = useParams<{ deviceId: string }>();
  const [device, setDevice] = useState<Device | null>(null);
  const [deviceEvents, setDeviceEvents] = useState<DeviceEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(true);

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

    const fetchDeviceEvents = () => {
      setEventsLoading(true);
      try {
        // In a real application, this would be an API call
        // For now, we'll combine mock events and converted brew events from DataTable

        // Get events from mockDeviceEvents that match the deviceId
        const deviceSpecificEvents = mockDeviceEvents.filter(
          (event) => event.deviceId === deviceId,
        );
        console.log("Device specific events:", deviceSpecificEvents);

        // Convert brew events from DataTable to device events
        const brewEvents = dataExplorerMockData
          .filter((event) => event.deviceId === deviceId)
          .map(convertBrewEventToDeviceEvent);
        console.log("Brew events:", brewEvents);

        // Combine all events
        const allEvents = [...deviceSpecificEvents, ...brewEvents];

        // Sort by timestamp, most recent first
        allEvents.sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        );

        console.log("All events after sorting:", allEvents);
        setDeviceEvents(allEvents);
      } catch (error) {
        console.error("Error fetching device events:", error);
      } finally {
        setEventsLoading(false);
      }
    };

    fetchDevice();
    fetchDeviceEvents();
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

  // Reusable component for rendering device events
  const DeviceEventsContent = () => (
    <>
      {eventsLoading ? (
        <div className="p-4">Loading event history...</div>
      ) : deviceEvents.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground">
          No events found for this device.
        </div>
      ) : (
        <>
          <DeviceHistory events={deviceEvents} />
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-medium">Detailed Event Cards</h3>
            {deviceEvents.map((event) => (
              <DeviceEventCard key={event.id} event={event} />
            ))}
          </div>
        </>
      )}
    </>
  );

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
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Device Information</CardTitle>
                <CardDescription>
                  Comprehensive information about this device
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DeviceInformation device={device} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Device History</CardTitle>
                <CardDescription>
                  Recent events and activities for this device
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DeviceEventsContent />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="usage" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Device History</CardTitle>
                <CardDescription>
                  Recent events and activities for this device
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DeviceEventsContent />
              </CardContent>
            </Card>

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
          </div>
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
