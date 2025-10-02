"use client";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Folder,
  MessageSquare,
  Users,
  BarChart3,
  Shield,
  Ban,
  CheckCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";

interface UserDetail {
  id: string;
  name?: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  UserProfile?: {
    account_type: "INDIVIDUAL" | "BUSINESS" | "ENTERPRISE";
    first_name: string;
    last_name: string;
    phone?: string;
    city?: string;
    country?: string;
    locale: string;
    is_admin: boolean;
    is_ban: boolean;
  };
  Project: Array<{
    project_id: string;
    sender_name: string;
    created_at: string;
    _count: {
      campaigns: number;
      phonebooks: number;
    };
  }>;
}

interface UserStats {
  totalProjects: number;
  totalCampaigns: number;
  totalContacts: number;
  totalMessages: number;
  successfulMessages: number;
  failedMessages: number;
}

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  
  const [user, setUser] = useState<UserDetail | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les détails de l'utilisateur
  const fetchUserDetails = async () => {
    setIsLoading(true);
    try {
      const [userResponse, statsResponse] = await Promise.all([
        fetch(`/api/admin/users/${userId}`),
        fetch(`/api/admin/users/${userId}/stats`)
      ]);

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData);
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des détails utilisateur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  // Colonnes pour le tableau des projets
  const projectColumns: ColumnDef<any>[] = [
    {
      accessorKey: "sender_name",
      header: "Nom du projet",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("sender_name") as string}</div>
      ),
    },
    {
      accessorKey: "_count.campaigns",
      header: "Campagnes",
      cell: ({ row }) => (
        <Badge variant="outline">
          {row.getValue("_count.campaigns") as number} campagne{(row.getValue("_count.campaigns") as number) > 1 ? 's' : ''}
        </Badge>
      ),
    },
    {
      accessorKey: "_count.phonebooks",
      header: "Carnets",
      cell: ({ row }) => (
        <Badge variant="outline">
          {row.getValue("_count.phonebooks") as number} carnet{(row.getValue("_count.phonebooks") as number) > 1 ? 's' : ''}
        </Badge>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Créé le",
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at") as string);
        return (
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm">
              {date.toLocaleDateString('fr-FR')}
            </span>
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FB953C]"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <User className="w-12 h-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-500">Utilisateur non trouvé</p>
        <Button onClick={() => router.push('/admin/users')} className="mt-4">
          Retour à la liste
        </Button>
      </div>
    );
  }

  const displayName = user.name || 
    (user.UserProfile ? `${user.UserProfile.first_name} ${user.UserProfile.last_name}` : user.email);

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          onClick={() => router.push('/admin/users')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Détails de l'utilisateur</h1>
          <p className="text-gray-500">Informations complètes sur {displayName}</p>
        </div>
      </div>

      <div className="w-[90%] m-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informations utilisateur */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informations personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg font-bold">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-lg">{displayName}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{user.email}</span>
                    {user.emailVerified && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </div>

                  {user.UserProfile?.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{user.UserProfile.phone}</span>
                    </div>
                  )}

                  {(user.UserProfile?.city || user.UserProfile?.country) && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">
                        {user.UserProfile.city}{user.UserProfile.city && user.UserProfile.country ? ', ' : ''}
                        {user.UserProfile.country}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                      Inscrit le {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Type de compte</span>
                    <Badge className={
                      user.UserProfile?.account_type === 'BUSINESS' ? 'bg-green-100 text-green-800' :
                      user.UserProfile?.account_type === 'ENTERPRISE' ? 'bg-purple-100 text-purple-800' :
                      'bg-blue-100 text-blue-800'
                    }>
                      {user.UserProfile?.account_type === 'BUSINESS' ? 'Entreprise' :
                       user.UserProfile?.account_type === 'ENTERPRISE' ? 'Enterprise' : 'Particulier'}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Statut</span>
                    <div className="flex items-center gap-2">
                      {user.UserProfile?.is_ban ? (
                        <Badge variant="destructive">Banni</Badge>
                      ) : user.UserProfile?.is_admin ? (
                        <Badge className="bg-red-100 text-red-800">Admin</Badge>
                      ) : user.emailVerified ? (
                        <Badge className="bg-green-100 text-green-800">Vérifié</Badge>
                      ) : (
                        <Badge variant="outline">Non vérifié</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Statistiques et projets */}
          <div className="lg:col-span-2 space-y-6">
            {/* Statistiques */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Folder className="w-5 h-5 text-blue-500" />
                      <div>
                        <div className="text-2xl font-bold">{stats.totalProjects}</div>
                        <div className="text-sm text-gray-500">Projets</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-green-500" />
                      <div>
                        <div className="text-2xl font-bold">{stats.totalCampaigns}</div>
                        <div className="text-sm text-gray-500">Campagnes</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-orange-500" />
                      <div>
                        <div className="text-2xl font-bold">{stats.totalContacts}</div>
                        <div className="text-sm text-gray-500">Contacts</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-purple-500" />
                      <div>
                        <div className="text-2xl font-bold">{stats.totalMessages}</div>
                        <div className="text-sm text-gray-500">Messages</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Projets */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Folder className="w-5 h-5" />
                  Projets ({user.Project.length})
                </CardTitle>
                <CardDescription>
                  Liste de tous les projets créés par cet utilisateur
                </CardDescription>
              </CardHeader>
              <CardContent>
                {user.Project.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                    <Folder className="w-12 h-12 mb-4 text-gray-300" />
                    <p className="text-lg font-medium">Aucun projet</p>
                    <p className="text-sm">Cet utilisateur n'a pas encore créé de projet</p>
                  </div>
                ) : (
                  <DataTable 
                    data={user.Project} 
                    columns={projectColumns} 
                    searchColumn="sender_name" 
                    searchPlaceholder="Rechercher un projet..." 
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
