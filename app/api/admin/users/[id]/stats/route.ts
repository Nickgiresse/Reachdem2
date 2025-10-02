import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Récupérer les statistiques de l'utilisateur
    const [
      totalProjects,
      totalCampaigns,
      totalContacts,
      totalMessages,
      successfulMessages,
      failedMessages
    ] = await Promise.all([
      // Nombre total de projets
      prisma.project.count({
        where: { user_id: userId }
      }),
      
      // Nombre total de campagnes
      prisma.campaign.count({
        where: {
          project: {
            user_id: userId
          }
        }
      }),
      
      // Nombre total de contacts
      prisma.contact.count({
        where: {
          phonebook: {
            project: {
              user_id: userId
            }
          }
        }
      }),
      
      // Nombre total de messages
      prisma.message.count({
        where: {
          campaigns: {
            some: {
              campaign: {
                project: {
                  user_id: userId
                }
              }
            }
          }
        }
      }),
      
      // Messages réussis
      prisma.message.count({
        where: {
          delivered_status: 'DELIVERED',
          campaigns: {
            some: {
              campaign: {
                project: {
                  user_id: userId
                }
              }
            }
          }
        }
      }),
      
      // Messages échoués
      prisma.message.count({
        where: {
          delivered_status: 'FAILED',
          campaigns: {
            some: {
              campaign: {
                project: {
                  user_id: userId
                }
              }
            }
          }
        }
      })
    ]);

    const stats = {
      totalProjects,
      totalCampaigns,
      totalContacts,
      totalMessages,
      successfulMessages,
      failedMessages
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques utilisateur:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la récupération des statistiques utilisateur',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}