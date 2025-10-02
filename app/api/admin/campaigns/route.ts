import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const campaigns = await prisma.campaign.findMany({
      include: {
        project: {
          select: {
            sender_name: true,
            user: {
              select: {
                email: true
              }
            }
          }
        },
        group: {
          select: {
            name: true,
          }
        },
        messages: {
          include: {
            message: {
              select: {
                content: true,
                delivered_status: true
              }
            }
          }
        }
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    // Transformer les données pour correspondre au format attendu par le frontend
    const formattedCampaigns = campaigns.map(campaign => ({
      id: campaign.campaign_id,
      name: campaign.name,
      channel: 'SMS', // Pour l'instant, on assume que c'est toujours SMS
      createdAt: campaign.created_at.toLocaleDateString('fr-FR'),
      status: campaign.status === 'DRAFT' ? 'Brouillon' : 
              campaign.status === 'SCHEDULED' ? 'Programmée' : 
              campaign.status === 'RUNNING' ? 'En cours' :
              campaign.status === 'COMPLETED' ? 'Envoyée' : 'Brouillon',
      project: campaign.project.sender_name,
      group: campaign.group.name,
      message: campaign.messages[0]?.message?.content || '',
      user: campaign.project.user.email
    }));

    return NextResponse.json(formattedCampaigns);
  } catch (error) {
    console.error('Erreur lors de la récupération des campagnes:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la récupération des campagnes',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
