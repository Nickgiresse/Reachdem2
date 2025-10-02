import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Récupérer les statistiques globales
    const [
      totalUsers,
      totalProjects,
      totalContacts,
      totalCampaigns,
      totalMessages,
      messagesToday,
      messagesThisWeek,
      messagesThisMonth,
      successfulMessages,
      failedMessages
    ] = await Promise.all([
      // Nombre total d'utilisateurs
      prisma.user.count(),
      
      // Nombre total de projets
      prisma.project.count(),
      
      // Nombre total de contacts
      prisma.contact.count(),
      
      // Nombre total de campagnes
      prisma.campaign.count(),
      
      // Nombre total de messages
      prisma.message.count(),
      
      // Messages envoyés aujourd'hui
      prisma.message.count({
        where: {
          sent_at: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      }),
      
      // Messages envoyés cette semaine
      prisma.message.count({
        where: {
          sent_at: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      
      // Messages envoyés ce mois
      prisma.message.count({
        where: {
          sent_at: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      }),
      
      // Messages réussis
      prisma.message.count({
        where: {
          delivered_status: 'DELIVERED'
        }
      }),
      
      // Messages échoués
      prisma.message.count({
        where: {
          delivered_status: 'FAILED'
        }
      })
    ]);

    // Calculer les taux
    const successRate = totalMessages > 0 ? Math.round((successfulMessages / totalMessages) * 100) : 0;
    const failureRate = totalMessages > 0 ? Math.round((failedMessages / totalMessages) * 100) : 0;

    const stats = {
      totalUsers,
      totalProjects,
      totalContacts,
      totalCampaigns,
      totalMessages,
      messagesToday,
      messagesThisWeek,
      messagesThisMonth,
      successRate,
      failureRate
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques admin:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
