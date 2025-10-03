"use client";
import {
  Folder,
  Search,
  Filter,
  User,
  Calendar,
  Eye,
  MessageSquare,
  Users2,
  BarChart3,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect } from "react";

interface Project {
  project_id: string;
  sender_name: string;
  status: string;
  created_at: string;
  user: string;
  userName: string;
  campaigns: number;
  phonebooks: number;
  is_active: boolean;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/admin/projects');
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des projets');
        }
        
        const projectsData = await response.json();
        setProjects(projectsData);
      } catch (error) {
        console.error('Erreur lors du chargement des projets:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Erreur lors du chargement des projets",
        });
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [toast]);

  const filteredProjects = projects.filter(project =>
    project.sender_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const columns: ColumnDef<Project>[] = [
    {
      accessorKey: "sender_name",
      header: "Nom du projet",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Folder className="w-4 h-4 text-blue-500" />
          <div className="font-medium">{row.getValue("sender_name")}</div>
        </div>
      ),
    },
    {
      accessorKey: "userName",
      header: "Créateur",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {row.original.userName.charAt(0)}
            </span>
          </div>
          <div>
            <div className="text-sm font-medium">{row.original.userName}</div>
            <div className="text-xs text-gray-500">{row.original.user}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const statusColors = {
          'ACTIVE': 'text-green-600 bg-green-50',
          'PENDING': 'text-orange-600 bg-orange-50',
          'SUSPENDED': 'text-red-600 bg-red-50',
          'REJECTED': 'text-gray-600 bg-gray-50',
        };
        const statusLabels = {
          'ACTIVE': 'Actif',
          'PENDING': 'En attente',
          'SUSPENDED': 'Suspendu',
          'REJECTED': 'Rejeté',
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors] || 'text-gray-600 bg-gray-50'}`}>
            {statusLabels[status as keyof typeof statusLabels] || status}
          </span>
        );
      },
    },
    {
      accessorKey: "campaigns",
      header: "Statistiques",
      cell: ({ row }) => {
        const project = row.original;
        return (
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3 text-blue-500" />
              <span>{project.phonebooks} phonebooks</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3 text-purple-500" />
              <span>{project.campaigns} campagnes</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Créé le",
      cell: ({ row }) => (
        <div className="flex items-center gap-1 text-sm">
          <Calendar className="w-4 h-4 text-gray-400" />
          {formatDate(row.getValue("created_at"))}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Folder color="#000000" />
            <h1 className="text-2xl font-bold">Gestion des Projets</h1>
          </div>
          <p className="text-gray-500">
            Consultez tous les projets créés par les utilisateurs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-[#FB953C] hover:bg-[#FB953C]/80 text-white">
            <Folder className="w-4 h-4 mr-2" />
            Exporter les projets
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total projets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Projets actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {projects.filter(p => p.status === 'ACTIVE').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {projects.filter(p => p.status === 'PENDING').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total phonebooks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {projects.reduce((sum, project) => sum + project.phonebooks, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total campagnes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {projects.reduce((sum, project) => sum + project.campaigns, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des projets */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des projets</CardTitle>
          <CardDescription>
            Tous les projets créés par les utilisateurs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher par nom, description ou créateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
              <div className="h-32 bg-gray-200 rounded animate-pulse" />
            </div>
          ) : (
            <DataTable
              data={filteredProjects}
              columns={columns}
              searchColumn="name"
              searchPlaceholder="Rechercher un projet..."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
