'use client';
import React, { useState, useEffect } from 'react'
import {  Plus, ArrowLeft, MessageSquare, Smartphone } from 'lucide-react';

import {
    Dialog,
    DialogDescription,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
   
  } from '@/components/motion-primitives/dialog';
  import { Variants, Transition } from 'motion/react';
import { TransitionPanel } from './motion-primitives/transition-panel';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface ButFormCampProps {
   name: string;
}

interface Project {
  project_id: string;
  sender_name: string;
  sms_credit: number;
  created_at: string;
}

interface Group {
  group_id: string;
  name: string;
  description?: string;
  created_at: string;
}

export default function ButFormCamp({ name}: ButFormCampProps) {
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
        type: 'spring',
        bounce: 0,
        duration: 0.25,
      };

      const [activeIndex, setActiveIndex] = useState(0);
      const [selectedChannel, setSelectedChannel] = useState<'SMS' | 'WhatsApp' | null>(null);
      const [campaignName, setCampaignName] = useState('');
      const [selectedProject, setSelectedProject] = useState('');
      const [message, setMessage] = useState('');
      const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
      const [projects, setProjects] = useState<Project[]>([]);
      const [groups, setGroups] = useState<Group[]>([]);
      const [isLoading, setIsLoading] = useState(false);

      // Charger les projets et groupes au montage du composant
      useEffect(() => {
        const fetchData = async () => {
          try {
            const [projectsRes, groupsRes] = await Promise.all([
              fetch('/api/projects'),
              fetch('/api/groups')
            ]);
            
            if (projectsRes.ok) {
              const projectsData = await projectsRes.json();
              setProjects(projectsData);
            }
            
            if (groupsRes.ok) {
              const groupsData = await groupsRes.json();
              setGroups(groupsData);
            }
          } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
          }
        };

        fetchData();
      }, []);

      const handleChannelSelect = (channel: 'SMS' | 'WhatsApp') => {
        if (channel === 'SMS') {
          setSelectedChannel(channel);
          setActiveIndex(1); // Aller au formulaire de création
        }
      };

      const handleBackToChannel = () => {
        setActiveIndex(0);
        setSelectedChannel(null);
        setCampaignName('');
        setSelectedProject('');
      };

      const handleBackToForm = () => {
        setActiveIndex(1);
        setMessage('');
        setSelectedGroups([]);
      };

      const handleCreateCampaign = async () => {
        if (!campaignName || !selectedProject) {
          alert('Veuillez remplir tous les champs obligatoires');
          return;
        }
        setActiveIndex(2); // Aller au formulaire de message
      };

      const handleGroupToggle = (groupId: string) => {
        setSelectedGroups(prev => 
          prev.includes(groupId) 
            ? prev.filter(id => id !== groupId)
            : [...prev, groupId]
        );
      };

      const handleCreateMessage = async () => {
        if (!message || selectedGroups.length === 0) {
          alert('Veuillez remplir tous les champs obligatoires');
          return;
        }

        setIsLoading(true);
        try {
          const response = await fetch('/api/campaigns', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: campaignName,
              project_id: selectedProject,
              group_ids: selectedGroups,
              message: message,
              channel: selectedChannel
            }),
          });

          if (response.ok) {
            const result = await response.json();
            alert(result.message || 'Campagne(s) créée(s) avec succès!');
            // Fermer le dialog et réinitialiser
            setActiveIndex(0);
            setSelectedChannel(null);
            setCampaignName('');
            setSelectedProject('');
            setMessage('');
            setSelectedGroups([]);
            // Recharger la page pour afficher la nouvelle campagne
            window.location.reload();
          } else {
            const error = await response.json();
            alert(error.error || 'Erreur lors de la création de la campagne');
          }
        } catch (error) {
          console.error('Erreur:', error);
          alert('Erreur lors de la création de la campagne');
        } finally {
          setIsLoading(false);
        }
      };
    
  return (
    <Dialog variants={customVariants} transition={customTransition}>
            <DialogTrigger className="bg-[#FB953C] px-4 py-2 text-sm text-white hover:bg-[#FB953C]/80 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100">
              <Plus color="#ffffff" />
              {name}
            </DialogTrigger>
      <DialogContent className="w-full max-w-lg bg-white p-6 dark:bg-zinc-900">
              <DialogHeader>
                <DialogTitle className="text-zinc-900 dark:text-white">
            {activeIndex === 0 ? 'Choisir le canal' : 
             activeIndex === 1 ? 'Créer une campagne' : 
             'Créer le message'}
                </DialogTitle>
                <DialogDescription className="text-zinc-600 dark:text-zinc-400">
            {activeIndex === 0 ? 'Sélectionnez le canal de communication pour votre campagne' :
             activeIndex === 1 ? 'Configurez les paramètres de base de votre campagne' :
             'Rédigez le message de votre campagne'}
                </DialogDescription>
              </DialogHeader>
        
        <div className="overflow-hidden">
                  <TransitionPanel
                    activeIndex={activeIndex}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    variants={{
                      enter: { opacity: 0, y: -50, filter: "blur(4px)" },
                      center: { opacity: 1, y: 0, filter: "blur(0px)" },
                      exit: { opacity: 0, y: 50, filter: "blur(4px)" },
                    }}
                  >
            {/* Panel 0: Sélection du canal */}
            <div className="mt-6 flex flex-col space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => handleChannelSelect('SMS')}
                  className="flex flex-col items-center p-6 h-24 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700"
                >
                  <Smartphone className="w-6 h-6 mb-2" />
                  <span className="font-medium">SMS</span>
                </Button>
                <Button
                  disabled
                  className="flex flex-col items-center p-6 h-24 bg-gray-50 border border-gray-200 text-gray-400 cursor-not-allowed"
                >
                  <MessageSquare className="w-6 h-6 mb-2" />
                  <span className="font-medium">WhatsApp</span>
                  <span className="text-xs">Bientôt disponible</span>
                </Button>
              </div>
            </div>

            {/* Panel 1: Formulaire de création de campagne */}
                    <div className="mt-6 flex flex-col space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToChannel}
                  className="p-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-zinc-600">Retour</span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="campaignName">Nom de la campagne</Label>
                  <Input
                    id="campaignName"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    placeholder="Entrez le nom de votre campagne"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="project">Projet</Label>
                  <select
                    id="project"
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FB953C] focus:border-transparent"
                  >
                    <option value="">Sélectionnez un projet</option>
                    {projects.map((project) => (
                      <option key={project.project_id} value={project.project_id}>
                        {project.sender_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <Button
                onClick={handleCreateCampaign}
                className="w-full bg-[#FB953C] hover:bg-[#FB953C]/80"
                disabled={!campaignName || !selectedProject}
              >
                Créer campagne
              </Button>
            </div>

            {/* Panel 2: Formulaire de message */}
                    <div className="mt-6 flex flex-col space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToForm}
                  className="p-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-zinc-600">Retour</span>
                    </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="message">Message</Label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Rédigez votre message..."
                    rows={4}
                    className="mt-1 w-full px-3 py-2 border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FB953C] focus:border-transparent resize-none"
                  />
                    </div>
                
                <div>
                  <Label>Groupes</Label>
                  <div className="mt-2 max-h-40 overflow-y-auto border border-zinc-200 rounded-md p-2">
                    {groups.length === 0 ? (
                      <div className="text-sm text-zinc-500 text-center py-4">
                        Aucun groupe disponible
                      </div>
                    ) : (
                      groups.map((group) => (
                        <label
                          key={group.group_id}
                          className="flex items-center space-x-2 p-2 hover:bg-zinc-50 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedGroups.includes(group.group_id)}
                            onChange={() => handleGroupToggle(group.group_id)}
                            className="w-4 h-4 text-[#FB953C] border-zinc-300 rounded focus:ring-[#FB953C] focus:ring-2"
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-zinc-900">
                              {group.name}
                            </div>
                            {group.description && (
                              <div className="text-xs text-zinc-500">
                                {group.description}
                              </div>
                            )}
                          </div>
                        </label>
                      ))
                    )}
                  </div>
                  {selectedGroups.length > 0 && (
                    <div className="mt-2 text-sm text-zinc-600">
                      {selectedGroups.length} groupe(s) sélectionné(s)
                    </div>
                  )}
                </div>
                    </div>
              
              <Button
                onClick={handleCreateMessage}
                className="w-full bg-[#FB953C] hover:bg-[#FB953C]/80"
                disabled={!message || selectedGroups.length === 0 || isLoading}
              >
                {isLoading ? 'Création...' : 'Créer campagne'}
              </Button>
                    </div>
                  </TransitionPanel>
                </div>
            </DialogContent>
          </Dialog>
  )
}
