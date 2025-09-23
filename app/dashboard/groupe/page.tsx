"use client";
import {
  Plus,
  RefreshCcw,
  Boxes,
  CircleX,
  Search,
  User,
  Mail,
  Phone,
  Clock,
  Users,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
//   DialogDescription,
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
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { NotificationDialog } from "@/components/ui/notification-dialog";
import { GroupTableSkeleton } from "@/components/ui/table-skeleton";

export default function Groupe() {
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
  const [isContactPickerOpen, setIsContactPickerOpen] = useState(false);
  const [availableContacts, setAvailableContacts] = useState<{ id: string; name: string; email?: string; phone?: string }[]>([]);
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationData, setNotificationData] = useState({
    title: "",
    description: "",
    variant: "default" as "default" | "destructive" | "success" | "warning"
  });
  const { toast } = useToast();

  const selectedContacts = availableContacts.filter(c => selectedContactIds.includes(c.id));

  // Charger les contacts depuis l'API
  const loadContacts = async () => {
    try {
      const response = await fetch('/api/contacts');
      if (response.ok) {
        const contacts = await response.json();
        setAvailableContacts(contacts);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des contacts:', error);
    }
  };

  // Charger les groupes depuis l'API
  const loadGroups = async () => {
    setIsLoadingGroups(true);
    try {
      const response = await fetch('/api/groups');
      if (response.ok) {
        const groupsData = await response.json();
        setGroups(groupsData);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des groupes:', error);
    } finally {
      setIsLoadingGroups(false);
    }
  };

  // Charger les données au montage du composant
  useEffect(() => {
    loadContacts();
    loadGroups();
  }, []);

  function toggleContactSelection(contactId: string) {
    setSelectedContactIds(prev =>
      prev.includes(contactId) ? prev.filter(id => id !== contactId) : [...prev, contactId]
    );
  }

  // Gérer la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setNotificationData({
        title: "Erreur de validation",
        description: "Veuillez entrer un nom pour le groupe",
        variant: "warning"
      });
      setShowNotification(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          contactIds: selectedContactIds,
        }),
      });

      if (response.ok) {
        const newGroup = await response.json();
        setGroups(prev => [newGroup, ...prev]);
        setFormData({ name: "", description: "" });
        setSelectedContactIds([]);
        setNotificationData({
          title: "Succès",
          description: "Groupe créé avec succès !",
          variant: "success"
        });
        setShowNotification(true);
      } else {
        const error = await response.json();
        toast({
          title: "Erreur",
          description: error.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erreur lors de la création du groupe:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la création du groupe",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Réinitialiser le formulaire
  const handleReset = () => {
    setFormData({ name: "", description: "" });
    setSelectedContactIds([]);
  };

  // Supprimer un groupe
  const handleDeleteGroup = async (groupId: string) => {
    setGroupToDelete(groupId);
    setShowConfirmation(true);
  };

  // Confirmer la suppression
  const confirmDelete = async () => {
    if (!groupToDelete) return;

    try {
      const response = await fetch(`/api/groups?id=${groupToDelete}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setGroups(prev => prev.filter(group => group.group_id !== groupToDelete));
        setNotificationData({
          title: "Succès",
          description: "Groupe supprimé avec succès !",
          variant: "success"
        });
        setShowNotification(true);
      } else {
        const error = await response.json();
        toast({
          title: "Erreur",
          description: error.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du groupe:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression du groupe",
        variant: "destructive",
      });
    } finally {
      setShowConfirmation(false);
      setGroupToDelete(null);
    }
  };

  const ITEMS = [
    {
      title: "Groupes",
      icon: Boxes,
    },
   
  ];

  const [groups, setGroups] = useState<{
    group_id: string;
    name: string;
    description: string;
    members: number;
    createdAt: string;
  }[]>([]);

  const groupColumns: ColumnDef<{
    group_id: string;
    name: string;
    description: string;
    members: number;
    createdAt: string;
  }>[] = [
    { 
      accessorKey: "name", 
      header: "Nom",
      cell: ({ row }) => (
        <button
          onClick={() => router.push(`/dashboard/groupe/${row.original.group_id}`)}
          className="text-left text-blue-600 hover:text-blue-800 hover:underline font-medium"
        >
          {row.getValue("name") as string}
        </button>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <span className="block max-w-[220px] truncate">{row.getValue("description") as string}</span>
      ),
    },
    { accessorKey: "members", header: "Membres" },
    { accessorKey: "createdAt", header: "Date de creation" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => handleDeleteGroup(row.original.group_id)}
          className="h-8 w-8 p-0"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row items-center justify-between m-auto w-[90%]">
        <div className="flex flex-col  gap-1">
          <div className="flex items-center gap-2">
            <Boxes color="#000000" />
            <h1 className="text-2xl font-bold">Groupes</h1>
          </div>
          <p className="text-gray-500">
            Gerer vos contacts pour vos campagnes de marketing
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => {
              loadGroups();
              loadContacts();
            }}
            className="flex items-center gap-2 bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-900"
          >
            <RefreshCcw color="#000000" />
            Actualiser
          </Button>

          <Dialog variants={customVariants} transition={customTransition}>
            <DialogTrigger className="bg-[#FB953C] px-4 py-2 text-sm text-white hover:bg-[#FB953C]/80 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100">
              <Plus color="#ffffff" />
              Ajouter un groupe
            </DialogTrigger>
            <DialogContent className="w-full max-w-md bg-white p-6 dark:bg-zinc-900">
              <DialogHeader>
                <DialogTitle className="text-zinc-900 dark:text-white my-4">
                  Creer un nouveau groupe
                </DialogTitle>
                {/* <DialogDescription className="text-zinc-600 dark:text-zinc-400">
                  Enter your email address to receive updates when we launch.
                </DialogDescription> */}
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
                      <label htmlFor="name" className="sr-only text-black">
                        Nom
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 text-base text-zinc-900 outline-hidden focus:ring-2 focus:ring-black/5 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:ring-white/5 sm:text-sm"
                        placeholder="Entrer le nom du groupe"
                        required
                      />
                      <textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="h-20 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-base text-zinc-900 outline-hidden focus:ring-2 focus:ring-black/5 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:ring-white/5 sm:text-sm resize-none"
                        placeholder="Entrer la description du groupe"
                      />
                      <div className="w-full">
                        <div className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-base text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white">
                          <div className="flex flex-wrap gap-2">
                            {selectedContacts.length === 0 && (
                              <span className="text-sm text-zinc-500">Aucun contact sélectionné</span>
                            )}
                            {selectedContacts.map(c => (
                              <span key={c.id} className="inline-flex items-center gap-2 rounded-md bg-zinc-100 px-2 py-1 text-sm text-zinc-800 dark:bg-zinc-700 dark:text-zinc-100">
                                {c.name}
                                <button
                                  type="button"
                                  onClick={() => toggleContactSelection(c.id)}
                                  className="text-zinc-500 hover:text-zinc-700 dark:hover:text-white"
                                  aria-label={`Retirer ${c.name}`}
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="mt-2">
                          <Button type="button" onClick={() => setIsContactPickerOpen(true)} className="bg-white text-black border-1 border-gray-200 rounded-md px-4 hover:bg-gray-200 hover:text-black">
                            Sélectionner des contacts
                          </Button>
                        </div>
                      </div>
                      {isContactPickerOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                          <div className="w-full max-w-xl rounded-xl bg-white p-4 shadow-lg dark:bg-zinc-900">
                            <div className="mb-3 flex items-center justify-between">
                              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Ajouter des contacts</h3>
                              <button type="button" className="text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100" onClick={() => setIsContactPickerOpen(false)}>✕</button>
                            </div>
                            <div className="max-h-72 overflow-auto rounded-md border border-zinc-200 dark:border-zinc-700">
                              <ul className="divide-y divide-zinc-200 dark:divide-zinc-700">
                                {availableContacts.map(contact => (
                                  <li key={contact.id} className="flex items-center justify-between px-3 py-2">
                                    <div className="min-w-0">
                                      <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">{contact.name}</p>
                                      <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{contact.email ?? contact.phone}</p>
                                    </div>
                      <input
                                      type="checkbox"
                                      className="h-4 w-4"
                                      checked={selectedContactIds.includes(contact.id)}
                                      onChange={() => toggleContactSelection(contact.id)}
                                    />
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="mt-4 flex items-center justify-end gap-2">
                              <Button type="button" className="bg-white text-black border-1 border-gray-200 rounded-md px-4 hover:bg-gray-200 hover:text-black" onClick={() => setIsContactPickerOpen(false)}>
                                Annuler
                              </Button>
                              <Button type="button" className="bg-[#FB953C] text-white border-1 border-gray-200 rounded-md px-4 hover:bg-[#FB953C]/80" onClick={() => setIsContactPickerOpen(false)}>
                                Valider
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex flex-row justify-between items-center">
                        <Button 
                          type="submit"
                          disabled={isLoading}
                          className="bg-[#FB953C] text-white border-1 border-gray-200 rounded-md px-4 hover:bg-[#FB953C]/80 disabled:opacity-50"
                        >
                          {isLoading ? "Création..." : "Ajouter"}
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

      <div className="w-[90%] m-auto mt-2">
        <div className="group relative inline-block">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-zinc-800">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Rechercher un groupe..."
            className="h-9 w-full md:w-72 rounded-lg border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-900 outline-hidden placeholder:text-zinc-400 transition-all duration-200 focus:border-zinc-300 focus:shadow-sm focus:ring-2 focus:ring-black/5 group-hover:shadow-sm"
          />
          <span className="pointer-events-none absolute left-2 right-2 bottom-0 h-[2px] origin-left scale-x-0 bg-[#FB953C] transition-transform duration-200 group-focus-within:scale-x-100"></span>
        </div>
      </div>

        <hr className="w-full my-4" />

      <div className="w-[90%] m-auto mt-2">
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm transition-shadow duration-200 hover:shadow-md p-4">
          {isLoadingGroups ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-8 w-64 bg-zinc-200 rounded animate-pulse" />
                <div className="h-8 w-32 bg-zinc-200 rounded animate-pulse" />
              </div>
              <GroupTableSkeleton />
            </div>
          ) : groups.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
              <Boxes className="w-12 h-12 mb-4 text-zinc-300" />
              <p className="text-lg font-medium">Aucun groupe</p>
              <p className="text-sm">Créez votre premier groupe pour commencer</p>
            </div>
          ) : (
          <DataTable data={groups} columns={groupColumns} searchColumn="name" searchPlaceholder="Rechercher un groupe..." />
          )}
        </div>
      </div>

      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={confirmDelete}
        title="Supprimer le groupe"
        description="Êtes-vous sûr de vouloir supprimer ce groupe ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="destructive"
      />

      <NotificationDialog
        isOpen={showNotification}
        onClose={() => setShowNotification(false)}
        title={notificationData.title}
        description={notificationData.description}
        variant={notificationData.variant}
      />
    </div>
  );
}
