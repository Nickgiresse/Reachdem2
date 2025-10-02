"use client";
import {
  RefreshCcw,
  History,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { MessageTableSkeleton } from "@/components/ui/table-skeleton";

interface MessageHistory {
  id: string;
  messageId: string;
  content: string;
  recipient: string;
  status: "PENDING" | "SENT" | "DELIVERED" | "FAILED" | "EXPIRED";
  date: string;
  project: string;
  group: string;
  campaign: string;
}

export default function HistoriquePage() {
  const [messages, setMessages] = useState<MessageHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fonction pour charger l'historique des messages
  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/dashboard/messages');
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        console.error('Erreur lors du chargement de l\'historique des messages');
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique des messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Charger l'historique au montage du composant
  useEffect(() => {
    fetchMessages();
  }, []);

  // Fonction pour obtenir l'icône du statut
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

  // Fonction pour obtenir la couleur du statut
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

  // Fonction pour traduire le statut
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

  const columns: ColumnDef<MessageHistory>[] = [
    {
      accessorKey: "content",
      header: "Message",
      cell: ({ row }) => {
        const content = row.getValue("content") as string;
        return (
          <div className="max-w-xs">
            <p className="text-sm font-medium text-gray-900 truncate" title={content}>
              {content}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "recipient",
      header: "Destinataire",
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">
          {row.getValue("recipient") as string}
        </div>
      ),
    },
    {
      accessorKey: "campaign",
      header: "Campagne",
      cell: ({ row }) => (
        <div className="text-sm font-medium text-blue-600">
          {row.getValue("campaign") as string}
        </div>
      ),
    },
    {
      accessorKey: "group",
      header: "Groupe",
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">
          {row.getValue("group") as string}
        </div>
      ),
    },
    {
      accessorKey: "project",
      header: "Projet",
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">
          {row.getValue("project") as string}
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
      accessorKey: "date",
      header: "Date d'envoi",
      cell: ({ row }) => (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          {row.getValue("date") as string}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row items-center justify-between m-auto w-[90%]">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <History color="#000000" />
            <h1 className="text-2xl font-bold">Historique des messages</h1>
          </div>
          <p className="text-gray-500">
            Consultez l'historique de tous vos messages envoyés
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={fetchMessages}
            className="flex items-center gap-2 bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-900"
          >
            <RefreshCcw color="#000000" />
            Actualiser
          </Button>
        </div>
      </div>

      <div className="w-[90%] m-auto mt-2"></div>

      <div className="bg-white border border-zinc-200 rounded-xl shadow-sm transition-shadow duration-200 hover:shadow-md">
        <div className="overflow-x-auto w-[90%] m-auto border-b border-zinc-200 min-h-[500px]">
          <div className="py-4">
            {isLoading ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-8 w-64 bg-zinc-200 rounded animate-pulse" />
                  <div className="h-8 w-32 bg-zinc-200 rounded animate-pulse" />
                </div>
                <MessageTableSkeleton />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
                <MessageSquare className="w-12 h-12 mb-4 text-zinc-300" />
                <p className="text-lg font-medium">Aucun message</p>
                <p className="text-sm">L'historique de vos messages apparaîtra ici</p>
              </div>
            ) : (
              <DataTable 
                data={messages} 
                columns={columns} 
                searchColumn="content" 
                searchPlaceholder="Rechercher un message..." 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
