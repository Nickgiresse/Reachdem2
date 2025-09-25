"use client";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  Edit,
  Trash2,
  RefreshCcw,
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

interface ContactDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  addedAt: string;
  groups: {
    group_id: string;
    name: string;
  }[];
}

export default function ContactDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [contact, setContact] = useState<ContactDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { toast } = useToast();
  const confirmation = useConfirmation();
  const notification = useNotification();

  // Charger les détails du contact
  const fetchContact = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/contacts/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setContact(data);
      } else if (response.status === 404) {
        toast({
          variant: "destructive",
          title: "Contact non trouvé",
          description: "Le contact demandé n&apos;existe pas.",
        });
        router.push("/dashboard/contact");
      } else {
        const error = await response.json();
        toast({
          variant: "destructive",
          title: "Erreur",
          description: error.error || "Erreur lors du chargement du contact",
        });
      }
    } catch (error) {
      console.error("Erreur lors du chargement du contact:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors du chargement du contact",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContact();
  }, [params.id]);

  // Supprimer le contact
  const handleDeleteContact = async () => {
    confirmation.confirm(
      {
        title: "Supprimer le contact",
        description: "Êtes-vous sûr de vouloir supprimer ce contact ? Cette action est irréversible.",
        confirmText: "Supprimer",
        cancelText: "Annuler",
        variant: "destructive",
      },
      async () => {
        setIsDeleting(true);
        try {
          const response = await fetch(`/api/contacts/${params.id}`, {
            method: "DELETE",
          });

          if (response.ok) {
            notification.show({
              title: "Succès",
              description: "Contact supprimé avec succès !",
              variant: "success",
            });
            // Rediriger vers la liste des contacts après un délai
            setTimeout(() => {
              router.push("/dashboard/contact");
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
          console.error("Erreur lors de la suppression du contact:", error);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Erreur lors de la suppression du contact",
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

  if (!contact) {
    return (
      <div className="w-[90%] m-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/contact")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold">Contact non trouvé</h1>
        </div>
        <Card className="p-6 text-center">
          <User className="w-12 h-12 mx-auto mb-4 text-zinc-400" />
          <p className="text-zinc-500">{"Le contact demandé n'existe pas."}</p>
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
            onClick={() => router.push("/dashboard/contact")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{contact.name}</h1>
            <p className="text-zinc-500">Détails du contact</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={fetchContact}
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
              // TODO: Implémenter l&apos;édition du contact
              toast({
                title: "Fonctionnalité à venir",
                description: "L&apos;édition des contacts sera bientôt disponible.",
              });
            }}
          >
            <Edit className="w-4 h-4" />
            Modifier
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteContact}
            disabled={isDeleting}
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            {isDeleting ? "Suppression..." : "Supprimer"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informations personnelles */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-[#FB953C]" />
            <h2 className="text-lg font-semibold">Informations personnelles</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-zinc-400" />
              <div>
                <p className="text-sm text-zinc-500">Nom complet</p>
                <p className="font-medium">{contact.name}</p>
              </div>
            </div>
            {contact.email && (
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-zinc-400" />
                <div>
                  <p className="text-sm text-zinc-500">Email</p>
                  <p className="font-medium">{contact.email}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-zinc-400" />
              <div>
                <p className="text-sm text-zinc-500">Téléphone</p>
                <p className="font-medium">{contact.phone}</p>
              </div>
            </div>
            {contact.address && (
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-zinc-400" />
                <div>
                  <p className="text-sm text-zinc-500">Adresse</p>
                  <p className="font-medium">{contact.address}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-zinc-400" />
              <div>
                <p className="text-sm text-zinc-500">Ajouté le</p>
                <p className="font-medium">{contact.addedAt}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Groupes */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-[#FB953C]" />
            <h2 className="text-lg font-semibold">Groupes ({contact.groups.length})</h2>
          </div>
          {contact.groups.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 mx-auto mb-4 text-zinc-300" />
              <p className="text-zinc-500">{"Ce contact n'appartient à aucun groupe"}</p>
              <p className="text-sm text-zinc-400 mt-1">
                {"Vous pouvez l'ajouter à un groupe depuis la page des contacts"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {contact.groups.map((group) => (
                <div
                  key={group.group_id}
                  className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#FB953C] rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{group.name}</p>
                      <p className="text-sm text-zinc-500">Groupe</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // TODO: Implémenter la navigation vers le détail du groupe
                      toast({
                        title: "Fonctionnalité à venir",
                        description: "La navigation vers les groupes sera bientôt disponible.",
                      });
                    }}
                  >
                    Voir
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

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
