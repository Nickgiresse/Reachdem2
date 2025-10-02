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

    // Récupérer l'historique des messages
    const messages = await prisma.message.findMany({
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
      },
      include: {
        campaigns: {
          include: {
            campaign: {
              include: {
                project: {
                  select: {
                    sender_name: true
                  }
                },
                group: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      },
      take: 50 // Limiter à 50 messages récents
    });

    // Transformer les données pour le tableau
    const formattedMessages = messages.map((message, index) => ({
      id: index + 1,
      messageId: message.message_id,
      content: message.content.length > 50 
        ? message.content.substring(0, 50) + '...' 
        : message.content,
      recipient: message.campaigns[0]?.campaign?.group?.name || 'N/A',
      status: message.delivered_status, // Garder le statut original pour la logique côté client
      date: message.sent_at 
        ? new Date(message.sent_at).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          })
        : new Date(message.created_at).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          }),
      project: message.campaigns[0]?.campaign?.project?.sender_name || 'N/A',
      group: message.campaigns[0]?.campaign?.group?.name || 'N/A',
      campaign: message.campaigns[0]?.campaign?.name || 'N/A'
    }));

    return NextResponse.json(formattedMessages);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique des messages:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'historique des messages' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
