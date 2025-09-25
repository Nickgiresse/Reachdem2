"use client";
import {
  ArrowLeft,
  MessageSquareMore,
  Users,
  Calendar,
  Clock,
  Send,
  Edit,
  Trash2,
  RefreshCcw,
  FileText,
  Target,
  Smartphone,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useConfirmation } from "@/hooks/use-confirmation";
import { useNotification } from "@/hooks/use-notification";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { NotificationDialog } from "@/components/ui/notification-dialog";

interface CampaignDetail {
  id: string;
  name: string;
  channel: "SMS" | "Whatsapp";
  createdAt: string;
  status: "Brouillon" | "Programmée" | "Envoyée";
  project?: {
    project_id: string;
    sender_name: string;
  };
  group?: {
    group_id: string;
    name: string;
  };
  message?: {
    message_id: string;
    content: string;
    delivered_status: string;
    sent_at?: string;
  };
}

export default function CampaignDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [campaign, setCampaign] = useState<CampaignDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { toast } = useToast();
  const confirmation = useConfirmation();
  const notification = useNotification();

  // Charger les détails de la campagne
  const fetchCampaign = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/campaigns/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setCampaign(data);
      } else if (response.status === 404) {
        toast({
          variant: "destructive",
          title: "Campagne non trouvée",
          description: "La campagne demandée n'existe pas.",
        });
        router.push("/dashboard/campagne");
      } else {
        const error = await response.json();
        toast({
          variant: "destructive",
          title: "Erreur",
          description: error.error || "Erreur lors du chargement de la campagne",
        });
      }
    } catch (error) {
      console.error("Erreur lors du chargement de la campagne:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors du chargement de la campagne",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaign();
  }, [params.id]);

  // Supprimer la campagne
  const handleDeleteCampaign = async () => {
    confirmation.confirm(
      {
        title: "Supprimer la campagne",
        description: "Êtes-vous sûr de vouloir supprimer cette campagne ? Cette action est irréversible.",
        confirmText: "Supprimer",
        cancelText: "Annuler",
        variant: "destructive",
      },
      async () => {
        setIsDeleting(true);
        try {
          const response = await fetch(`/api/campaigns/${params.id}`, {
            method: "DELETE",
          });

          if (response.ok) {
            notification.show({
              title: "Succès",
              description: "Campagne supprimée avec succès !",
              variant: "success",
            });
            // Rediriger vers la liste des campagnes après un délai
            setTimeout(() => {
              router.push("/dashboard/campagne");
            }, 1500);
          } else {
            const error = await response.json();
            toast({
              variant: "destructive",
              title: "Erreur",
              description: `Erreur lors de la suppression: ${error.error}`,
            });
          }
        } catch (error) {
          console.error("Erreur lors de la suppression de la campagne:", error);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Erreur lors de la suppression de la campagne",
          });
        } finally {
          setIsDeleting(false);
        }
      }
    );
  };

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Brouillon":
        return "bg-gray-100 text-gray-800";
      case "Programmée":
        return "bg-yellow-100 text-yellow-800";
      case "Envoyée":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Fonction pour obtenir la couleur du canal
  const getChannelColor = (channel: string) => {
    switch (channel) {
      case "SMS":
        return "bg-orange-100 text-orange-800";
      case "Whatsapp":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="w-[90%] m-auto">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-8 w-8 bg-zinc-200 rounded animate-pulse" />
          <div className="h-8 w-48 bg-zinc-200 rounded animate-pulse" />
        </div>
        <div className="space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="h-6 w-32 bg-zinc-200 rounded animate-pulse" />
              <div className="h-4 w-64 bg-zinc-200 rounded animate-pulse" />
              <div className="h-4 w-48 bg-zinc-200 rounded animate-pulse" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="space-y-4">
              <div className="h-6 w-24 bg-zinc-200 rounded animate-pulse" />
              <div className="h-4 w-32 bg-zinc-200 rounded animate-pulse" />
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="w-[90%] m-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/campagne")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold">Campagne non trouvée</h1>
        </div>
        <Card className="p-6 text-center">
          <MessageSquareMore className="w-12 h-12 mx-auto mb-4 text-zinc-400" />
          <p className="text-zinc-500">La campagne demandée n&apos;existe pas.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-[90%] m-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/campagne")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{campaign.name}</h1>
            <p className="text-zinc-500">Détails de la campagne</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={fetchCampaign}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCcw className="w-4 h-4" />
            Actualiser
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => {
              // TODO: Implémenter l'édition de la campagne
              toast({
                title: "Fonctionnalité à venir",
                description: "L'édition des campagnes sera bientôt disponible.",
              });
            }}
          >
            <Edit className="w-4 h-4" />
            Modifier
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteCampaign}
            disabled={isDeleting}
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            {isDeleting ? "Suppression..." : "Supprimer"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informations de la campagne */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquareMore className="w-5 h-5 text-[#FB953C]" />
            <h2 className="text-lg font-semibold">Informations de la campagne</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <MessageSquareMore className="w-4 h-4 text-zinc-400" />
              <div>
                <p className="text-sm text-zinc-500">Nom de la campagne</p>
                <p className="font-medium">{campaign.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Smartphone className="w-4 h-4 text-zinc-400" />
              <div>
                <p className="text-sm text-zinc-500">Canal</p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getChannelColor(campaign.channel)}`}>
                  {campaign.channel}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-zinc-400" />
              <div>
                <p className="text-sm text-zinc-500">Statut</p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                  {campaign.status}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-zinc-400" />
              <div>
                <p className="text-sm text-zinc-500">Créée le</p>
                <p className="font-medium">{campaign.createdAt}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Cible et projet */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-[#FB953C]" />
            <h2 className="text-lg font-semibold">Cible et projet</h2>
          </div>
          <div className="space-y-4">
            {campaign.project && (
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-zinc-400" />
                <div>
                  <p className="text-sm text-zinc-500">Projet</p>
                  <p className="font-medium">{campaign.project.sender_name}</p>
                  <p className="text-xs text-zinc-400">ID: {campaign.project.project_id}</p>
                </div>
              </div>
            )}
            {campaign.group && (
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-zinc-400" />
                <div>
                  <p className="text-sm text-zinc-500">Groupe cible</p>
                  <button
                    onClick={() => router.push(`/dashboard/groupe/${campaign.group?.group_id}`)}
                    className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {campaign.group.name}
                  </button>
                  <p className="text-xs text-zinc-400">ID: {campaign.group.group_id}</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Message */}
      {campaign.message && (
        <Card className="p-6 mt-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-[#FB953C]" />
            <h2 className="text-lg font-semibold">Message</h2>
          </div>
          <div className="space-y-4">
            <div className="bg-zinc-50 p-4 rounded-lg border">
              <p className="text-sm text-zinc-500 mb-2">Contenu du message</p>
              <p className="font-medium whitespace-pre-wrap">{campaign.message.content}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Send className="w-4 h-4 text-zinc-400" />
                <div>
                  <p className="text-sm text-zinc-500">Statut de livraison</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.message.delivered_status)}`}>
                    {campaign.message.delivered_status}
                  </span>
                </div>
              </div>
              {campaign.message.sent_at && (
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-zinc-400" />
                  <div>
                    <p className="text-sm text-zinc-500">Envoyé le</p>
                    <p className="font-medium">{new Date(campaign.message.sent_at).toLocaleDateString("fr-FR")}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Dialogs */}
      <ConfirmationDialog
        isOpen={confirmation.isOpen}
        onClose={confirmation.handleCancel}
        onConfirm={confirmation.handleConfirm}
        title={confirmation.options.title}
        description={confirmation.options.description}
        confirmText={confirmation.options.confirmText}
        cancelText={confirmation.options.cancelText}
        variant={confirmation.options.variant}
      />

      <NotificationDialog
        isOpen={notification.isOpen}
        onClose={notification.hide}
        title={notification.options.title}
        description={notification.options.description}
        variant={notification.options.variant}
        buttonText={notification.options.buttonText}
      />
    </div>
  );
}
