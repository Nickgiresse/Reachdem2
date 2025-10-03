"use client";
import {
  Users2,
  Search,
  Filter,
  User,
  Calendar,
  Eye,
  MessageSquare,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect } from "react";

interface Group {
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
  project: {
    id: string;
    name: string;
  };
  contactCount: number;
  campaignCount: number;
}

export default function AdminGroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchGroups = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/admin/groups');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des groupes');
        }
        const data = await response.json();
        setGroups(data);
      } catch (error) {
        console.error('Erreur lors du chargement des groupes:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Erreur lors du chargement des groupes",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, [toast]);

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const columns: ColumnDef<Group>[] = [
    {
      accessorKey: "name",
      header: "Nom du groupe",
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
      accessorKey: "project",
      header: "Projet",
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.project.name}
        </div>
      ),
    },
    {
      accessorKey: "contactCount",
      header: "Contacts",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <User className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium">{row.getValue("contactCount")}</span>
        </div>
      ),
    },
    {
      accessorKey: "campaignCount",
      header: "Campagnes",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <MessageSquare className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium">{row.getValue("campaignCount")}</span>
        </div>
      ),
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
            <Users2 color="#000000" />
            <h1 className="text-2xl font-bold">Gestion des Groupes</h1>
          </div>
          <p className="text-gray-500">
            Consultez tous les groupes créés par les utilisateurs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-[#FB953C] hover:bg-[#FB953C]/80 text-white">
            <Users2 className="w-4 h-4 mr-2" />
            Exporter les groupes
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total groupes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{groups.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {groups.reduce((sum, group) => sum + group.contactCount, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total campagnes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {groups.reduce((sum, group) => sum + group.campaignCount, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Moyenne contacts/groupe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {groups.length > 0 ? Math.round(groups.reduce((sum, group) => sum + group.contactCount, 0) / groups.length) : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des groupes */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des groupes</CardTitle>
          <CardDescription>
            Tous les groupes créés par les utilisateurs
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
              data={filteredGroups}
              columns={columns}
              searchColumn="name"
              searchPlaceholder="Rechercher un groupe..."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
