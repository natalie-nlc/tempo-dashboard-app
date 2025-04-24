import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import DevicesPage from "./components/devices/DevicesPage";
import DeviceDetailsPage from "./components/devices/DeviceDetailsPage";
import DataTable from "./components/data-explorer/DataTable";
import AlertsErrorsPage from "./components/data-explorer/AlertsErrorsPage";
import MainLayout from "./components/layout/MainLayout";
import DynGGPage from "./components/labs/DynGGPage";
import DynGGDeviceDetails from "./components/labs/DynGGDeviceDetails";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        <Routes>
          <Route
            path="/"
            element={
              <MainLayout>
                <Home />
              </MainLayout>
            }
          />
          <Route
            path="/devices"
            element={
              <MainLayout>
                <DevicesPage />
              </MainLayout>
            }
          />
          <Route
            path="/devices/:deviceId"
            element={
              <MainLayout>
                <DeviceDetailsPage />
              </MainLayout>
            }
          />
          <Route
            path="/data-explorer"
            element={
              <MainLayout>
                <DataTable />
              </MainLayout>
            }
          />
          <Route
            path="/data-explorer/alerts"
            element={
              <MainLayout>
                <AlertsErrorsPage />
              </MainLayout>
            }
          />
          <Route
            path="/labs/dyngg"
            element={
              <MainLayout>
                <DynGGPage />
              </MainLayout>
            }
          />
          <Route
            path="/labs/dyngg/:deviceId"
            element={
              <MainLayout>
                <DynGGDeviceDetails />
              </MainLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <MainLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Settings</h1>
                  <p className="mt-4 text-muted-foreground">
                    System settings and configuration options will be displayed
                    here.
                  </p>
                </div>
              </MainLayout>
            }
          />
        </Routes>
      </>
    </Suspense>
  );
}

export default App;
