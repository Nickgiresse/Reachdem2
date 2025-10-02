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
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  stats: {
    contactCount: number;
    groupCount: number;
    campaignCount: number;
    messageCount: number;
  };
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
        // Simuler des données pour la démo
        const mockProjects: Project[] = [
          {
            id: "1",
            name: "E-commerce 2024",
            description: "Projet de marketing pour l'e-commerce",
            createdAt: "2024-01-15T10:30:00Z",
            updatedAt: "2024-01-15T10:30:00Z",
            user: {
              id: "user1",
              name: "John Doe",
              email: "john.doe@example.com",
            },
            stats: {
              contactCount: 150,
              groupCount: 5,
              campaignCount: 12,
              messageCount: 1250,
            },
          },
          {
            id: "2",
            name: "Marketing Digital",
            description: "Campagnes de marketing digital",
            createdAt: "2024-01-14T14:20:00Z",
            updatedAt: "2024-01-14T14:20:00Z",
            user: {
              id: "user2",
              name: "Marie Martin",
              email: "marie.martin@example.com",
            },
            stats: {
              contactCount: 300,
              groupCount: 8,
              campaignCount: 15,
              messageCount: 2100,
            },
          },
          {
            id: "3",
            name: "Ventes",
            description: "Projet de prospection commerciale",
            createdAt: "2024-01-13T09:15:00Z",
            updatedAt: "2024-01-13T09:15:00Z",
            user: {
              id: "user3",
              name: "Pierre Durand",
              email: "pierre.durand@example.com",
            },
            stats: {
              contactCount: 75,
              groupCount: 3,
              campaignCount: 5,
              messageCount: 450,
            },
          },
        ];

        setProjects(mockProjects);
      } catch (error) {
        console.error('Erreur lors du chargement des projets:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Erreur lors du chargement des projets",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [toast]);

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.user.name.toLowerCase().includes(searchTerm.toLowerCase())
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
      accessorKey: "name",
      header: "Nom du projet",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.getValue("name")}</div>
          {row.original.description && (
            <div className="text-sm text-gray-500">{row.original.description}</div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "user",
      header: "Créateur",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {row.original.user.name.charAt(0)}
            </span>
          </div>
          <div>
            <div className="text-sm font-medium">{row.original.user.name}</div>
            <div className="text-xs text-gray-500">{row.original.user.email}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "stats",
      header: "Statistiques",
      cell: ({ row }) => {
        const stats = row.getValue("stats") as Project["stats"];
        return (
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3 text-blue-500" />
              <span>{stats.contactCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users2 className="w-3 h-3 text-green-500" />
              <span>{stats.groupCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3 text-purple-500" />
              <span>{stats.campaignCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <BarChart3 className="w-3 h-3 text-orange-500" />
              <span>{stats.messageCount}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Créé le",
      cell: ({ row }) => (
        <div className="flex items-center gap-1 text-sm">
          <Calendar className="w-4 h-4 text-gray-400" />
          {formatDate(row.getValue("createdAt"))}
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
            <CardTitle className="text-sm font-medium">Total contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {projects.reduce((sum, project) => sum + project.stats.contactCount, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total groupes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {projects.reduce((sum, project) => sum + project.stats.groupCount, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total campagnes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {projects.reduce((sum, project) => sum + project.stats.campaignCount, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {projects.reduce((sum, project) => sum + project.stats.messageCount, 0)}
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
