"use client";
import {
  Folder,
  Search,
  Filter,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect } from "react";

interface PendingProject {
  project_id: string;
  sender_name: string;
  created_at: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  stats: {
    campaigns: number;
    phonebooks: number;
  };
}

export default function AdminProjectActivationPage() {
  const [projects, setProjects] = useState<PendingProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchPendingProjects = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/admin/projects/activate');
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des projets en attente');
        }
        
        const projectsData = await response.json();
        setProjects(projectsData);
      } catch (error) {
        console.error('Erreur lors du chargement des projets:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Erreur lors du chargement des projets en attente",
        });
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingProjects();
  }, [toast]);

  const filteredProjects = projects.filter(project =>
    project.sender_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleApproveProject = async (projectId: string, projectName: string) => {
    try {
      const response = await fetch('/api/admin/projects/activate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          action: 'approve'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'approbation');
      }

      // Supprimer le projet de la liste locale
      setProjects(prev => prev.filter(project => project.project_id !== projectId));
      
      toast({
        title: "Succès",
        description: `Projet "${projectName}" approuvé avec succès`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de l'approbation du projet",
      });
    }
  };

  const handleRejectProject = async (projectId: string, projectName: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir rejeter le projet "${projectName}" ?`)) {
      return;
    }

    try {
      const response = await fetch('/api/admin/projects/activate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          action: 'reject'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors du rejet');
      }

      // Supprimer le projet de la liste locale
      setProjects(prev => prev.filter(project => project.project_id !== projectId));
      
      toast({
        title: "Succès",
        description: `Projet "${projectName}" rejeté avec succès`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors du rejet du projet",
      });
    }
  };

  const columns: ColumnDef<PendingProject>[] = [
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
        const stats = row.getValue("stats") as PendingProject["stats"];
        return (
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3 text-blue-500" />
              <span>{stats.phonebooks} phonebooks</span>
            </div>
            <div className="flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-green-500" />
              <span>{stats.campaigns} campagnes</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Demandé le",
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
        const project = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => handleApproveProject(project.project_id, project.sender_name)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Approuver
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleRejectProject(project.project_id, project.sender_name)}
            >
              <XCircle className="w-4 h-4 mr-1" />
              Rejeter
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
            <Clock color="#000000" />
            <h1 className="text-2xl font-bold">Activation des Projets</h1>
          </div>
          <p className="text-gray-500">
            Approuvez ou rejetez les projets en attente d'activation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            className="bg-[#FB953C] hover:bg-[#FB953C]/80 text-white"
            onClick={() => window.location.reload()}
          >
            <Clock className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Projets en attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{projects.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {projects.reduce((sum, project) => sum + project.stats.phonebooks, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total campagnes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {projects.reduce((sum, project) => sum + project.stats.campaigns, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des projets en attente */}
      <Card>
        <CardHeader>
          <CardTitle>Projets en attente d'approbation</CardTitle>
          <CardDescription>
            {projects.length === 0 
              ? "Aucun projet en attente d'approbation" 
              : `${projects.length} projet(s) en attente d'approbation`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {projects.length > 0 && (
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher par nom de projet ou créateur..."
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
          )}

          {isLoading ? (
            <div className="space-y-4">
              <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
              <div className="h-32 bg-gray-200 rounded animate-pulse" />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun projet en attente</h3>
              <p className="text-gray-500">Tous les projets ont été traités.</p>
            </div>
          ) : (
            <DataTable
              data={filteredProjects}
              columns={columns}
              searchColumn="sender_name"
              searchPlaceholder="Rechercher un projet..."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
