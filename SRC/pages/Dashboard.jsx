// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { Project, Platform, ComponentVersion } from "../entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { 
  Package, 
  ArrowRight, 
  AlertTriangle,
  Radio,
  Laptop,
  Map,
  Boxes,
  Building,
  Server
} from "lucide-react";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [projectsData, platformsData, versionsData] = await Promise.all([
        Project.list(),
        Platform.list(),
        ComponentVersion.list("-deployment_date")
      ]);
      setProjects(projectsData);
      setPlatforms(platformsData);
      setVersions(versionsData);
      setLoading(false);
    } catch (error) {
      console.error("Error loading data:", error);
      setLoading(false);
    }
  };

  const getComponentIcon = (type) => {
    const icons = {
      product: Package,
      app: Laptop,
      radio: Radio,
      framework: Boxes,
      map: Map
    };
    return icons[type] || Package;
  };

  const getStatusColor = (status) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      completed: "bg-blue-100 text-blue-800",
      on_hold: "bg-yellow-100 text-yellow-800",
      cancelled: "bg-red-100 text-red-800",
      testing: "bg-yellow-100 text-yellow-800",
      deployed: "bg-green-100 text-green-800",
      rollback_needed: "bg-red-100 text-red-800",
      deprecated: "bg-gray-100 text-gray-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">C2 Deployment Dashboard</h1>
        <div className="space-x-4">
          <Link to={createPageUrl("Projects")}>
            <Button variant="outline">
              <Building className="mr-2 h-4 w-4" />
              Projects
            </Button>
          </Link>
          <Link to={createPageUrl("DeploymentMatrix")}>
            <Button>
              <Server className="mr-2 h-4 w-4" />
              Deployment Matrix
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{projects.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Platforms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{platforms.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Deployments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {versions.filter(v => v.status === "deployed").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Need Attention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {versions.filter(v => v.status === "rollback_needed").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Active Projects</CardTitle>
            <Link to={createPageUrl("Projects")}>
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects
                .filter(project => project.status === "active")
                .slice(0, 4)
                .map(project => {
                  const projectPlatforms = platforms.filter(p => p.project_id === project.id);
                  return (
                    <div key={project.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-lg">{project.name}</div>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500 mb-3">
                        {project.customer} • {projectPlatforms.length} platforms
                      </div>
                      <div className="text-sm text-gray-600 line-clamp-2">
                        {project.description}
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Critical Updates Needed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {versions
                .filter(v => v.status === "rollback_needed" || v.known_issues?.length > 0)
                .slice(0, 3)
                .map(version => {
                  const platform = platforms.find(p => p.id === version.platform_id);
                  const project = platform 
                    ? projects.find(p => p.id === platform.project_id) 
                    : null;
                  
                  return (
                    <div key={version.id} className="p-4 bg-red-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">
                          {project?.name || "Unknown Project"} / {platform?.name || "Unknown Platform"}
                        </div>
                        <Badge className="bg-red-100 text-red-800">
                          {version.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm mb-2">
                        <span className="capitalize">{version.component_type}</span>
                        <span>v{version.version_number}</span>
                      </div>
                      {version.known_issues?.length > 0 && (
                        <ul className="text-sm text-red-700 list-disc list-inside">
                          {version.known_issues.map((issue, i) => (
                            <li key={i}>{issue}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}