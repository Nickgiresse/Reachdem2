import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const campaignId = params.id;

    if (!campaignId) {
      return NextResponse.json(
        { error: "ID de la campagne requis" },
        { status: 400 }
      );
    }

    const campaign = await prisma.campaign.findUnique({
      where: { campaign_id: campaignId },
      include: {
        project: {
          select: {
            project_id: true,
            sender_name: true,
          }
        },
        group: {
          select: {
            group_id: true,
            name: true,
          }
        },
        messages: {
          include: {
            message: {
              select: {
                message_id: true,
                content: true,
                delivered_status: true,
                sent_at: true,
              }
            }
          }
        }
      }
    });

    if (!campaign) {
      return NextResponse.json(
        { error: "Campagne non trouvée" },
        { status: 404 }
      );
    }

    // Transformer les données pour correspondre au format attendu
    const formattedCampaign = {
      id: campaign.campaign_id,
      name: campaign.name,
      channel: "SMS" as const, // Pour l'instant, toutes les campagnes sont SMS
      createdAt: new Date(campaign.created_at).toLocaleDateString("fr-FR"),
      status: campaign.status === "DRAFT" ? "Brouillon" : 
              campaign.status === "SCHEDULED" ? "Programmée" : 
              campaign.status === "RUNNING" ? "En cours" :
              campaign.status === "COMPLETED" ? "Envoyée" :
              campaign.status === "PAUSED" ? "En pause" :
              campaign.status === "CANCELLED" ? "Annulée" : "Brouillon",
      project: campaign.project ? {
        project_id: campaign.project.project_id,
        sender_name: campaign.project.sender_name,
      } : undefined,
      group: campaign.group ? {
        group_id: campaign.group.group_id,
        name: campaign.group.name,
      } : undefined,
      message: campaign.messages.length > 0 ? {
        message_id: campaign.messages[0].message.message_id,
        content: campaign.messages[0].message.content,
        delivered_status: campaign.messages[0].message.delivered_status === "PENDING" ? "En attente" :
                         campaign.messages[0].message.delivered_status === "SENT" ? "Envoyé" :
                         campaign.messages[0].message.delivered_status === "DELIVERED" ? "Livré" :
                         campaign.messages[0].message.delivered_status === "FAILED" ? "Échec" :
                         campaign.messages[0].message.delivered_status === "EXPIRED" ? "Expiré" : "En attente",
        sent_at: campaign.messages[0].message.sent_at?.toISOString(),
      } : undefined,
    };

    return NextResponse.json(formattedCampaign);
  } catch (error) {
    console.error("Erreur lors de la récupération de la campagne:", error);
    return NextResponse.json(
      { 
        error: "Erreur interne du serveur",
        details: process.env.NODE_ENV === "development" ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const campaignId = params.id;

    if (!campaignId) {
      return NextResponse.json(
        { error: "ID de la campagne requis" },
        { status: 400 }
      );
    }

    // Vérifier si la campagne existe
    const existingCampaign = await prisma.campaign.findUnique({
      where: { campaign_id: campaignId }
    });

    if (!existingCampaign) {
      return NextResponse.json(
        { error: "Campagne non trouvée" },
        { status: 404 }
      );
    }

    // Supprimer la campagne (les relations seront supprimées automatiquement grâce à onDelete: Cascade)
    await prisma.campaign.delete({
      where: { campaign_id: campaignId }
    });

    return NextResponse.json(
      { message: "Campagne supprimée avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la suppression de la campagne:", error);
    return NextResponse.json(
      { 
        error: "Erreur interne du serveur",
        details: process.env.NODE_ENV === "development" ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
