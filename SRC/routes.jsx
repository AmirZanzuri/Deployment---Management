import React from "react";
import { Route, Routes } from "react-router-dom";

// Import page components
import Dashboard from "./pages/Dashboard";
import DeploymentMatrix from "./pages/DeploymentMatrix";
import Products from "./pages/Products";
import Projects from "./pages/Projects";
import Platforms from "./pages/Platforms";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/deployment-matrix" element={<DeploymentMatrix />} />
      <Route path="/products" element={<Products />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/platforms" element={<Platforms />} />
    </Routes>
  );
}

export default AppRoutes;