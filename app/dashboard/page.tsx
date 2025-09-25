"use client";
import { CircleCheckBig, CircleDashed, Clock4,TrendingUp,ArrowDown, FileClock,Folder,MessagesSquare,CreditCard, CircleCheckBigIcon  } from "lucide-react"

import { DashboardCardSkeleton, DashboardTableSkeleton, DashboardStatsSkeleton } from "@/components/ui/table-skeleton"
import React, { useState, useEffect } from "react"

interface DashboardStats {
  projects: {
    total: number;
    active: number;
  };
  messages: {
    monthly: number;
    today: number;
    week: number;
    averagePerDay: number;
    successful: number;
    pending: number;
    failed: number;
    successRate: number;
  };
  credits: {
    remaining: number;
  };
  financial: {
    monthlyExpenses: number;
    yearlyExpenses: number;
    totalExpenses: number;
    successfulTransactions: number;
    pendingTransactions: number;
  };
}

interface MessageHistory {
  id: number;
  messageId: string;
  content: string;
  recipient: string;
  status: string;
  date: string;
  project: string;
}

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [messageHistory, setMessageHistory] = useState<MessageHistory[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Récupérer les statistiques
        const statsResponse = await fetch('/api/dashboard/stats');
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }

        // Récupérer l'historique des messages
        const messagesResponse = await fetch('/api/dashboard/messages');
        if (messagesResponse.ok) {
          const messagesData = await messagesResponse.json();
          setMessageHistory(messagesData);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div>
      
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <h1 className="text-3xl  font-bold  ">Tableau de bord </h1>
          <p className="text-gray-400 pl-2 ">Aperçu de votre activité et de vos projets SMS</p>
          
          {isLoading ? (
            <div className="grid auto-rows-min gap-4 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <DashboardCardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <>
            <div className="grid auto-rows-min gap-4 md:grid-cols-4">
            <div className="p-6 border border-gray-200 rounded-xl flex flex-col justify-center gap-6 hover:shadow-md" >
              <p className=" font-bold text-xl flex flex-row justify-between items-center"><span> Projets Active </span><Folder color="#fd2121" className="bg-red-100 rounded-[100%] px-2 py-1" size={35} /></p>
              <div className="flex flex-col gap-3">
                <p className="text-3xl font-bold">{stats?.projects?.active || 0}</p>
                <p className="text-gray-400 text-[15px] ">Sur {stats?.projects?.total || 0} projets total</p>
              </div>
            </div>
            <div className="p-6 border border-gray-200 rounded-xl flex flex-col justify-center gap-6 hover:shadow-md" >
              <p className=" font-bold text-xl flex flex-row justify-between items-center"><span>Messages mensuels</span><MessagesSquare color="#25D366" className="bg-green-100 rounded-[100%] px-2 py-1" size={35} /></p>
              <div className="flex flex-col gap-3">
                <p className="text-3xl font-bold">{stats?.messages?.monthly || 0}</p>
                <p className=" text-[15px] text-gray-400">ce mois-ci</p>
              </div>

            </div>
            <div className="p-6 border border-gray-200 rounded-xl flex flex-col justify-center gap-6 hover:shadow-md"  >
              <p className=" font-bold text-xl flex flex-row justify-between items-center"><span>Crédit SMS:</span><CreditCard color="#D4AF37" className="bg-yellow-100 rounded-[100%] px-2 py-1" size={35} /></p>
              <div className="flex flex-col gap-3">
                <p className="text-2xl md:text-3xl font-bold">{stats?.credits?.remaining || 0} </p>
                <p className="text-[15px] text-gray-400">crédits restant</p>
              </div>


            </div>
            
             <div className="p-6 border border-gray-200 rounded-xl flex flex-col justify-center gap-6 hover:shadow-md" >
              <p className=" font-bold text-xl flex flex-row justify-between items-center"><span>Taux de réussite</span><TrendingUp color="#1ABC9C" className="bg-green-100 rounded-[100%] px-2 py-1" size={35} /></p>
              <div className="flex flex-col gap-3">
                <p className="text-3xl font-bold">{stats?.messages?.successRate || 0}%</p>
                <p className="text-[15px] text-gray-400">des messages</p>
              </div>
            </div>
          </div>
          </>
          )}


          <h1 className="text-xl md:text-2xl font-bold p-2 ">Statistiques détaillées</h1>
          
          {isLoading ? (
            <DashboardStatsSkeleton />
          ) : (
            <div className="grid auto-rows-min gap-4 md:grid-cols-2">
            {/* Activité de message */}
            <div className="p-6 border border-gray-200 rounded-xl gap-6 flex flex-col justify-center hover:shadow-md" >
                <p className=" font-bold text-xl flex flex-row justify-between items-center"> <span>Activité de message</span><TrendingUp color="#1ABC9C" className="bg-green-100 rounded-[100%] px-2 py-1" size={35} /></p>
                <p className="text-[15px] text-gray-400">Aperçu de vos envoies récents</p>
                <div className="flex flex-row justify-between items-center ">
                  <p className="text-gray-400">{"Aujourd'hui"}</p>
                  <p className="bg-blue-100 rounded-md px-4">{stats?.messages?.today || 0}</p>
                </div>
                <div className="flex flex-row justify-between items-center">
                  <p className="text-gray-400">Cette semaine</p>
                  <p className="bg-blue-100 rounded-md px-4">{stats?.messages?.week || 0}</p>
                </div>
                <div className="flex flex-row justify-between items-center">
                  <p className="text-gray-400">Moyenne par jour</p>
                  <p className="bg-blue-100 rounded-md px-4">{stats?.messages?.averagePerDay || 0}</p>
                </div>
                <hr />
                <div className="flex flex-col gap-2">
                  <h1 className="font-bold text-xl">Statut</h1>
                  <div className="flex flex-row justify-between items-center">
                    <p className="font-medium flex gap-1"><CircleCheckBigIcon color="#0bf40f" /> <span>Succès</span></p>
                    <p className=" rounded-md px-4 bg-green-100">{stats?.messages?.successful || 0}</p>
                  </div>
                  <div className="flex flex-row justify-between items-center">
                    <p className="font-medium flex gap-1"><CircleDashed color="#f49e0b" /> <span>En attente</span></p>
                    <p className=" rounded-md px-4 bg-orange-100">{stats?.messages?.pending || 0}</p>
                  </div>
                  <div className="flex flex-row justify-between items-center">
                    <p className="font-medium flex gap-1"><Clock4 color="#ff0000" /> <span>Echoué</span></p>
                    <p className=" rounded-md px-4 bg-red-100">{stats?.messages?.failed || 0}</p>
                  </div>

                </div>
            </div>
            {/* statistique financiere */}
            <div className="p-6 border border-gray-200 rounded-xl gap-6 flex flex-col justify-center hover:shadow-md" >
                <p className=" font-bold text-xl flex flex-row justify-between items-center"> <span>Satistiques financières</span><TrendingUp color="#1ABC9C" className="bg-green-100 rounded-[100%] px-2 py-1" size={35} /></p>
                <p className="text-[15px] text-gray-400">Recaputilatif de vos depenses</p>
                <div className="flex flex-row justify-between items-center ">
                  <p className="text-gray-400">Dépenses mensuelles</p>
                  <p className="bg-blue-100 rounded-md px-4">{stats?.financial?.monthlyExpenses || 0} FCFA</p>
                </div>
                <div className="flex flex-row justify-between items-center">
                  <p className="text-gray-400">Dépenses annuelles</p>
                  <p className="bg-blue-100 rounded-md px-4">{stats?.financial?.yearlyExpenses || 0} FCFA</p>
                </div>
                <div className="flex flex-row justify-between items-center">
                  <p className="text-gray-400">Total dépensé</p>
                  <p className="bg-blue-100 rounded-md px-4">{stats?.financial?.totalExpenses || 0} FCFA</p>
                </div>
                <hr />
                <div className="flex flex-col gap-2">
                  <h1 className="font-bold text-xl">Total des transactions</h1>
                  <div className="flex flex-row justify-between items-center">
                    <p className="font-medium flex gap-1"><CircleCheckBigIcon color="#0bf40f" /> <span>Succès</span></p>
                    <p className="rounded-md px-4 bg-green-100">{stats?.financial?.successfulTransactions || 0}</p>
                  </div>
                  <div className="flex flex-row justify-between items-center">
                    <p className="font-medium flex gap-1"><CircleDashed color="#f49e0b" /> <span>En attente</span></p>
                    <p className="rounded-md px-4 bg-orange-100">{stats?.financial?.pendingTransactions || 0}</p>
                  </div>
                  

                </div>
            </div>
          </div>
          )}
         
          {/* historique des messages */}
          {isLoading ? (
            <div className="bg-white border border-zinc-200 rounded-xl shadow-sm p-6 animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="h-6 w-48 bg-zinc-200 rounded" />
                <div className="h-8 w-8 bg-zinc-200 rounded-full" />
              </div>
              <div className="h-4 w-64 bg-zinc-100 rounded mb-6" />
              <DashboardTableSkeleton />
            </div>
          ) : (
            <div className="bg-white border border-zinc-200 rounded-xl shadow-sm transition-shadow duration-200 hover:shadow-md p-6" >
          <p className=" font-bold text-xl flex flex-row justify-between items-center"> <span>Historique des messages</span><FileClock color="#3498DB" className="bg-blue-100  rounded-[100%] px-2 py-1" size={35} /></p>
          <p className="text-[15px] text-gray-400 py-4">{"Consultez l'historique de vos envoie SMS récents"}</p>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-zinc-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-700">#</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-700">Identifiant</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-700">Message</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-700">Destinataire</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-700">Statut</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-700 flex items-center gap-1"><span>Date</span><ArrowDown color="#797c7b" /></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {messageHistory.length > 0 ? (
                    messageHistory.map((message) => (
                      <tr key={message.id} className="hover:bg-zinc-50">
                        <td className="px-4 py-3 text-sm text-zinc-700">{message.id}</td>
                        <td className="px-4 py-3 text-sm text-zinc-700 font-mono">{message.messageId.substring(0, 8)}...</td>
                        <td className="px-4 py-3 text-sm text-zinc-700">{message.content}</td>
                        <td className="px-4 py-3 text-sm text-zinc-700">{message.recipient}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            message.status === 'Livré' ? 'bg-green-100 text-green-800' :
                            message.status === 'Envoyé' ? 'bg-blue-100 text-blue-800' :
                            message.status === 'En attente' ? 'bg-yellow-100 text-yellow-800' :
                            message.status === 'Échec' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {message.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-zinc-700">{message.date}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-4 py-6 text-center" colSpan={6}>
                        <span className="text-gray-400">Aucun message trouvé</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
           
          </div>
          )}
        </div>
    </div>
  )
}
