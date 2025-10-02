import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Récupérer toutes les statistiques en parallèle
    const [
      totalUsers,
      activeUsers,
      newUsersThisMonth,
      totalProjects,
      activeProjects,
      totalCampaigns,
      activeCampaigns,
      completedCampaigns,
      totalMessages,
      messagesToday,
      messagesThisWeek,
      messagesThisMonth,
      successfulMessages,
      failedMessages,
      pendingMessages,
      totalContacts,
      newContactsThisWeek,
      totalGroups,
      activeGroups
    ] = await Promise.all([
      // Utilisateurs
      prisma.user.count(),
      prisma.user.count({
        where: {
          UserProfile: {
            is_ban: false
          }
        }
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      }),
      
      // Projets
      prisma.project.count(),
      prisma.project.count({
        where: {
          campaigns: {
            some: {
              status: {
                in: ['RUNNING', 'SCHEDULED']
              }
            }
          }
        }
      }),
      
      // Campagnes
      prisma.campaign.count(),
      prisma.campaign.count({
        where: {
          status: {
            in: ['RUNNING', 'SCHEDULED']
          }
        }
      }),
      prisma.campaign.count({
        where: {
          status: 'COMPLETED'
        }
      }),
      
      // Messages
      prisma.message.count(),
      prisma.message.count({
        where: {
          created_at: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      }),
      prisma.message.count({
        where: {
          created_at: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      prisma.message.count({
        where: {
          created_at: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      }),
      prisma.message.count({
        where: {
          delivered_status: 'DELIVERED'
        }
      }),
      prisma.message.count({
        where: {
          delivered_status: 'FAILED'
        }
      }),
      prisma.message.count({
        where: {
          delivered_status: 'PENDING'
        }
      }),
      
      // Contacts
      prisma.contact.count(),
      prisma.contact.count({
        where: {
          created_at: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      
      // Groupes
      prisma.group.count(),
      prisma.group.count({
        where: {
          contacts: {
            some: {}
          }
        }
      })
    ]);

    // Calculer le taux de réussite des messages
    const successRate = totalMessages > 0 ? 
      Math.round((successfulMessages / totalMessages) * 100 * 10) / 10 : 0;

    // Récupérer l'activité récente
    const recentActivity = await Promise.all([
      // Derniers utilisateurs inscrits
      prisma.user.findMany({
        take: 2,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true
        }
      }),
      // Dernières campagnes créées
      prisma.campaign.findMany({
        take: 2,
        orderBy: { created_at: 'desc' },
        select: {
          campaign_id: true,
          name: true,
          created_at: true,
          project: {
            select: {
              user: {
                select: {
                  email: true
                }
              }
            }
          }
        }
      }),
      // Derniers projets créés
      prisma.project.findMany({
        take: 2,
        orderBy: { created_at: 'desc' },
        select: {
          project_id: true,
          sender_name: true,
          created_at: true,
          user: {
            select: {
              email: true
            }
          }
        }
      })
    ]);

    // Formater l'activité récente
    const formattedActivity = [
      ...recentActivity[0].map(user => ({
        id: `user_${user.id}`,
        type: 'user_registration' as const,
        description: 'Nouvel utilisateur inscrit',
        timestamp: user.createdAt.toISOString(),
        user: user.email
      })),
      ...recentActivity[1].map(campaign => ({
        id: `campaign_${campaign.campaign_id}`,
        type: 'campaign_created' as const,
        description: `Nouvelle campagne créée: ${campaign.name}`,
        timestamp: campaign.created_at.toISOString(),
        user: campaign.project.user.email
      })),
      ...recentActivity[2].map(project => ({
        id: `project_${project.project_id}`,
        type: 'project_created' as const,
        description: `Nouveau projet créé: ${project.sender_name}`,
        timestamp: project.created_at.toISOString(),
        user: project.user.email
      }))
    ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

    const stats = {
      users: {
        total: totalUsers,
        active: activeUsers,
        newThisMonth: newUsersThisMonth,
      },
      projects: {
        total: totalProjects,
        active: activeProjects,
      },
      campaigns: {
        total: totalCampaigns,
        active: activeCampaigns,
        completed: completedCampaigns,
      },
      messages: {
        total: totalMessages,
        today: messagesToday,
        thisWeek: messagesThisWeek,
        thisMonth: messagesThisMonth,
        successful: successfulMessages,
        failed: failedMessages,
        pending: pendingMessages,
        successRate: successRate,
      },
      contacts: {
        total: totalContacts,
        newThisWeek: newContactsThisWeek,
      },
      groups: {
        total: totalGroups,
        active: activeGroups,
      },
    };

    return NextResponse.json({
      stats,
      recentActivity: formattedActivity
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques admin:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la récupération des statistiques',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
