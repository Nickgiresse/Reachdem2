"use client";
import {
  Megaphone,
  Search,
  Filter,
  Play,
  Pause,
  Square,
  Eye,
  Calendar,
  User,
  MessageSquare,
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

interface Campaign {
  id: string;
  name: string;
  status: "DRAFT" | "SCHEDULED" | "RUNNING" | "COMPLETED" | "PAUSED" | "CANCELLED";
  scheduledAt?: string;
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
  group: {
    id: string;
    name: string;
  };
  messages: {
    id: string;
    content: string;
  }[];
  stats: {
    totalRecipients: number;
    sent: number;
    delivered: number;
    failed: number;
  };
}

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchCampaigns = async () => {
      setIsLoading(true);
      try {
        // Simuler des données pour la démo
        const mockCampaigns: Campaign[] = [
          {
            id: "1",
            name: "Promotion Black Friday",
            status: "COMPLETED",
            scheduledAt: "2024-01-15T10:00:00Z",
            createdAt: "2024-01-14T15:30:00Z",
            updatedAt: "2024-01-15T12:00:00Z",
            user: {
              id: "user1",
              name: "John Doe",
              email: "john.doe@example.com",
            },
            project: {
              id: "project1",
              name: "E-commerce 2024",
            },
            group: {
              id: "group1",
              name: "Clients VIP",
            },
            messages: [
              {
                id: "msg1",
                content: "Découvrez nos offres Black Friday ! Jusqu'à -50% sur tous nos produits.",
              },
            ],
            stats: {
              totalRecipients: 1000,
              sent: 1000,
              delivered: 950,
              failed: 50,
            },
          },
          {
            id: "2",
            name: "Newsletter Janvier",
            status: "RUNNING",
            scheduledAt: "2024-01-16T09:00:00Z",
            createdAt: "2024-01-15T14:20:00Z",
            updatedAt: "2024-01-16T09:00:00Z",
            user: {
              id: "user2",
              name: "Marie Martin",
              email: "marie.martin@example.com",
            },
            project: {
              id: "project2",
              name: "Marketing Digital",
            },
            group: {
              id: "group2",
              name: "Newsletter",
            },
            messages: [
              {
                id: "msg2",
                content: "Bonne année ! Découvrez nos nouveautés de janvier.",
              },
            ],
            stats: {
              totalRecipients: 500,
              sent: 300,
              delivered: 280,
              failed: 20,
            },
          },
          {
            id: "3",
            name: "Rappel de paiement",
            status: "SCHEDULED",
            scheduledAt: "2024-01-17T14:00:00Z",
            createdAt: "2024-01-16T10:15:00Z",
            updatedAt: "2024-01-16T10:15:00Z",
            user: {
              id: "user3",
              name: "Pierre Durand",
              email: "pierre.durand@example.com",
            },
            project: {
              id: "project3",
              name: "Facturation",
            },
            group: {
              id: "group3",
              name: "Clients en retard",
            },
            messages: [
              {
                id: "msg3",
                content: "Rappel : Votre facture est en retard de paiement.",
              },
            ],
            stats: {
              totalRecipients: 50,
              sent: 0,
              delivered: 0,
              failed: 0,
            },
          },
        ];

        setCampaigns(mockCampaigns);
      } catch (error) {
        console.error('Erreur lors du chargement des campagnes:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Erreur lors du chargement des campagnes",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, [toast]);

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.project.name.toLowerCase().includes(searchTerm.toLowerCase())
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'RUNNING':
        return <Play className="w-4 h-4 text-blue-500" />;
      case 'SCHEDULED':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'PAUSED':
        return <Pause className="w-4 h-4 text-orange-500" />;
      case 'CANCELLED':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'DRAFT':
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-600 bg-green-50';
      case 'RUNNING':
        return 'text-blue-600 bg-blue-50';
      case 'SCHEDULED':
        return 'text-yellow-600 bg-yellow-50';
      case 'PAUSED':
        return 'text-orange-600 bg-orange-50';
      case 'CANCELLED':
        return 'text-red-600 bg-red-50';
      case 'DRAFT':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const translateStatus = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'Terminée';
      case 'RUNNING':
        return 'En cours';
      case 'SCHEDULED':
        return 'Programmée';
      case 'PAUSED':
        return 'En pause';
      case 'CANCELLED':
        return 'Annulée';
      case 'DRAFT':
        return 'Brouillon';
      default:
        return status;
    }
  };

  const handleCampaignAction = async (campaignId: string, action: string) => {
    try {
      // Simuler l'action sur la campagne
      setCampaigns(prev => prev.map(campaign => {
        if (campaign.id === campaignId) {
          let newStatus = campaign.status;
          switch (action) {
            case 'pause':
              newStatus = 'PAUSED';
              break;
            case 'resume':
              newStatus = 'RUNNING';
              break;
            case 'cancel':
              newStatus = 'CANCELLED';
              break;
          }
          return { ...campaign, status: newStatus };
        }
        return campaign;
      }));

      toast({
        title: "Succès",
        description: `Campagne ${action === 'pause' ? 'mise en pause' : action === 'resume' ? 'reprise' : 'annulée'} avec succès`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors de l'action sur la campagne",
      });
    }
  };

  const columns: ColumnDef<Campaign>[] = [
    {
      accessorKey: "name",
      header: "Nom de la campagne",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.getValue("name")}</div>
          <div className="text-sm text-gray-500">
            Projet: {row.original.project.name}
          </div>
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
      accessorKey: "group",
      header: "Groupe cible",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <User className="w-4 h-4 text-gray-400" />
          <span className="text-sm">{row.original.group.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "messages",
      header: "Message",
      cell: ({ row }) => {
        const messages = row.getValue("messages") as Campaign["messages"];
        return (
          <div className="max-w-xs">
            <p className="text-sm truncate" title={messages[0]?.content}>
              {messages[0]?.content || 'Aucun message'}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "stats",
      header: "Statistiques",
      cell: ({ row }) => {
        const stats = row.getValue("stats") as Campaign["stats"];
        return (
          <div className="text-sm">
            <div>Destinataires: {stats.totalRecipients}</div>
            <div className="text-green-600">Livrés: {stats.delivered}</div>
            <div className="text-red-600">Échoués: {stats.failed}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <div className="flex items-center gap-2">
            {getStatusIcon(status)}
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
              {translateStatus(status)}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "scheduledAt",
      header: "Programmée le",
      cell: ({ row }) => {
        const scheduledAt = row.getValue("scheduledAt") as string | undefined;
        return scheduledAt ? (
          <div className="flex items-center gap-1 text-sm">
            <Calendar className="w-4 h-4 text-gray-400" />
            {formatDate(scheduledAt)}
          </div>
        ) : (
          <span className="text-gray-400 text-sm">Non programmée</span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const campaign = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4" />
            </Button>
            {campaign.status === 'RUNNING' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCampaignAction(campaign.id, 'pause')}
              >
                <Pause className="w-4 h-4" />
              </Button>
            )}
            {campaign.status === 'PAUSED' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCampaignAction(campaign.id, 'resume')}
              >
                <Play className="w-4 h-4" />
              </Button>
            )}
            {(campaign.status === 'RUNNING' || campaign.status === 'SCHEDULED') && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleCampaignAction(campaign.id, 'cancel')}
              >
                <Square className="w-4 h-4" />
              </Button>
            )}
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
            <Megaphone color="#000000" />
            <h1 className="text-2xl font-bold">Gestion des Campagnes</h1>
          </div>
          <p className="text-gray-500">
            Gérez toutes les campagnes de la plateforme
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-[#FB953C] hover:bg-[#FB953C]/80 text-white">
            <MessageSquare className="w-4 h-4 mr-2" />
            Exporter les campagnes
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">En cours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {campaigns.filter(c => c.status === 'RUNNING').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Programmées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {campaigns.filter(c => c.status === 'SCHEDULED').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Terminées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {campaigns.filter(c => c.status === 'COMPLETED').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">En pause</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {campaigns.filter(c => c.status === 'PAUSED').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Annulées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {campaigns.filter(c => c.status === 'CANCELLED').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des campagnes */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des campagnes</CardTitle>
          <CardDescription>
            Toutes les campagnes créées par les utilisateurs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher par nom, créateur ou projet..."
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
              data={filteredCampaigns}
              columns={columns}
              searchColumn="name"
              searchPlaceholder="Rechercher une campagne..."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
