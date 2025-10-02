import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Récupérer les activités récentes
    const recentActivities = [];

    // Activités des utilisateurs (création de projets)
    const recentProjects = await prisma.project.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    recentProjects.forEach(project => {
      recentActivities.push({
        id: `project-${project.project_id}`,
        type: 'project',
        action: `Nouveau projet créé: ${project.sender_name}`,
        user: project.user.name || project.user.email,
        timestamp: project.created_at.toISOString(),
        status: 'success'
      });
    });

    // Activités des campagnes
    const recentCampaigns = await prisma.campaign.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
      include: {
        project: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    recentCampaigns.forEach(campaign => {
      recentActivities.push({
        id: `campaign-${campaign.campaign_id}`,
        type: 'campaign',
        action: `Campagne ${campaign.status.toLowerCase()}: ${campaign.name}`,
        user: campaign.project.user.name || campaign.project.user.email,
        timestamp: campaign.created_at.toISOString(),
        status: campaign.status === 'COMPLETED' ? 'success' : 
                campaign.status === 'FAILED' ? 'error' : 'warning'
      });
    });

    // Activités des messages
    const recentMessages = await prisma.message.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
      include: {
        campaigns: {
          include: {
            campaign: {
              include: {
                project: {
                  include: {
                    user: {
                      select: {
                        name: true,
                        email: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    recentMessages.forEach(message => {
      if (message.campaigns.length > 0) {
        const campaign = message.campaigns[0].campaign;
        recentActivities.push({
          id: `message-${message.message_id}`,
          type: 'message',
          action: `Message ${message.delivered_status.toLowerCase()}: ${message.content.substring(0, 30)}...`,
          user: campaign.project.user.name || campaign.project.user.email,
          timestamp: message.sent_at?.toISOString() || message.created_at.toISOString(),
          status: message.delivered_status === 'DELIVERED' ? 'success' : 
                  message.delivered_status === 'FAILED' ? 'error' : 'warning'
        });
      }
    });

    // Trier par timestamp et prendre les 10 plus récentes
    const sortedActivities = recentActivities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);

    return NextResponse.json(sortedActivities);
  } catch (error) {
    console.error('Erreur lors de la récupération des activités récentes:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des activités' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
