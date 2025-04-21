import React from "react";
import AlertsErrorsTable from "./AlertsErrorsTable";
import AlertNotifications from "./AlertNotifications";

const AlertsErrorsPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <AlertsErrorsTable />
      <AlertNotifications />
    </div>
  );
};

export default AlertsErrorsPage;
