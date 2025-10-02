"use client";
import {
  Settings,
  User,
  Shield,
  Bell,
  Globe,
  Save,
  Eye,
  EyeOff,
  Mail,
  Phone,
  MapPin,
  Calendar,
  UserCheck,
  Database,
  Server,
  Key,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect } from "react";

interface AdminProfile {
  name: string;
  email: string;
  phone?: string;
  city?: string;
  country?: string;
  locale: "FR" | "EN" | "ES" | "DE" | "IT";
}

interface AdminSettings {
  systemName: string;
  systemEmail: string;
  supportEmail: string;
  maxUsers: number;
  maxProjectsPerUser: number;
  maxContactsPerUser: number;
  maxCampaignsPerUser: number;
  messageRateLimit: number;
  maintenanceMode: boolean;
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  systemAlerts: boolean;
  userRegistrationAlerts: boolean;
  campaignAlerts: boolean;
  errorAlerts: boolean;
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  // États pour les formulaires
  const [profileForm, setProfileForm] = useState<AdminProfile>({
    name: "Administrateur",
    email: "admin@reachdem.co",
    phone: "+33 1 23 45 67 89",
    city: "Paris",
    country: "France",
    locale: "FR",
  });

  const [settingsForm, setSettingsForm] = useState<AdminSettings>({
    systemName: "ReachDem",
    systemEmail: "noreply@reachdem.co",
    supportEmail: "support@reachdem.co",
    maxUsers: 10000,
    maxProjectsPerUser: 50,
    maxContactsPerUser: 10000,
    maxCampaignsPerUser: 100,
    messageRateLimit: 1000,
    maintenanceMode: false,
  });

