"use client";
import {
  ArrowLeft,
  Boxes,
  Users,
  Calendar,
  FileText,
  Edit,
  Trash2,
  RefreshCcw,
  User,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useConfirmation } from "@/hooks/use-confirmation";
import { useNotification } from "@/hooks/use-notification";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { NotificationDialog } from "@/components/ui/notification-dialog";

interface GroupDetail {
  group_id: string;
  name: string;
  description: string;
  members: number;
  createdAt: string;
  contacts: {
    contact_id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    addedAt: string;
  }[];
}

export default function GroupDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [group, setGroup] = useState<GroupDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { toast } = useToast();
  const confirmation = useConfirmation();
  const notification = useNotification();

  // Charger les détails du groupe
  const fetchGroup = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/groups/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setGroup(data);
      } else if (response.status === 404) {
        toast({
          variant: "destructive",
          title: "Groupe non trouvé",
          description: "Le groupe demandé n'existe pas.",
        });
        router.push("/dashboard/groupe");
      } else {
        const error = await response.json();
        toast({
          variant: "destructive",
          title: "Erreur",
          description: error.error || "Erreur lors du chargement du groupe",
        });
      }
    } catch (error) {
      console.error("Erreur lors du chargement du groupe:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors du chargement du groupe",
      });
    } finally {
      setIsLoading(false);
    }
  }, [params.id, toast, router]);

  useEffect(() => {
    fetchGroup();
  }, [fetchGroup]);

  // Supprimer le groupe
  const handleDeleteGroup = async () => {
    confirmation.confirm(
      {
        title: "Supprimer le groupe",
        description: "Êtes-vous sûr de vouloir supprimer ce groupe ? Cette action est irréversible et supprimera toutes les relations avec les contacts.",
        confirmText: "Supprimer",
        cancelText: "Annuler",
        variant: "destructive",
      },
      async () => {
        setIsDeleting(true);
        try {
          const response = await fetch(`/api/groups?id=${params.id}`, {
            method: "DELETE",
          });

          if (response.ok) {
            notification.show({
              title: "Succès",
              description: "Groupe supprimé avec succès !",
              variant: "success",
            });
            // Rediriger vers la liste des groupes après un délai
            setTimeout(() => {
              router.push("/dashboard/groupe");
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
          console.error("Erreur lors de la suppression du groupe:", error);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Erreur lors de la suppression du groupe",
          });
        } finally {
          setIsDeleting(false);
        }
      }
    );
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

  if (!group) {
    return (
      <div className="w-[90%] m-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/groupe")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold">Groupe non trouvé</h1>
        </div>
        <Card className="p-6 text-center">
          <Boxes className="w-12 h-12 mx-auto mb-4 text-zinc-400" />
          <p className="text-zinc-500">{"Le groupe demandé n'existe pas."}</p>
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
            onClick={() => router.push("/dashboard/groupe")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{group.name}</h1>
            <p className="text-zinc-500">Détails du groupe</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={fetchGroup}
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
              // TODO: Implémenter l'édition du groupe
              toast({
                title: "Fonctionnalité à venir",
                description: "L'édition des groupes sera bientôt disponible.",
              });
            }}
          >
            <Edit className="w-4 h-4" />
            Modifier
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteGroup}
            disabled={isDeleting}
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            {isDeleting ? "Suppression..." : "Supprimer"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informations du groupe */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Boxes className="w-5 h-5 text-[#FB953C]" />
            <h2 className="text-lg font-semibold">Informations du groupe</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Boxes className="w-4 h-4 text-zinc-400" />
              <div>
                <p className="text-sm text-zinc-500">Nom du groupe</p>
                <p className="font-medium">{group.name}</p>
              </div>
            </div>
            {group.description && (
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-zinc-400" />
                <div>
                  <p className="text-sm text-zinc-500">Description</p>
                  <p className="font-medium">{group.description}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4 text-zinc-400" />
              <div>
                <p className="text-sm text-zinc-500">Nombre de membres</p>
                <p className="font-medium">{group.members} contact(s)</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-zinc-400" />
              <div>
                <p className="text-sm text-zinc-500">Créé le</p>
                <p className="font-medium">{group.createdAt}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Statistiques */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-[#FB953C]" />
            <h2 className="text-lg font-semibold">Statistiques</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Total des membres</p>
                  <p className="text-sm text-zinc-500">Contacts dans ce groupe</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-600">{group.members}</div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Date de création</p>
                  <p className="text-sm text-zinc-500">Groupe créé le</p>
                </div>
              </div>
              <div className="text-sm font-medium text-green-600">{group.createdAt}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Liste des contacts */}
      <Card className="p-6 mt-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-[#FB953C]" />
          <h2 className="text-lg font-semibold">Membres du groupe ({group.contacts.length})</h2>
        </div>
        {group.contacts.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 mx-auto mb-4 text-zinc-300" />
            <p className="text-zinc-500">Ce groupe ne contient aucun contact</p>
            <p className="text-sm text-zinc-400 mt-1">
              Vous pouvez ajouter des contacts depuis la page des contacts
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {group.contacts.map((contact) => (
              <div
                key={contact.contact_id}
                className="p-4 border border-zinc-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push(`/dashboard/contact/${contact.contact_id}`)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#FB953C] rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-zinc-900 truncate">{contact.name}</h3>
                    {contact.email && (
                      <div className="flex items-center gap-1 mt-1">
                        <Mail className="w-3 h-3 text-zinc-400" />
                        <p className="text-xs text-zinc-500 truncate">{contact.email}</p>
                      </div>
                    )}
                    <div className="flex items-center gap-1 mt-1">
                      <Phone className="w-3 h-3 text-zinc-400" />
                      <p className="text-xs text-zinc-500">{contact.phone}</p>
                    </div>
                    {contact.address && (
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-zinc-400" />
                        <p className="text-xs text-zinc-500 truncate">{contact.address}</p>
                      </div>
                    )}
                    <p className="text-xs text-zinc-400 mt-2">Ajouté le {contact.addedAt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

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