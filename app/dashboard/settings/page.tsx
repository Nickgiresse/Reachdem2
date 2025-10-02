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
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect } from "react";

interface UserProfile {
  id: string;
  userId: string;
  account_type: "INDIVIDUAL" | "BUSINESS" | "ENTERPRISE";
  is_admin: boolean;
  is_ban: boolean;
  first_name: string;
  last_name: string;
  phone?: string;
  city?: string;
  country?: string;
  locale: "FR" | "EN" | "ES" | "DE" | "IT";
  slug?: string;
  last_connection?: string;
  created_at: string;
  updated_at: string;
}

interface UserData {
  id: string;
  name?: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  createdAt: string;
  updatedAt: string;
  UserProfile?: UserProfile;
}

export default function SettingsPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  
  const { toast } = useToast();

  // États pour les formulaires
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    city: "",
    country: "",
    locale: "FR" as "FR" | "EN" | "ES" | "DE" | "IT",
  });

  const [accountForm, setAccountForm] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notificationForm, setNotificationForm] = useState({
    emailNotifications: true,
    smsNotifications: false,
    campaignUpdates: true,
    systemAlerts: true,
  });

  // Charger les données utilisateur
  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        
        // Pré-remplir les formulaires
        if (data.UserProfile) {
          setProfileForm({
            firstName: data.UserProfile.first_name || "",
            lastName: data.UserProfile.last_name || "",
            phone: data.UserProfile.phone || "",
            city: data.UserProfile.city || "",
            country: data.UserProfile.country || "",
            locale: data.UserProfile.locale || "FR",
          });
        }
        
        setAccountForm({
          name: data.name || "",
          email: data.email || "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        console.error('Erreur lors du chargement des données utilisateur');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données utilisateur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Sauvegarder le profil
  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileForm),
      });

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Profil mis à jour avec succès",
        });
        fetchUserData(); // Recharger les données
      } else {
        const error = await response.json();
        toast({
          variant: "destructive",
          title: "Erreur",
          description: error.error || "Erreur lors de la mise à jour du profil",
        });
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du profil:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors de la sauvegarde du profil",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Sauvegarder les paramètres de compte
  const handleSaveAccount = async () => {
    if (accountForm.newPassword && accountForm.newPassword !== accountForm.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
      });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/user/account', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(accountForm),
      });

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Paramètres de compte mis à jour avec succès",
        });
        // Réinitialiser les champs de mot de passe
        setAccountForm(prev => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      } else {
        const error = await response.json();
        toast({
          variant: "destructive",
          title: "Erreur",
          description: error.error || "Erreur lors de la mise à jour du compte",
        });
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du compte:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors de la sauvegarde du compte",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Sauvegarder les paramètres de notification
  const handleSaveNotifications = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/user/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationForm),
      });

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Paramètres de notification mis à jour avec succès",
        });
      } else {
        const error = await response.json();
        toast({
          variant: "destructive",
          title: "Erreur",
          description: error.error || "Erreur lors de la mise à jour des notifications",
        });
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des notifications:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors de la sauvegarde des notifications",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 0, title: "Profil", icon: User },
    { id: 1, title: "Compte", icon: Shield },
    { id: 2, title: "Notifications", icon: Bell },
    { id: 3, title: "Préférences", icon: Globe },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FB953C]"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row items-center justify-between m-auto w-[90%]">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Settings color="#000000" />
            <h1 className="text-2xl font-bold">Paramètres</h1>
          </div>
          <p className="text-gray-500">
            Gérez vos paramètres de compte et préférences
          </p>
        </div>
      </div>

      <div className="w-[90%] m-auto mt-6">
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
                  Informations du profil
                </CardTitle>
                <CardDescription>
                  Gérez vos informations personnelles et de contact
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Votre nom"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={profileForm.phone}
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
                      value={profileForm.city}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="Votre ville"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Pays</Label>
                    <Input
                      id="country"
                      value={profileForm.country}
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

          {/* Onglet Compte */}
          {activeTab === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Paramètres de compte
                </CardTitle>
                <CardDescription>
                  Gérez vos informations de connexion et sécurité
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom d'affichage</Label>
                  <Input
                    id="name"
                    value={accountForm.name}
                    onChange={(e) => setAccountForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Votre nom d'affichage"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={accountForm.email}
                    onChange={(e) => setAccountForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="votre@email.com"
                  />
                  {userData?.emailVerified && (
                    <div className="flex items-center gap-1 mt-1 text-green-600 text-sm">
                      <UserCheck className="w-4 h-4" />
                      Email vérifié
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Changer le mot de passe</h3>
                  
                  <div>
                    <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPassword ? "text" : "password"}
                        value={accountForm.currentPassword}
                        onChange={(e) => setAccountForm(prev => ({ ...prev, currentPassword: e.target.value }))}
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
                      value={accountForm.newPassword}
                      onChange={(e) => setAccountForm(prev => ({ ...prev, newPassword: e.target.value }))}
                      placeholder="Nouveau mot de passe"
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={accountForm.confirmPassword}
                      onChange={(e) => setAccountForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Confirmer le nouveau mot de passe"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    onClick={handleSaveAccount}
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
                  Paramètres de notification
                </CardTitle>
                <CardDescription>
                  Configurez comment vous souhaitez recevoir les notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailNotifications">Notifications par email</Label>
                      <p className="text-sm text-zinc-600">Recevoir des notifications par email</p>
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
                      <p className="text-sm text-zinc-600">Recevoir des notifications par SMS</p>
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
                      <Label htmlFor="campaignUpdates">Mises à jour de campagne</Label>
                      <p className="text-sm text-zinc-600">Notifications sur l'état de vos campagnes</p>
                    </div>
                    <input
                      type="checkbox"
                      id="campaignUpdates"
                      checked={notificationForm.campaignUpdates}
                      onChange={(e) => setNotificationForm(prev => ({ ...prev, campaignUpdates: e.target.checked }))}
                      className="w-4 h-4 text-[#FB953C] border-zinc-300 rounded focus:ring-[#FB953C]"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="systemAlerts">Alertes système</Label>
                      <p className="text-sm text-zinc-600">Notifications importantes du système</p>
                    </div>
                    <input
                      type="checkbox"
                      id="systemAlerts"
                      checked={notificationForm.systemAlerts}
                      onChange={(e) => setNotificationForm(prev => ({ ...prev, systemAlerts: e.target.checked }))}
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

          {/* Onglet Préférences */}
          {activeTab === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Préférences générales
                </CardTitle>
                <CardDescription>
                  Personnalisez votre expérience utilisateur
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="timezone">Fuseau horaire</Label>
                    <select
                      id="timezone"
                      className="w-full px-3 py-2 border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FB953C]"
                    >
                      <option value="Europe/Paris">Europe/Paris (GMT+1)</option>
                      <option value="Europe/London">Europe/London (GMT+0)</option>
                      <option value="America/New_York">America/New_York (GMT-5)</option>
                      <option value="Africa/Douala">Africa/Douala (GMT+1)</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="dateFormat">Format de date</Label>
                    <select
                      id="dateFormat"
                      className="w-full px-3 py-2 border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FB953C]"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="theme">Thème</Label>
                    <select
                      id="theme"
                      className="w-full px-3 py-2 border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FB953C]"
                    >
                      <option value="light">Clair</option>
                      <option value="dark">Sombre</option>
                      <option value="system">Système</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
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
        </div>
      </div>
    </div>
  );
}
