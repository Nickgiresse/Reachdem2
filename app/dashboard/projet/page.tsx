'use client';
import {
  Plus,
  RefreshCcw,
  FolderOpen,
  Eye,
  Power,
  Copy,
  Download,
  QrCode,
} from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,

} from "@/components/motion-primitives/dialog";

import { useToast } from "@/hooks/use-toast";
import { useNotification } from "@/hooks/use-notification";
import { NotificationDialog } from "@/components/ui/notification-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProjectCardSkeleton } from "@/components/ui/table-skeleton";
import React, { useState, useEffect } from "react";


interface Project {
  project_id: string;
  sender_name: string;
  created_at: string;
  is_active?: boolean;
}

export default function Projet() {


  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isActivationDialogOpen, setIsActivationDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [activationMessage, setActivationMessage] = useState('');
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [detailProject, setDetailProject] = useState<Project | null>(null);

  const { toast } = useToast();
  const notification = useNotification();

  // Charger les projets au montage du composant
  useEffect(() => {
    fetchProjects();
  }, []);

  // Fonction pour charger les projets
  const fetchProjects = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/projects");
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des projets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour créer un projet
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez entrer un nom pour le projet",
      });
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender_name: projectName.trim(),
        }),
      });

      if (response.ok) {
        const newProject = await response.json();
        setProjects(prev => [newProject, ...prev]);
        setProjectName('');
        setIsDialogOpen(false);
        notification.show({
          title: "Succès",
          description: "Projet créé avec succès !",
          variant: "success",
        });
      } else {
        const error = await response.json();
        toast({
          variant: "destructive",
          title: "Erreur",
          description: error.error || "Erreur lors de la création du projet",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la création du projet:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors de la création du projet",
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Fonction pour activer un projet
  const handleActivateProject = (project: Project) => {
    setSelectedProject(project);
    const message = `Bonjour, je souhaite activer mon projet "${project.sender_name}" (ID: ${project.project_id}).`;
    setActivationMessage(message);
    
    // Générer le QR code pour WhatsApp
    const whatsappUrl = `https://wa.me/656966582?text=${encodeURIComponent(message)}`;
    setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(whatsappUrl)}`);
    
    setIsActivationDialogOpen(true);
  };

  // Fonction pour voir les détails d'un projet
  const handleViewDetail = (project: Project) => {
    setDetailProject(project);
    setIsDetailDialogOpen(true);
  };


  // Fonction pour copier le message
  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(activationMessage);
      toast({
        title: "Succès",
        description: "Message copié dans le presse-papiers !",
      });
    } catch (_error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de copier le message",
      });
    }
  };

  // Fonction pour télécharger le QR code
  const handleDownloadQR = async () => {
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qr-code-projet-${selectedProject?.project_id}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Succès",
        description: "QR code téléchargé avec succès !",
      });
    } catch (_error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de télécharger le QR code",
      });
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between m-auto w-[90%]">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <FolderOpen color="#000000" />
            <h1 className="text-2xl font-bold">Projets</h1>
          </div>
          <p className="text-gray-500">
            Gérez vos projets de marketing et campagnes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={fetchProjects}
            className="flex items-center gap-2 bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-900"
          >
            <RefreshCcw color="#000000" />
            Actualiser
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger className="bg-[#FB953C] px-4 py-2 text-sm text-white hover:bg-[#FB953C]/80 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100">
              <Plus color="#ffffff" />
              Créer projet
            </DialogTrigger>
            <DialogContent className="w-full max-w-md bg-white p-6 dark:bg-zinc-900">
              <DialogHeader>
                <DialogTitle className="text-zinc-900 dark:text-white">
                  Créer un nouveau projet
                </DialogTitle>
                <DialogDescription className="text-zinc-600 dark:text-zinc-400">
                  Entrez le nom de votre projet pour commencer
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleCreateProject} className="mt-6 space-y-4">
                <div>
                  <Label htmlFor="projectName">Nom du projet</Label>
                  <Input
                    id="projectName"
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Entrez le nom de votre projet"
                    className="mt-1"
                    required
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setProjectName('');
                    }}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    disabled={isCreating}
                    className="bg-[#FB953C] hover:bg-[#FB953C]/80 text-white"
                  >
                    {isCreating ? 'Création...' : 'Créer projet'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <hr className="w-full m-auto my-4" />

      {/* Grid des projets */}
      <div className="w-[90%] m-auto">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <ProjectCardSkeleton key={index} />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
            <FolderOpen className="w-12 h-12 mb-4 text-zinc-300" />
            <p className="text-lg font-medium">Aucun projet</p>
            <p className="text-sm">Créez votre premier projet pour commencer</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.project_id} className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-zinc-900 truncate">
                    {project.sender_name}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    project.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {project.is_active ? 'Actif' : 'En attente'}
                  </span>
                </div>
                
                <div className="space-y-3 mb-6">
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-zinc-500">ID:</span>
                    <span className="text-sm font-mono text-zinc-700">
                      {project.project_id}
                    </span>
                  </div>
                  
                  <div className="text-sm text-zinc-500">
                    Créé le {new Date(project.created_at).toLocaleDateString('fr-FR')}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="grid grid-cols-1 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleViewDetail(project)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Voir détail
                    </Button>
                    
                    <Button
                      size="sm"
                      className={`w-full ${
                        project.is_active 
                          ? 'bg-green-500 hover:bg-green-600' 
                          : 'bg-[#FB953C] hover:bg-[#FB953C]/80'
                      } text-white`}
                      onClick={() => handleActivateProject(project)}
                    >
                      <Power className="w-4 h-4 mr-2" />
                      {project.is_active ? 'Actif' : 'Activer'}
                    </Button>

                  </div>
                  
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dialog d'activation */}
      <Dialog open={isActivationDialogOpen} onOpenChange={setIsActivationDialogOpen}>
        <DialogContent className="w-full max-w-md bg-white p-6 dark:bg-zinc-900">
          <DialogHeader>
            <DialogTitle className="text-zinc-900 dark:text-white flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              Activation du projet
            </DialogTitle>
            <DialogDescription className="text-zinc-600 dark:text-zinc-400">
              {"Scannez le QR code ou copiez le message pour contacter l'administrateur"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-6 space-y-4">
            {/* QR Code */}
            <div className="flex justify-center">
              <div className="p-4 bg-white border border-zinc-200 rounded-lg">
                <Image 
                  src={qrCodeUrl} 
                  alt="QR Code WhatsApp" 
                  width={192}
                  height={192}
                  className="w-48 h-48"
                />
              </div>
            </div>
            
            {/* Message */}
            <div className="bg-zinc-50 p-4 rounded-lg">
              <p className="text-sm text-zinc-700 mb-2 font-medium">Message à envoyer :</p>
              <p className="text-sm text-zinc-600 break-words">
                {activationMessage}
              </p>
            </div>
            
            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleCopyMessage}
                className="flex-1"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copier
              </Button>
              
              <Button
                onClick={handleDownloadQR}
                className="flex-1 bg-[#FB953C] hover:bg-[#FB953C]/80 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Télécharger
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <NotificationDialog
        isOpen={notification.isOpen}
        onClose={notification.hide}
        title={notification.options.title}
        description={notification.options.description}
        variant={notification.options.variant}
        buttonText={notification.options.buttonText}
      />

      {/* Dialog de détail du projet */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="w-full max-w-2xl bg-white p-6 dark:bg-zinc-900">
          <DialogHeader>
            <DialogTitle className="text-zinc-900 dark:text-white flex items-center gap-2">
              <FolderOpen className="w-5 h-5" />
              Détails du projet
            </DialogTitle>
            <DialogDescription className="text-zinc-600 dark:text-zinc-400">
              Informations complètes sur le projet sélectionné
            </DialogDescription>
          </DialogHeader>
          
          {detailProject && (
            <div className="mt-6 space-y-6">
              {/* Informations principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-zinc-700">Nom du projet</Label>
                    <p className="mt-1 text-lg font-semibold text-zinc-900">{detailProject.sender_name}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-zinc-700">ID du projet</Label>
                    <p className="mt-1 font-mono text-sm text-zinc-600 bg-zinc-50 p-2 rounded border">
                      {detailProject.project_id}
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-zinc-700">Statut</Label>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        detailProject.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {detailProject.is_active ? 'Actif' : 'En attente'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-zinc-700">Date de création</Label>
                    <p className="mt-1 text-zinc-900">
                      {new Date(detailProject.created_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-zinc-700">Heure de création</Label>
                    <p className="mt-1 text-zinc-900">
                      {new Date(detailProject.created_at).toLocaleTimeString('fr-FR')}
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-zinc-700">{"Durée d'existence"}</Label>
                    <p className="mt-1 text-zinc-900">
                      {Math.floor((Date.now() - new Date(detailProject.created_at).getTime()) / (1000 * 60 * 60 * 24))} jours
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Actions rapides */}
              <div className="border-t border-zinc-200 pt-6">
                <Label className="text-sm font-medium text-zinc-700 mb-3 block">Actions rapides</Label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(detailProject.project_id);
                      toast({
                        title: "Copié",
                        description: "ID du projet copié dans le presse-papiers",
                      });
                    }}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    {"Copier l'ID"}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const url = window.location.origin + `/dashboard/projet/${detailProject.project_id}`;
                      navigator.clipboard.writeText(url);
                      toast({
                        title: "Copié",
                        description: "Lien du projet copié dans le presse-papiers",
                      });
                    }}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copier le lien
                  </Button>
                  
                  {!detailProject.is_active && (
                    <Button
                      size="sm"
                      className="bg-[#FB953C] hover:bg-[#FB953C]/80 text-white"
                      onClick={() => {
                        setIsDetailDialogOpen(false);
                        handleActivateProject(detailProject);
                      }}
                    >
                      <Power className="w-4 h-4 mr-2" />
                      Activer le projet
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsDetailDialogOpen(false)}
            >
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
