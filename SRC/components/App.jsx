// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import DeploymentMatrix from "./pages/DeploymentMatrix";
import Products from "./pages/Products";
import Projects from "./pages/Projects";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <div className="p-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/deployment-matrix" element={<DeploymentMatrix />} />
            <Route path="/products" element={<Products />} />
            <Route path="/projects" element={<Projects />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // You'll need to create this file for any global styles

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);