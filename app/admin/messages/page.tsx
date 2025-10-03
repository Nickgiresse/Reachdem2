"use client";
import {
  MessageSquare,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Calendar,
  User,
  Mail,
  Phone,
  Eye,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect } from "react";

interface Message {
  id: string;
  content: string;
  status: "PENDING" | "SENT" | "DELIVERED" | "FAILED" | "EXPIRED";
  sentAt?: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  campaign: {
    id: string;
    name: string;
  };
  project: {
    id: string;
    name: string;
  };
  group: {
    id: string;
    name: string;
  };
  recipient: {
    name: string;
    phone: string;
    email?: string;
  };
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/admin/messages');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des messages');
        }
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Erreur lors du chargement des messages:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Erreur lors du chargement des messages",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [toast]);

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.recipient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.recipient.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || message.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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
      case 'DELIVERED':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'SENT':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'PENDING':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'FAILED':
      case 'EXPIRED':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'text-green-600 bg-green-50';
      case 'SENT':
        return 'text-blue-600 bg-blue-50';
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-50';
      case 'FAILED':
      case 'EXPIRED':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const translateStatus = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'Livré';
      case 'SENT':
        return 'Envoyé';
      case 'PENDING':
        return 'En attente';
      case 'FAILED':
        return 'Échec';
      case 'EXPIRED':
        return 'Expiré';
      default:
        return status;
    }
  };

  const columns: ColumnDef<Message>[] = [
    {
      accessorKey: "content",
      header: "Message",
      cell: ({ row }) => (
        <div className="max-w-xs">
          <p className="text-sm font-medium truncate" title={row.getValue("content")}>
            {row.getValue("content")}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "recipient",
      header: "Destinataire",
      cell: ({ row }) => {
        const recipient = row.getValue("recipient") as Message["recipient"];
        return (
          <div>
            <div className="font-medium text-sm">{recipient.name}</div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Phone className="w-3 h-3" />
              {recipient.phone}
            </div>
            {recipient.email && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Mail className="w-3 h-3" />
                {recipient.email}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "user",
      header: "Expéditeur",
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
      accessorKey: "campaign",
      header: "Campagne",
      cell: ({ row }) => (
        <div>
          <div className="text-sm font-medium">{row.original.campaign.name}</div>
          <div className="text-xs text-gray-500">
            Projet: {row.original.project.name}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "group",
      header: "Groupe",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <User className="w-4 h-4 text-gray-400" />
          <span className="text-sm">{row.original.group.name}</span>
        </div>
      ),
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
      accessorKey: "sentAt",
      header: "Envoyé le",
      cell: ({ row }) => {
        const sentAt = row.getValue("sentAt") as string | undefined;
        return sentAt ? (
          <div className="flex items-center gap-1 text-sm">
            <Calendar className="w-4 h-4 text-gray-400" />
            {formatDate(sentAt)}
          </div>
        ) : (
          <span className="text-gray-400 text-sm">Non envoyé</span>
        );
      },
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
            <MessageSquare color="#000000" />
            <h1 className="text-2xl font-bold">Gestion des Messages</h1>
          </div>
          <p className="text-gray-500">
            Historique complet de tous les messages envoyés
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-[#FB953C] hover:bg-[#FB953C]/80 text-white">
            <MessageSquare className="w-4 h-4 mr-2" />
            Exporter les messages
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messages.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Livrés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {messages.filter(m => m.status === 'DELIVERED').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Envoyés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {messages.filter(m => m.status === 'SENT').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {messages.filter(m => m.status === 'PENDING').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Échoués</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {messages.filter(m => m.status === 'FAILED' || m.status === 'EXPIRED').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des messages */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des messages</CardTitle>
          <CardDescription>
            Tous les messages envoyés sur la plateforme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher par contenu, expéditeur ou destinataire..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FB953C]"
            >
              <option value="all">Tous les statuts</option>
              <option value="DELIVERED">Livrés</option>
              <option value="SENT">Envoyés</option>
              <option value="PENDING">En attente</option>
              <option value="FAILED">Échoués</option>
              <option value="EXPIRED">Expirés</option>
            </select>
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
              data={filteredMessages}
              columns={columns}
              searchColumn="content"
              searchPlaceholder="Rechercher un message..."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