  const [notificationForm, setNotificationForm] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: true,
    systemAlerts: true,
    userRegistrationAlerts: true,
    campaignAlerts: true,
    errorAlerts: true,
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Sauvegarder le profil
  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // Simuler la sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Succès",
        description: "Profil administrateur mis à jour avec succès",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors de la mise à jour du profil",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Sauvegarder les paramètres système
  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Simuler la sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Succès",
        description: "Paramètres système mis à jour avec succès",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors de la mise à jour des paramètres",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Sauvegarder les notifications
  const handleSaveNotifications = async () => {
    setIsSaving(true);
    try {
      // Simuler la sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Succès",
        description: "Paramètres de notification mis à jour avec succès",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors de la mise à jour des notifications",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Changer le mot de passe
  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
      });
      return;
    }

    setIsSaving(true);
    try {
      // Simuler le changement de mot de passe
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      
      toast({
        title: "Succès",
        description: "Mot de passe changé avec succès",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors du changement de mot de passe",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 0, title: "Profil", icon: User },
    { id: 1, title: "Système", icon: Server },
    { id: 2, title: "Notifications", icon: Bell },
    { id: 3, title: "Sécurité", icon: Shield },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Settings color="#000000" />
            <h1 className="text-2xl font-bold">Paramètres Administrateur</h1>
          </div>
          <p className="text-gray-500">
            Gérez les paramètres de la plateforme et votre compte administrateur
          </p>
        </div>
      </div>

      {/* Onglets */}
      <div className="flex space-x-2 mb-6 bg-zinc-100 rounded-md p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.title}
            </button>
          );
        })}
      </div>

      {/* Contenu des onglets */}
      <div className="space-y-6">
        {/* Onglet Profil */}
        {activeTab === 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profil Administrateur
              </CardTitle>
              <CardDescription>
                Gérez vos informations personnelles d'administrateur
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nom complet</Label>
                  <Input
                    id="name"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Votre nom complet"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="admin@reachdem.co"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={profileForm.phone || ""}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+33 1 23 45 67 89"
                  />
                </div>
                <div>
                  <Label htmlFor="locale">Langue</Label>
                  <select
                    id="locale"
                    value={profileForm.locale}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, locale: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FB953C]"
                  >
                    <option value="FR">Français</option>
                    <option value="EN">English</option>
                    <option value="ES">Español</option>
                    <option value="DE">Deutsch</option>
                    <option value="IT">Italiano</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">Ville</Label>
                  <Input
                    id="city"
                    value={profileForm.city || ""}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="Votre ville"
                  />
                </div>
                <div>
                  <Label htmlFor="country">Pays</Label>
                  <Input
                    id="country"
                    value={profileForm.country || ""}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, country: e.target.value }))}
                    placeholder="Votre pays"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="bg-[#FB953C] hover:bg-[#FB953C]/80 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? "Sauvegarde..." : "Sauvegarder"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Onglet Système */}
        {activeTab === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5" />
                Paramètres Système
              </CardTitle>
              <CardDescription>
                Configurez les paramètres globaux de la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="systemName">Nom du système</Label>
                  <Input
                    id="systemName"
                    value={settingsForm.systemName}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, systemName: e.target.value }))}
                    placeholder="ReachDem"
                  />
                </div>
                <div>
                  <Label htmlFor="systemEmail">Email système</Label>
                  <Input
                    id="systemEmail"
                    type="email"
                    value={settingsForm.systemEmail}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, systemEmail: e.target.value }))}
                    placeholder="noreply@reachdem.co"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="supportEmail">Email de support</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={settingsForm.supportEmail}
                  onChange={(e) => setSettingsForm(prev => ({ ...prev, supportEmail: e.target.value }))}
                  placeholder="support@reachdem.co"
                />
              </div>

              <Separator />

              <h3 className="text-lg font-medium">Limites du système</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxUsers">Nombre max d'utilisateurs</Label>
                  <Input
                    id="maxUsers"
                    type="number"
                    value={settingsForm.maxUsers}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, maxUsers: parseInt(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="maxProjectsPerUser">Projets max par utilisateur</Label>
                  <Input
                    id="maxProjectsPerUser"
                    type="number"
                    value={settingsForm.maxProjectsPerUser}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, maxProjectsPerUser: parseInt(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxContactsPerUser">Contacts max par utilisateur</Label>
                  <Input
                    id="maxContactsPerUser"
                    type="number"
                    value={settingsForm.maxContactsPerUser}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, maxContactsPerUser: parseInt(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="maxCampaignsPerUser">Campagnes max par utilisateur</Label>
                  <Input
                    id="maxCampaignsPerUser"
                    type="number"
                    value={settingsForm.maxCampaignsPerUser}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, maxCampaignsPerUser: parseInt(e.target.value) }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="messageRateLimit">Limite de messages par heure</Label>
                <Input
                  id="messageRateLimit"
                  type="number"
                  value={settingsForm.messageRateLimit}
                  onChange={(e) => setSettingsForm(prev => ({ ...prev, messageRateLimit: parseInt(e.target.value) }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenanceMode">Mode maintenance</Label>
                  <p className="text-sm text-gray-500">Activer le mode maintenance pour tous les utilisateurs</p>
                </div>
                <input
                  type="checkbox"
                  id="maintenanceMode"
                  checked={settingsForm.maintenanceMode}
                  onChange={(e) => setSettingsForm(prev => ({ ...prev, maintenanceMode: e.target.checked }))}
                  className="w-4 h-4 text-[#FB953C] border-zinc-300 rounded focus:ring-[#FB953C]"
                />
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className="bg-[#FB953C] hover:bg-[#FB953C]/80 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? "Sauvegarde..." : "Sauvegarder"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Onglet Notifications */}
        {activeTab === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Paramètres de Notification
              </CardTitle>
              <CardDescription>
                Configurez les notifications administrateur
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications">Notifications par email</Label>
                    <p className="text-sm text-gray-500">Recevoir des notifications par email</p>
                  </div>
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    checked={notificationForm.emailNotifications}
                    onChange={(e) => setNotificationForm(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                    className="w-4 h-4 text-[#FB953C] border-zinc-300 rounded focus:ring-[#FB953C]"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smsNotifications">Notifications SMS</Label>
                    <p className="text-sm text-gray-500">Recevoir des notifications par SMS</p>
                  </div>
                  <input
                    type="checkbox"
                    id="smsNotifications"
                    checked={notificationForm.smsNotifications}
                    onChange={(e) => setNotificationForm(prev => ({ ...prev, smsNotifications: e.target.checked }))}
                    className="w-4 h-4 text-[#FB953C] border-zinc-300 rounded focus:ring-[#FB953C]"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="systemAlerts">Alertes système</Label>
                    <p className="text-sm text-gray-500">Notifications importantes du système</p>
                  </div>
                  <input
                    type="checkbox"
                    id="systemAlerts"
                    checked={notificationForm.systemAlerts}
                    onChange={(e) => setNotificationForm(prev => ({ ...prev, systemAlerts: e.target.checked }))}
                    className="w-4 h-4 text-[#FB953C] border-zinc-300 rounded focus:ring-[#FB953C]"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="userRegistrationAlerts">Alertes d'inscription</Label>
                    <p className="text-sm text-gray-500">Notifications lors de nouvelles inscriptions</p>
                  </div>
                  <input
                    type="checkbox"
                    id="userRegistrationAlerts"
                    checked={notificationForm.userRegistrationAlerts}
                    onChange={(e) => setNotificationForm(prev => ({ ...prev, userRegistrationAlerts: e.target.checked }))}
                    className="w-4 h-4 text-[#FB953C] border-zinc-300 rounded focus:ring-[#FB953C]"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="campaignAlerts">Alertes de campagne</Label>
                    <p className="text-sm text-gray-500">Notifications sur les campagnes importantes</p>
                  </div>
                  <input
                    type="checkbox"
                    id="campaignAlerts"
                    checked={notificationForm.campaignAlerts}
                    onChange={(e) => setNotificationForm(prev => ({ ...prev, campaignAlerts: e.target.checked }))}
                    className="w-4 h-4 text-[#FB953C] border-zinc-300 rounded focus:ring-[#FB953C]"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="errorAlerts">Alertes d'erreur</Label>
                    <p className="text-sm text-gray-500">Notifications en cas d'erreurs système</p>
                  </div>
                  <input
                    type="checkbox"
                    id="errorAlerts"
                    checked={notificationForm.errorAlerts}
                    onChange={(e) => setNotificationForm(prev => ({ ...prev, errorAlerts: e.target.checked }))}
                    className="w-4 h-4 text-[#FB953C] border-zinc-300 rounded focus:ring-[#FB953C]"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={handleSaveNotifications}
                  disabled={isSaving}
                  className="bg-[#FB953C] hover:bg-[#FB953C]/80 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? "Sauvegarde..." : "Sauvegarder"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Onglet Sécurité */}
        {activeTab === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Sécurité
              </CardTitle>
              <CardDescription>
                Gérez la sécurité de votre compte administrateur
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Changer le mot de passe</h3>
                
                <div>
                  <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPassword ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                      placeholder="Votre mot de passe actuel"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Nouveau mot de passe"
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirmer le nouveau mot de passe"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Informations de sécurité</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 p-3 border rounded-lg">
                    <Database className="w-5 h-5 text-green-500" />
                    <div>
                      <div className="font-medium">Base de données</div>
                      <div className="text-sm text-gray-500">PostgreSQL - Connectée</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 p-3 border rounded-lg">
                    <Key className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className="font-medium">Chiffrement</div>
                      <div className="text-sm text-gray-500">Argon2 - Actif</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={handleChangePassword}
                  disabled={isSaving}
                  className="bg-[#FB953C] hover:bg-[#FB953C]/80 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? "Sauvegarde..." : "Changer le mot de passe"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}