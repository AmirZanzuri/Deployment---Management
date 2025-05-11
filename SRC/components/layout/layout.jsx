// src/components/layout/Layout.js
import React from "react";
import { NavLink } from "react-router-dom";
import { Package, Server, Building, LayoutDashboard } from "lucide-react";

export default function Layout({ children }) {
  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { to: "/projects", label: "Projects", icon: <Building className="w-5 h-5" /> },
    { to: "/deployment-matrix", label: "Deployment Matrix", icon: <Server className="w-5 h-5" /> },
    { to: "/products", label: "Products", icon: <Package className="w-5 h-5" /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold">C2 Deployment</h1>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm rounded-md ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}