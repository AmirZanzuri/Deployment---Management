// src/pages/DeploymentMatrix.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Project, Platform, ComponentVersion } from "../entities/all";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.jsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";
import { 
  Radio,
  Laptop,
  Map,
  Package,
  Boxes,
  Link as LinkIcon,
  RefreshCw,
  Building,
  AlertTriangle
} from "lucide-react";

export default function DeploymentMatrix() {
  const [projects, setProjects] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedProject, setSelectedProject] = useState("all");

  useEffect(() => {
    // Parse URL parameters for initial project selection
    const urlParams = new URLSearchParams(window.location.search);
    const projectParam = urlParams.get('project');
    if (projectParam) {
      setSelectedProject(projectParam);
    }
    
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setRefreshing(true);
      const [projectsData, platformsData, versionsData] = await Promise.all([
        Project.list(),
        Platform.list(),
        ComponentVersion.list("-deployment_date")
      ]);
      console.log("Loaded projects:", projectsData);
      console.log("Loaded platforms:", platformsData);
      console.log("Loaded versions:", versionsData);
      setProjects(projectsData);
      setPlatforms(platformsData);
      setVersions(versionsData);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error("Error loading data:", error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Filter platforms based on selected project
  const filteredPlatforms = useMemo(() => {
    if (selectedProject === "all") {
      return platforms;
    }
    return platforms.filter(platform => platform.project_id === selectedProject);
  }, [platforms, selectedProject]);

  // Group platforms by project for better organization
  const platformsByProject = useMemo(() => {
    const grouped = {};
    
    filteredPlatforms.forEach(platform => {
      const projectId = platform.project_id;
      if (!grouped[projectId]) {
        grouped[projectId] = [];
      }
      grouped[projectId].push(platform);
    });
    
    return grouped;
  }, [filteredPlatforms]);

  // Find deployed versions for a specific platform and component type
  const getDeployedVersion = (platformId, componentType) => {
    return versions.find(v => 
      v.platform_id === platformId && 
      v.component_type === componentType &&
      v.status === "deployed"
    );
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
      testing: "bg-yellow-100 text-yellow-800",
      deployed: "bg-green-100 text-green-800",
      rollback_needed: "bg-red-100 text-red-800",
      deprecated: "bg-gray-100 text-gray-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const componentTypes = ["product", "app", "radio", "framework", "map"];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Deployment Matrix</h1>
        <div className="flex items-center gap-4">
          <Select
            value={selectedProject}
            onValueChange={setSelectedProject}
          >
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map(project => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            onClick={loadData}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {Object.entries(platformsByProject).map(([projectId, projectPlatforms]) => {
        const project = projects.find(p => p.id === projectId);
        if (!project) return null;
        
        return (
          <Card key={projectId} className="mb-8">
            <CardHeader className="bg-gray-50">
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-gray-500" />
                {project.name}
                <Badge className="ml-2">{project.customer}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-48">Platform</TableHead>
                      {componentTypes.map(type => (
                        <TableHead key={type} className="capitalize">
                          <div className="flex items-center gap-1">
                            {React.createElement(getComponentIcon(type), { className: "h-4 w-4 mr-1" })}
                            {type}
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projectPlatforms.map(platform => (
                      <TableRow key={platform.id}>
                        <TableCell className="font-medium">
                          <div>{platform.name}</div>
                          <div className="text-xs text-gray-500">{platform.environment_type}</div>
                        </TableCell>
                        
                        {componentTypes.map(componentType => {
                          const version = getDeployedVersion(platform.id, componentType);
                          return (
                            <TableCell key={componentType}>
                              {version ? (
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1">
                                    <Badge className={getStatusColor(version.status)}>
                                      v{version.version_number}
                                    </Badge>
                                    {version.known_issues?.length > 0 && (
                                      <AlertTriangle 
                                        className="h-4 w-4 text-red-500" 
                                        title={`Has ${version.known_issues.length} known issues`} 
                                      />
                                    )}
                                  </div>
                                  {version.release_notes_url && (
                                    <a 
                                      href={version.release_notes_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                                    >
                                      <LinkIcon className="w-3 h-3" />
                                      Release Notes
                                    </a>
                                  )}
                                </div>
                              ) : (
                                <span className="text-gray-400 text-sm">-</span>
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {Object.keys(platformsByProject).length === 0 && !loading && (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center justify-center">
            <Building className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {selectedProject === "all" ? "No platforms found" : "No platforms in this project"}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {selectedProject === "all" 
                ? "Add platforms to your projects to see them here" 
                : "Add platforms to this project to track deployments"}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}