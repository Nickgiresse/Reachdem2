'use client';
import {
  RefreshCcw,
  Users,
  CircleX,
  MessageSquareMore,
} from "lucide-react";

import { Button } from "@/components/ui/button";



import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TransitionPanel } from "@/components/motion-primitives/transition-panel";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import ButFormCamp from "@/components/butFormCamp";
import { CampaignTableSkeleton } from "@/components/ui/table-skeleton";

interface Campaign {
  id: string;
  name: string;
  channel: "SMS" | "Whatsapp";
  createdAt: string;
  status: "Brouillon" | "Programmée" | "Envoyée";
  project?: string;
  group?: string;
  message?: string;
}

export default function Contact() {
  const router = useRouter();
  

  

  const [activeIndex, setActiveIndex] = useState(0);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fonction pour charger les campagnes
  const fetchCampaigns = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/campaigns');
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data);
      } else {
        console.error('Erreur lors du chargement des campagnes');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des campagnes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les campagnes au montage du composant
  useEffect(() => {
    fetchCampaigns();
  }, []);

  const columns: ColumnDef<Campaign>[] = [
    {
      accessorKey: "name",
      header: "Nom",
      cell: ({ row }) => (
        <button
          onClick={() => router.push(`/dashboard/campagne/${row.original.id}`)}
          className="text-left text-blue-600 hover:text-blue-800 hover:underline font-medium"
        >
          {row.getValue("name") as string}
        </button>
      ),
    },
    {
      accessorKey: "channel",
      header: "Canal",
      cell: ({ row }) => <div>{row.getValue("channel")}</div>,
    },
    {
      accessorKey: "message",
      header: "Message",
      cell: ({ row }) => {
        const message = row.getValue("message") as string;
        return (
          <div className="max-w-xs truncate" title={message}>
            {message || 'Aucun message'}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Créée le",
      cell: ({ row }) => <div>{row.getValue("createdAt")}</div>,
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const statusColors = {
          'Brouillon': 'text-yellow-600 bg-yellow-50',
          'Programmée': 'text-blue-600 bg-blue-50',
          'Envoyée': 'text-green-600 bg-green-50',
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors] || 'text-zinc-600 bg-zinc-50'}`}>
            {status}
          </span>
        );
      },
    },
  ];

  const ITEMS = [
    {
      title: "SMS",
    },
    {
      title: "Whatsapp",
    },
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row items-center justify-between m-auto w-[90%]">
        <div className="flex flex-col  gap-1">
          <div className="flex items-center gap-2">
            <Users color="#000000" />
            <h1 className="text-2xl font-bold">Campagnes de messages</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={fetchCampaigns}
            className="flex items-center gap-2 bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-900"
          >
            <RefreshCcw color="#000000" />
            Actualiser
          </Button>
          <Button className="flex items-center gap-2 bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-900">
            Envoyer maintenant
          </Button>
        </div>
      </div>

      <div className="w-[90%] m-auto mt-2"></div>

      <div>
        <div className="mb-4 flex space-x-2 flex-row justify-center items-center bg-zinc-100 rounded-md ">
          {ITEMS.map((item, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`rounded-md px-3 py-1 text-sm font-medium w-full flex flex-row justify-center items-center ${
                activeIndex === index
                  ? "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                  : "bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400"
              }`}
            >
              <span>{item.title}</span>
            </button>
          ))}
        </div>
       <ButFormCamp name="Nouvelle campagne"/>
        <div className="overflow-hidden border-t border-zinc-200 dark:border-zinc-700 mt-4">
          <TransitionPanel
            activeIndex={activeIndex}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            variants={{
              enter: { opacity: 0, y: -50, filter: "blur(4px)" },
              center: { opacity: 1, y: 0, filter: "blur(0px)" },
              exit: { opacity: 0, y: 50, filter: "blur(4px)" },
            }}
          >
            {/* button pour ajouter une campagne */}

            {/** Panel 0: Formulaire */}
            <div className="bg-white border border-zinc-200 rounded-xl shadow-sm transition-shadow duration-200 hover:shadow-md">
              <div className="overflow-x-auto w-[90%] m-auto border-b border-zinc-200 min-h-[500px] ">
                <div className="py-4">
                  {isLoading ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="h-8 w-64 bg-zinc-200 rounded animate-pulse" />
                        <div className="h-8 w-32 bg-zinc-200 rounded animate-pulse" />
                      </div>
                      <CampaignTableSkeleton />
                    </div>
                  ) : campaigns.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
                      <MessageSquareMore className="w-12 h-12 mb-4 text-zinc-300" />
                      <p className="text-lg font-medium">Aucune campagne</p>
                      <p className="text-sm">Créez votre première campagne pour commencer</p>
                    </div>
                  ) : (
                    <DataTable data={campaigns} columns={columns} searchColumn="name" searchPlaceholder="Rechercher une campagne..." />
                  )}
                </div>
              </div>
            </div>
            {/** Panel 1: Bonjour */}
            <div className="m-auto flex flex-col justify-center items-center w-full p-4">
              <CircleX color="#a80000" />
              <p className="text-sm text-zinc-500">revener plus tard.</p>
            </div>
          </TransitionPanel>
        </div>
      </div>
    </div>
  );
}
