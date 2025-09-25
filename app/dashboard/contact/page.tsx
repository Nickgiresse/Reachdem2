"use client";
import {
  Plus,
  RefreshCcw,
  Users,
  UserRoundPlus,
  FileUp,
  CircleX,
  UserPlus,
  Check,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/motion-primitives/dialog";
import { Variants, Transition } from "motion/react";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TransitionPanel } from "@/components/motion-primitives/transition-panel";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { useToast } from "@/hooks/use-toast";
import { useConfirmation } from "@/hooks/use-confirmation";
import { useNotification } from "@/hooks/use-notification";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { NotificationDialog } from "@/components/ui/notification-dialog";

import { Label } from "@/components/ui/label";
import { ContactTableSkeleton } from "@/components/ui/table-skeleton";

export default function Contact() {
  const router = useRouter();
  const customVariants: Variants = {
    initial: {
      opacity: 0,
      scale: 0.95,
      y: 40,
    },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 40,
    },
  };

  const customTransition: Transition = {
    type: "spring",
    bounce: 0,
    duration: 0.25,
  };

  const [activeIndex, setActiveIndex] = useState(0);
  const [contacts, setContacts] = useState<
    {
      id: string;
      name: string;
      email: string;
      phone: string;
      address: string;
      addedAt: string;
      groups?: {
        group_id: string;
        name: string;
      }[];
    }[]
  >([]);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);
  const [groups, setGroups] = useState<{
    group_id: string;
    name: string;
    description?: string;
  }[]>([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [isAddingToGroup, setIsAddingToGroup] = useState(false);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  
  const { toast } = useToast();
  const confirmation = useConfirmation();
  const notification = useNotification();
  
  // États pour le formulaire
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Fonction pour charger les contacts
  const fetchContacts = async (): Promise<void> => {
    setIsLoadingContacts(true);
    try {
      const response = await fetch("/api/contacts");
      if (response.ok) {
        const data = await response.json();
        setContacts(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des contacts:", error);
    } finally {
      setIsLoadingContacts(false);
    }
  };

  // Fonction pour charger les groupes
  const fetchGroups = async (): Promise<void> => {
    try {
      const response = await fetch("/api/groups");
      if (response.ok) {
        const data = await response.json();
        setGroups(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des groupes:", error);
    }
  };

  // Charger les contacts et groupes au montage du composant
  useEffect(() => {
    fetchContacts();
    fetchGroups();
  }, []);

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Réinitialiser le formulaire
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          address: "",
        });
        // Recharger les contacts
        fetchContacts();
      } else {
        const error = await response.json();
        toast({
          variant: "destructive",
          title: "Erreur",
          description: `${error.error}${error.details ? `\nDétails: ${error.details}` : ''}`,
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du contact:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors de l'ajout du contact",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fonction pour gérer les changements dans les champs du formulaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Fonction pour réinitialiser le formulaire
  const handleReset = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
    });
  };

  // Fonction pour gérer la sélection/désélection de contacts
  const handleContactToggle = (contactId: string) => {
    setSelectedContacts(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  // Fonction pour sélectionner/désélectionner tous les contacts
  const handleSelectAll = () => {
    if (selectedContacts.length === contacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(contacts.map(contact => contact.id));
    }
  };

  // Fonction pour ajouter les contacts sélectionnés à un groupe
  const handleAddToGroup = async () => {
    if (!selectedGroup || selectedContacts.length === 0) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner un groupe et au moins un contact",
      });
      return;
    }

    setIsAddingToGroup(true);
    try {
      const response = await fetch('/api/groups/add-contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          group_id: selectedGroup,
          contact_ids: selectedContacts,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        notification.show({
          title: "Succès",
          description: result.message || `${selectedContacts.length} contact(s) ajouté(s) au groupe avec succès !`,
          variant: "success",
        });
        setSelectedContacts([]);
        setSelectedGroup('');
        setIsGroupDialogOpen(false);
        fetchContacts(); // Recharger pour voir les mises à jour
      } else {
        const error = await response.json();
        toast({
          variant: "destructive",
          title: "Erreur",
          description: error.error || "Erreur lors de l'ajout des contacts au groupe",
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout des contacts au groupe:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors de l'ajout des contacts au groupe",
      });
    } finally {
      setIsAddingToGroup(false);
    }
  };

  // Fonction pour supprimer un contact
  const handleDeleteContact = async (contactId: string) => {
    confirmation.confirm(
      {
        title: "Supprimer le contact",
        description: "Êtes-vous sûr de vouloir supprimer ce contact ?",
        confirmText: "Supprimer",
        cancelText: "Annuler",
        variant: "destructive",
      },
      async () => {
        try {
          const response = await fetch(`/api/contacts/${contactId}`, {
            method: "DELETE",
          });

          if (response.ok) {
            // Recharger les contacts après suppression
            fetchContacts();
            notification.show({
              title: "Succès",
              description: "Contact supprimé avec succès !",
              variant: "success",
            });
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
        }
      }
    );
  };

  const contactColumns: ColumnDef<{
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    addedAt: string;
    groups?: {
      group_id: string;
      name: string;
    }[];
  }>[] = [
    {
      id: "select",
      header: () => (
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={selectedContacts.length === contacts.length && contacts.length > 0}
            onChange={handleSelectAll}
            className="w-4 h-4 text-[#FB953C] border-zinc-300 rounded focus:ring-[#FB953C] focus:ring-2"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={selectedContacts.includes(row.original.id)}
            onChange={() => handleContactToggle(row.original.id)}
            className="w-4 h-4 text-[#FB953C] border-zinc-300 rounded focus:ring-[#FB953C] focus:ring-2"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    { 
      accessorKey: "name", 
      header: "Nom",
      cell: ({ row }) => (
        <button
          onClick={() => router.push(`/dashboard/contact/${row.original.id}`)}
          className="text-left text-blue-600 hover:text-blue-800 hover:underline font-medium"
        >
          {row.getValue("name") as string}
        </button>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <span className="lowercase">{row.getValue("email") as string}</span>
      ),
    },
    { accessorKey: "phone", header: "Téléphone" },
    { accessorKey: "address", header: "Adresse" },
    {
      accessorKey: "groups",
      header: "Groupes",
      cell: ({ row }) => {
        const groups = row.getValue("groups") as { group_id: string; name: string; }[] | undefined;
        if (!groups || groups.length === 0) {
          return <span className="text-zinc-400 text-sm">Aucun groupe</span>;
        }
        return (
          <div className="flex flex-wrap gap-1">
            {groups.map((group) => (
              <span
                key={group.group_id}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {group.name}
              </span>
            ))}
          </div>
        );
      },
    },
    { accessorKey: "addedAt", header: "Ajouté le" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          onClick={() => handleDeleteContact(row.original.id)}
          variant="destructive"
          size="sm"
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          Supprimer
        </Button>
      ),
    },
  ];

  const ITEMS = [
    {
      title: "Contact unique",
      icon: UserRoundPlus,
    },
    {
      title: "Import CSV/Excel",
      icon: FileUp,
    },
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row items-center justify-between m-auto w-[90%]">
        <div className="flex flex-col  gap-1">
          <div className="flex items-center gap-2">
            <Users color="#000000" />
            <h1 className="text-2xl font-bold">Contacts</h1>
          </div>
          <p className="text-gray-500">
            Gerer vos contacts pour vos campagnes de marketing
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedContacts.length > 0 && (
            <Button 
              onClick={() => setIsGroupDialogOpen(true)}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white"
            >
              <UserPlus className="w-4 h-4" />
              Ajouter au groupe ({selectedContacts.length})
            </Button>
          )}
          <Button 
            onClick={fetchContacts}
            className="flex items-center gap-2 bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-900"
          >
            <RefreshCcw color="#000000" />
            Actualiser
          </Button>

          <Dialog variants={customVariants} transition={customTransition}>
            <DialogTrigger className="bg-[#FB953C] px-4 py-2 text-sm text-white hover:bg-[#FB953C]/80 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100">
              <Plus color="#ffffff" />
              Nouveau groupe
            </DialogTrigger>
            <DialogContent className="w-full max-w-md bg-white p-6 dark:bg-zinc-900">
              <DialogHeader>
                <DialogTitle className="text-zinc-900 dark:text-white">
                  Creer contact
                </DialogTitle>
                <DialogDescription className="text-zinc-600 dark:text-zinc-400">
                  Enter your email address to receive updates when we launch.
                </DialogDescription>
              </DialogHeader>
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
                      <item.icon />
                      <span>{item.title}</span>
                    </button>
                  ))}
                </div>
                <div className="overflow-hidden border-t border-zinc-200 dark:border-zinc-700">
                  <TransitionPanel
                    activeIndex={activeIndex}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    variants={{
                      enter: { opacity: 0, y: -50, filter: "blur(4px)" },
                      center: { opacity: 1, y: 0, filter: "blur(0px)" },
                      exit: { opacity: 0, y: 50, filter: "blur(4px)" },
                    }}
                  >
                    {/** Panel 0: Formulaire */}
                    <form onSubmit={handleSubmit} className="mt-6 flex flex-col space-y-4">
                      <label htmlFor="firstName" className="sr-only text-black">
                        Prénom
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 text-base text-zinc-900 outline-hidden focus:ring-2 focus:ring-black/5 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:ring-white/5 sm:text-sm"
                        placeholder="Entrez votre prénom"
                      />
                      <input
                        id="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 text-base text-zinc-900 outline-hidden focus:ring-2 focus:ring-black/5 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:ring-white/5 sm:text-sm"
                        placeholder="Entrez votre nom"
                      />
                      <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 text-base text-zinc-900 outline-hidden focus:ring-2 focus:ring-black/5 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:ring-white/5 sm:text-sm"
                        placeholder="Entrez votre email"
                      />
                      <input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 text-base text-zinc-900 outline-hidden focus:ring-2 focus:ring-black/5 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:ring-white/5 sm:text-sm"
                        placeholder="Entrez votre téléphone"
                      />
                      <input
                        id="address"
                        type="text"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 text-base text-zinc-900 outline-hidden focus:ring-2 focus:ring-black/5 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:ring-white/5 sm:text-sm"
                        placeholder="Entrez votre adresse"
                      />
                      <div className="flex flex-row justify-between items-center">
                        <Button 
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-[#FB953C] text-white border-1 border-gray-200 rounded-md px-4 hover:bg-[#FB953C]/80 disabled:opacity-50"
                        >
                          {isSubmitting ? "Ajout en cours..." : "Ajouter"}
                        </Button>
                        <Button 
                          type="button"
                          onClick={handleReset}
                          className="bg-white text-black border-1 border-gray-200 rounded-md px-4 hover:bg-gray-200 hover:text-black"
                        >
                          Réinitialiser
                        </Button>
                      </div>
                    </form>
                    {/** Panel 1: Bonjour */}
                    <div className="m-auto flex flex-col justify-center items-center w-full p-4">
                      <CircleX color="#a80000" />
                      <p className="text-sm text-zinc-500">
                        revener plus tard.
                      </p>
                    </div>
                  </TransitionPanel>
                </div>
              </div>
              <DialogClose />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* <div className="w-[90%] m-auto mt-2">
        <div className="group relative inline-block">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-zinc-800">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Rechercher un contact..."
            className="h-9 w-full md:w-72 rounded-lg border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-900 outline-hidden placeholder:text-zinc-400 transition-all duration-200 focus:border-zinc-300 focus:shadow-sm focus:ring-2 focus:ring-black/5 group-hover:shadow-sm"
          />
          <span className="pointer-events-none absolute left-2 right-2 bottom-0 h-[2px] origin-left scale-x-0 bg-[#FB953C] transition-transform duration-200 group-focus-within:scale-x-100"></span>
        </div>
      </div> */}

      <hr className="w-full m-auto my-4" />
      <div className="bg-white border border-zinc-200 rounded-xl shadow-sm transition-shadow duration-200 hover:shadow-md p-4">
        {isLoadingContacts ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-8 w-64 bg-zinc-200 rounded animate-pulse" />
              <div className="h-8 w-32 bg-zinc-200 rounded animate-pulse" />
            </div>
            <ContactTableSkeleton />
          </div>
        ) : contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
            <Users className="w-12 h-12 mb-4 text-zinc-300" />
            <p className="text-lg font-medium">Aucun contact</p>
            <p className="text-sm">Créez votre premier contact pour commencer</p>
          </div>
        ) : (
        <DataTable
          data={contacts}
          columns={contactColumns}
          searchColumn="name"
          searchPlaceholder="Rechercher un contact..."
        />
        )}
      </div>

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

      {/* Dialog pour ajouter les contacts à un groupe */}
      <Dialog open={isGroupDialogOpen} onOpenChange={setIsGroupDialogOpen}>
        <DialogContent className="w-full max-w-md bg-white p-6 dark:bg-zinc-900">
          <DialogHeader>
            <DialogTitle className="text-zinc-900 dark:text-white">
              Ajouter au groupe
            </DialogTitle>
            <DialogDescription className="text-zinc-600 dark:text-zinc-400">
              Sélectionnez le groupe dans lequel vous voulez ajouter {selectedContacts.length} contact(s).
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-6 space-y-4">
            <div>
              <Label htmlFor="group">Groupe de destination</Label>
              <select
                id="group"
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FB953C] focus:border-transparent"
              >
                <option value="">Sélectionnez un groupe</option>
                {groups.map((group) => (
                  <option key={group.group_id} value={group.group_id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedContacts.length > 0 && (
              <div className="bg-zinc-50 p-3 rounded-md">
                <p className="text-sm font-medium text-zinc-700 mb-2">
                  Contacts sélectionnés ({selectedContacts.length}):
                </p>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {selectedContacts.map(contactId => {
                    const contact = contacts.find(c => c.id === contactId);
                    return contact ? (
                      <div key={contactId} className="text-xs text-zinc-600 flex items-center gap-2">
                        <Check className="w-3 h-3 text-green-500" />
                        {contact.name}
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setIsGroupDialogOpen(false);
                setSelectedGroup('');
              }}
            >
              Annuler
            </Button>
            <Button
              onClick={handleAddToGroup}
              disabled={!selectedGroup || isAddingToGroup}
              className="bg-[#FB953C] hover:bg-[#FB953C]/80 text-white"
            >
              {isAddingToGroup ? 'Ajout en cours...' : 'Ajouter au groupe'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
