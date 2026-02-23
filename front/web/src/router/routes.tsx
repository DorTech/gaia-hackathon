import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import MainLayout from "../layouts/MainLayout";
import DashboardPage from "../pages/DashboardPage";
import SettingsPage from "../pages/SettingsPage";
import NotFoundPage from "../pages/NotFoundPage";
import { BenchmarkPage } from "../pages/BenchmarkPage";
import { DiagnosticPage } from "../pages/DiagnosticPage";
import { SimulationPage } from "../pages/SimulationPage";

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { index: true, element: <Navigate to="/benchmark" replace /> },
          { path: "benchmark", element: <BenchmarkPage /> },
          { path: "diagnostic", element: <DiagnosticPage /> },
          { path: "simulation", element: <SimulationPage /> },
          { path: "dashboard", element: <DashboardPage /> },
          { path: "settings", element: <SettingsPage /> },
          { path: "*", element: <NotFoundPage /> },
        ],
      },
    ],
  },
]);
