import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { auth } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Récupérer la session utilisateur
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Récupérer les projets de l'utilisateur
    const projects = await prisma.project.findMany({
      where: { user_id: userId },
      include: {
        campaigns: {
          include: {
            messages: {
              include: {
                message: true
              }
            }
          }
        }
      }
    });

    // Calculer les statistiques des projets
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => 
      p.campaigns.some(c => c.status === 'RUNNING' || c.status === 'SCHEDULED')
    ).length;

    // Calculer les statistiques des messages
    const allMessages = projects.flatMap(p => 
      p.campaigns.flatMap(c => c.messages.map(cm => cm.message))
    );

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Messages du mois
    const monthlyMessages = allMessages.filter(m => 
      m.created_at >= startOfMonth
    ).length;

    // Messages d'aujourd'hui
    const todayMessages = allMessages.filter(m => 
      m.created_at >= startOfDay
    ).length;

    // Messages de cette semaine
    const weekMessages = allMessages.filter(m => 
      m.created_at >= startOfWeek
    ).length;

    // Messages par statut
    const successfulMessages = allMessages.filter(m => 
      m.delivered_status === 'DELIVERED'
    ).length;

    const pendingMessages = allMessages.filter(m => 
      m.delivered_status === 'PENDING'
    ).length;

    const failedMessages = allMessages.filter(m => 
      m.delivered_status === 'FAILED'
    ).length;

    // Taux de réussite
    const totalSentMessages = allMessages.filter(m => 
      m.delivered_status !== 'PENDING'
    ).length;
    
    const successRate = totalSentMessages > 0 
      ? (successfulMessages / totalSentMessages) * 100 
      : 0;

    // Moyenne par jour (sur les 30 derniers jours)
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    const messagesLast30Days = allMessages.filter(m => 
      m.created_at >= thirtyDaysAgo
    ).length;
    const averagePerDay = messagesLast30Days / 30;


    const stats = {
      projects: {
        total: totalProjects,
        active: activeProjects
      },
      messages: {
        monthly: monthlyMessages,
        today: todayMessages,
        week: weekMessages,
        averagePerDay: Math.round(averagePerDay * 10) / 10,
        successful: successfulMessages,
        pending: pendingMessages,
        failed: failedMessages,
        successRate: Math.round(successRate * 10) / 10
      }
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
