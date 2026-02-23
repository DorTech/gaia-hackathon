import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import MainLayout from "../layouts/MainLayout";
import { BenchmarkPage } from "../pages/benchmark/BenchmarkPage";
import { DiagnosticPage } from "../pages/DiagnosticPage";
import NotFoundPage from "../pages/NotFoundPage";
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
          { path: "*", element: <NotFoundPage /> },
        ],
      },
    ],
  },
]);
