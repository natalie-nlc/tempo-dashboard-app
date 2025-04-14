import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { CSSProperties } from "react";
import { Coffee, Cog } from "lucide-react";

interface DeviceLocation {
  id: string;
  name: string;
  status: "online" | "offline" | "maintenance" | "warning";
  location: string;
  coordinates: [number, number]; // [latitude, longitude]
  isPrototype?: boolean;
}

interface DevicesMapProps {
  devices?: DeviceLocation[];
  isLoading?: boolean;
}

const DevicesMap: React.FC<DevicesMapProps> = ({
  devices = mockDeviceLocations,
  isLoading = false,
}) => {
  // Custom icon for markers
  const getDeviceIcon = (
    status: DeviceLocation["status"],
    isPrototype?: boolean,
  ) => {
    // Define colors based on status
    const getStatusColor = (status: DeviceLocation["status"]) => {
      switch (status) {
        case "online":
          return "#10b981"; // green
        case "offline":
          return "#6b7280"; // gray
        case "maintenance":
          return "#f59e0b"; // yellow
        case "warning":
          return "#ef4444"; // red
        default:
          return "#6b7280"; // gray
      }
    };

    // Use the company logo with appropriate border color
    const borderColor = isPrototype ? "#000000" : getStatusColor(status);
    const borderStyle = isPrototype ? "solid" : "solid";

    return new Icon({
      iconUrl:
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36">
          <circle cx="18" cy="18" r="16" fill="white" stroke="${borderColor}" stroke-width="3" />
          <g transform="translate(10, 8) scale(0.5)">
            <!-- Nunc logo - lowercase n with radiating lines -->
            <text x="16" y="24" text-anchor="middle" font-size="28" font-weight="bold" fill="#333333">n</text>
            <!-- Radiating lines around the logo -->
            ${Array.from({ length: 40 })
              .map((_, i) => {
                const angle = (i * 9 * Math.PI) / 180;
                const x1 = 16 + 14 * Math.cos(angle);
                const y1 = 16 + 14 * Math.sin(angle);
                const x2 = 16 + 18 * Math.cos(angle);
                const y2 = 16 + 18 * Math.sin(angle);
                return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#333333" stroke-width="1" />`;
              })
              .join("")}
          </g>
        </svg>
      `),
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18],
      className: `device-icon ${isPrototype ? "prototype" : ""} ${status}`,
    });
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted">
        <p>Loading map...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-background">
      <style jsx>{`
        :global(.device-icon.prototype) {
          filter: drop-shadow(0 0 3px rgba(0, 0, 0, 0.7));
        }
        :global(.device-icon.online) {
          filter: drop-shadow(0 0 3px rgba(16, 185, 129, 0.5));
        }
        :global(.device-icon.warning) {
          filter: drop-shadow(0 0 3px rgba(239, 68, 68, 0.5));
        }
        :global(.device-icon.maintenance) {
          filter: drop-shadow(0 0 3px rgba(245, 158, 11, 0.5));
        }
        :global(.device-icon.offline) {
          filter: drop-shadow(0 0 3px rgba(107, 114, 128, 0.5));
        }
      `}</style>
      <MapContainer
        center={[51.1657, 10.4515]} // Default center (Germany)
        zoom={6}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", zIndex: 1 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {devices.map((device) => (
          <Marker
            key={device.id}
            position={device.coordinates}
            icon={getDeviceIcon(device.status, device.isPrototype)}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-medium text-base">{device.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {device.location}
                </p>
                <p className="text-sm mt-1 flex items-center gap-1">
                  <Coffee className="h-4 w-4" />
                  <span>Nunc. Machine</span>
                </p>
                <p className="text-sm mt-1">
                  Status:{" "}
                  <span
                    className={`font-medium ${
                      device.status === "online"
                        ? "text-green-500"
                        : device.status === "warning"
                          ? "text-red-500"
                          : device.status === "maintenance"
                            ? "text-yellow-500"
                            : "text-gray-500"
                    }`}
                  >
                    {device.status}
                  </span>
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

// Mock data for development
const mockDeviceLocations: DeviceLocation[] = [
  {
    id: "1",
    name: "Machine #A1201",
    status: "online",
    location: "Café Zentral, Berlin",
    coordinates: [52.52, 13.405], // Berlin
  },
  {
    id: "2",
    name: "Machine #G3405",
    status: "warning",
    location: "Kaffeehaus, Munich",
    coordinates: [48.1351, 11.582], // Munich
  },
  {
    id: "3",
    name: "Machine #A1305",
    status: "maintenance",
    location: "Espresso Bar, Hamburg",
    coordinates: [53.5511, 9.9937], // Hamburg
    isPrototype: true,
  },
  {
    id: "4",
    name: "Machine #G2201",
    status: "offline",
    location: "Kaffeelabor, Zurich",
    coordinates: [47.3769, 8.5417], // Zurich
  },
  {
    id: "5",
    name: "Machine #A1422",
    status: "online",
    location: "Kaffeewerk, Frankfurt",
    coordinates: [50.1109, 8.6821], // Frankfurt
  },
  {
    id: "6",
    name: "Machine #G4102",
    status: "online",
    location: "Kaffeestube, Geneva",
    coordinates: [46.2044, 6.1432], // Geneva
    isPrototype: true,
  },
  {
    id: "7",
    name: "Machine #A1508",
    status: "warning",
    location: "Kaffeehaus, Cologne",
    coordinates: [50.9375, 6.9603], // Cologne
  },
  {
    id: "8",
    name: "Machine #G3901",
    status: "maintenance",
    location: "Kaffeelabor, Bern",
    coordinates: [46.948, 7.4474], // Bern
  },
];

export default DevicesMap;
