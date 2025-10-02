"use client";
import {
  Users,
  FolderOpen,
  MessageSquare,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { DashboardCardSkeleton, DashboardTableSkeleton } from "@/components/ui/table-skeleton";

interface AdminStats {
  users: {
    total: number;
    active: number;
    newThisMonth: number;
  };
  projects: {
    total: number;
    active: number;
  };
  campaigns: {
    total: number;
    active: number;
    completed: number;
  };
  messages: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
    successful: number;
    failed: number;
    pending: number;
    successRate: number;
  };
  contacts: {
    total: number;
    newThisWeek: number;
  };
  groups: {
    total: number;
    active: number;
  };
}

interface RecentActivity {
  id: string;
  type: "user_registration" | "campaign_created" | "message_sent" | "project_created";
  description: string;
  timestamp: string;
  user: string;
}

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  useEffect(() => {
    const fetchAdminData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/admin/dashboard');
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }
        
        const data = await response.json();
        setStats(data.stats);
        setRecentActivity(data.recentActivity);
      } catch (error) {
        console.error('Erreur lors du chargement des données admin:', error);
        // En cas d'erreur, afficher des données par défaut
        setStats({
          users: { total: 0, active: 0, newThisMonth: 0 },
          projects: { total: 0, active: 0 },
          campaigns: { total: 0, active: 0, completed: 0 },
          messages: { total: 0, today: 0, thisWeek: 0, thisMonth: 0, successful: 0, failed: 0, pending: 0, successRate: 0 },
          contacts: { total: 0, newThisWeek: 0 },
          groups: { total: 0, active: 0 },
        });
        setRecentActivity([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registration':
        return <Users className="w-4 h-4 text-green-500" />;
      case 'campaign_created':
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'message_sent':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'project_created':
        return <FolderOpen className="w-4 h-4 text-purple-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Administrateur</h1>
            <p className="text-gray-500">Vue d'ensemble de la plateforme ReachDem</p>
          </div>
        </div>
        <DashboardCardSkeleton />
        <DashboardTableSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Administrateur</h1>
          <p className="text-gray-500">Vue d'ensemble de la plateforme ReachDem</p>
        </div>
        <Button className="bg-[#FB953C] hover:bg-[#FB953C]/80 text-white">
          <BarChart3 className="w-4 h-4 mr-2" />
          Exporter les données
        </Button>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.users.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{stats?.users.newThisMonth}</span> ce mois
            </p>
            <div className="mt-2">
              <div className="text-sm text-gray-600">
                Actifs: <span className="font-medium">{stats?.users.active.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.messages.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{stats?.messages.today.toLocaleString()}</span> aujourd'hui
            </p>
            <div className="mt-2">
              <div className="text-sm text-gray-600">
                Taux de réussite: <span className="font-medium text-green-600">{stats?.messages.successRate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campagnes</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.campaigns.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600">{stats?.campaigns.active.toLocaleString()}</span> actives
            </p>
            <div className="mt-2">
              <div className="text-sm text-gray-600">
                Terminées: <span className="font-medium">{stats?.campaigns.completed.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projets</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.projects.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-purple-600">{stats?.projects.active.toLocaleString()}</span> actifs
            </p>
            <div className="mt-2">
              <div className="text-sm text-gray-600">
                Total: <span className="font-medium">{stats?.projects.total.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistiques détaillées */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages par période */}
        <Card>
          <CardHeader>
            <CardTitle>Messages par période</CardTitle>
            <CardDescription>Répartition des messages envoyés</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="text-sm">Aujourd'hui</span>
              </div>
              <span className="font-medium">{stats?.messages.today.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm">Cette semaine</span>
              </div>
              <span className="font-medium">{stats?.messages.thisWeek.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-500" />
                <span className="text-sm">Ce mois</span>
              </div>
              <span className="font-medium">{stats?.messages.thisMonth.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Statuts des messages */}
        <Card>
          <CardHeader>
            <CardTitle>Statuts des messages</CardTitle>
            <CardDescription>Répartition par statut</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">Livrés</span>
              </div>
              <span className="font-medium text-green-600">{stats?.messages.successful.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-500" />
                <span className="text-sm">Échoués</span>
              </div>
              <span className="font-medium text-red-600">{stats?.messages.failed.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-500" />
                <span className="text-sm">En attente</span>
              </div>
              <span className="font-medium text-yellow-600">{stats?.messages.pending.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activité récente */}
      <Card>
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
          <CardDescription>Dernières actions sur la plateforme</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 p-3 border rounded-lg">
                {getActivityIcon(activity.type)}
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.description}</p>
                  <p className="text-xs text-gray-500">par {activity.user}</p>
                </div>
                <div className="text-xs text-gray-400">
                  {formatTimestamp(activity.timestamp)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}