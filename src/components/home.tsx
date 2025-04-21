import React from "react";
import DashboardOverview from "./dashboard/DashboardOverview";

export default function HomePage() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <DashboardOverview
          shotAccuracy={{
            value: "91.2%",
            change: "+1.5%",
            description:
              "% shots using dynGG that had a peak pressure between 6 and 9 bars",
          }}
          activeDevices={{
            value: "224",
            description: "90.3% of total",
          }}
          totalDevices={{
            value: "248",
            description: "Across all locations",
          }}
          totalBeansGround={{
            value: "1,245 kg",
            description: "Last 30 days",
          }}
        />
      </div>
    </div>
  );
}
