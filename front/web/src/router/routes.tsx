import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import MainLayout from "../layouts/MainLayout";
import DashboardPage from "../pages/DashboardPage";
import SettingsPage from "../pages/SettingsPage";
import NotFoundPage from "../pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: "dashboard", element: <DashboardPage /> },
          { path: "settings", element: <SettingsPage /> },
          { path: "*", element: <NotFoundPage /> },
        ],
      },
    ],
  },
]);
