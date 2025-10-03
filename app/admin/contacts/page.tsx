"use client";
import {
  Contact,
  Search,
  Filter,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  Eye,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect } from "react";

interface ContactData {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  address?: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  groups: {
    id: string;
    name: string;
  }[];
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<ContactData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchContacts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/admin/contacts');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des contacts');
        }
        const data = await response.json();
        setContacts(data);
      } catch (error) {
        console.error('Erreur lors du chargement des contacts:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Erreur lors du chargement des contacts",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, [toast]);

  const filteredContacts = contacts.filter(contact =>
    contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm)
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const columns: ColumnDef<ContactData>[] = [
    {
      accessorKey: "name",
      header: "Nom",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              {row.original.firstName.charAt(0)}
            </span>
          </div>
          <div>
            <div className="font-medium">
              {row.original.firstName} {row.original.lastName}
            </div>
            <div className="text-sm text-gray-500">
              Créé par {row.original.user.name}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        const email = row.getValue("email") as string | undefined;
        return email ? (
          <div className="flex items-center gap-1">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="text-sm">{email}</span>
          </div>
        ) : (
          <span className="text-gray-400 text-sm">Non renseigné</span>
        );
      },
    },
    {
      accessorKey: "phone",
      header: "Téléphone",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Phone className="w-4 h-4 text-gray-400" />
          <span className="text-sm">{row.getValue("phone")}</span>
        </div>
      ),
    },
    {
      accessorKey: "address",
      header: "Adresse",
      cell: ({ row }) => {
        const address = row.getValue("address") as string | undefined;
        return address ? (
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-sm max-w-xs truncate" title={address}>
              {address}
            </span>
          </div>
        ) : (
          <span className="text-gray-400 text-sm">Non renseignée</span>
        );
      },
    },
    {
      accessorKey: "groups",
      header: "Groupes",
      cell: ({ row }) => {
        const groups = row.getValue("groups") as ContactData["groups"];
        if (groups.length === 0) {
          return <span className="text-gray-400 text-sm">Aucun groupe</span>;
        }
        return (
          <div className="flex flex-wrap gap-1">
            {groups.map((group) => (
              <span
                key={group.id}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {group.name}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Créé le",
      cell: ({ row }) => (
        <div className="flex items-center gap-1 text-sm">
          <Calendar className="w-4 h-4 text-gray-400" />
          {formatDate(row.getValue("createdAt"))}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Contact color="#000000" />
            <h1 className="text-2xl font-bold">Gestion des Contacts</h1>
          </div>
          <p className="text-gray-500">
            Consultez tous les contacts créés par les utilisateurs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-[#FB953C] hover:bg-[#FB953C]/80 text-white">
            <User className="w-4 h-4 mr-2" />
            Exporter les contacts
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contacts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avec email</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {contacts.filter(c => c.email).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avec adresse</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {contacts.filter(c => c.address).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Dans des groupes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {contacts.filter(c => c.groups.length > 0).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des contacts */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des contacts</CardTitle>
          <CardDescription>
            Tous les contacts créés par les utilisateurs de la plateforme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher par nom, email ou téléphone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
              <div className="h-32 bg-gray-200 rounded animate-pulse" />
            </div>
          ) : (
            <DataTable
              data={filteredContacts}
              columns={columns}
              searchColumn="firstName"
              searchPlaceholder="Rechercher un contact..."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
