"use client";
import {
  Users,
  Search,
  Filter,
  Eye,
  UserCheck,
  UserX,
  Mail,
  Calendar,
  FolderOpen,
  MessageSquare,
  BarChart3,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
  stats: {
    projects: number;
    campaigns: number;
    messages: number;
    contacts: number;
  };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/admin/users');
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des utilisateurs');
        }
        
        const usersData = await response.json();
        setUsers(usersData);
      } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Erreur lors du chargement des utilisateurs",
        });
        // En cas d'erreur, afficher une liste vide
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleViewUser = (userId: string) => {
    router.push(`/admin/users/${userId}`);
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      // Simuler la mise à jour du statut
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, isActive: !currentStatus }
          : user
      ));
      
      toast({
        title: "Succès",
        description: `Utilisateur ${!currentStatus ? 'activé' : 'désactivé'} avec succès`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors de la mise à jour du statut",
      });
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${userName}" ? Cette action est irréversible.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users?id=${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la suppression');
      }

      // Supprimer l'utilisateur de la liste locale
      setUsers(prev => prev.filter(user => user.id !== userId));
      
      toast({
        title: "Succès",
        description: `Utilisateur "${userName}" supprimé avec succès`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la suppression de l'utilisateur",
      });
    }
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Nom",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              {row.getValue("name")?.toString().charAt(0)}
            </span>
          </div>
          <div>
            <div className="font-medium">{row.getValue("name")}</div>
            <div className="text-sm text-gray-500">{row.original.email}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "emailVerified",
      header: "Email vérifié",
      cell: ({ row }) => {
        const verified = row.getValue("emailVerified") as boolean;
        return (
          <div className="flex items-center gap-1">
            {verified ? (
              <UserCheck className="w-4 h-4 text-green-500" />
            ) : (
              <UserX className="w-4 h-4 text-red-500" />
            )}
            <span className={verified ? "text-green-600" : "text-red-600"}>
              {verified ? "Vérifié" : "Non vérifié"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "stats",
      header: "Statistiques",
      cell: ({ row }) => {
        const stats = row.getValue("stats") as User["stats"];
        return (
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-1">
              <FolderOpen className="w-3 h-3 text-blue-500" />
              <span>{stats.projects}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3 text-green-500" />
              <span>{stats.campaigns}</span>
            </div>
            <div className="flex items-center gap-1">
              <BarChart3 className="w-3 h-3 text-purple-500" />
              <span>{stats.messages}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3 text-orange-500" />
              <span>{stats.contacts}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Inscrit le",
      cell: ({ row }) => (
        <div className="flex items-center gap-1 text-sm">
          <Calendar className="w-4 h-4 text-gray-400" />
          {formatDate(row.getValue("createdAt"))}
        </div>
      ),
    },
    {
      accessorKey: "lastLogin",
      header: "Dernière connexion",
      cell: ({ row }) => {
        const lastLogin = row.getValue("lastLogin") as string | undefined;
        return (
          <div className="text-sm text-gray-600">
            {lastLogin ? formatDate(lastLogin) : "Jamais"}
          </div>
        );
      },
    },
    {
      accessorKey: "isActive",
      header: "Statut",
      cell: ({ row }) => {
        const isActive = row.getValue("isActive") as boolean;
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            isActive 
              ? "text-green-600 bg-green-50" 
              : "text-red-600 bg-red-50"
          }`}>
            {isActive ? "Actif" : "Inactif"}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewUser(user.id)}
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant={user.isActive ? "destructive" : "default"}
              size="sm"
              onClick={() => handleToggleUserStatus(user.id, user.isActive)}
            >
              {user.isActive ? (
                <UserX className="w-4 h-4" />
              ) : (
                <UserCheck className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDeleteUser(user.id, user.name)}
            >
              <Trash2 className="w-4 h-4" />
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
            <Users color="#000000" />
            <h1 className="text-2xl font-bold">Gestion des Utilisateurs</h1>
          </div>
          <p className="text-gray-500">
            Gérez tous les utilisateurs de la plateforme
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-[#FB953C] hover:bg-[#FB953C]/80 text-white">
            <Mail className="w-4 h-4 mr-2" />
            Envoyer un email
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {users.filter(u => u.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Emails vérifiés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {users.filter(u => u.emailVerified).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Nouveaux ce mois</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {users.filter(u => {
                const created = new Date(u.createdAt);
                const now = new Date();
                return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
              }).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recherche et filtres */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs</CardTitle>
          <CardDescription>
            Recherchez et gérez les utilisateurs de la plateforme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher par nom ou email..."
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
              data={filteredUsers}
              columns={columns}
              searchColumn="name"
              searchPlaceholder="Rechercher un utilisateur..."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}