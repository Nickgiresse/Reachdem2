import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { getCurrentUser } from '@/lib/auth-utils';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Vérifier l'authentification
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    // Récupérer seulement les campagnes des projets de l'utilisateur connecté
    const campaigns = await prisma.campaign.findMany({
      where: {
        project: {
          user_id: currentUser.id
        }
      },
      include: {
        project: {
          select: {
            sender_name: true,
          },
        },
        group: {
          select: {
            name: true,
          },
        },
        messages: {
          include: {
            message: {
              select: {
                content: true,
              },
            },
          },
        },
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
    }));

    return NextResponse.json(formattedCampaigns);
  } catch (error) {
    console.error('Erreur lors de la récupération des campagnes:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des campagnes' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, project_id, group_ids, message } = body;

    // Validation des données
    if (!name || !project_id || !group_ids || !Array.isArray(group_ids) || group_ids.length === 0 || !message) {
      return NextResponse.json(
        { error: 'Tous les champs sont obligatoires' },
        { status: 400 }
      );
    }

    // Vérifier que le projet existe et appartient à l'utilisateur connecté
    const project = await prisma.project.findUnique({
      where: { project_id },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Projet non trouvé' },
        { status: 404 }
      );
    }

    if (project.user_id !== currentUser.id) {
      return NextResponse.json(
        { error: 'Non autorisé à créer des campagnes pour ce projet' },
        { status: 403 }
      );
    }

    // Vérifier que tous les groupes existent et appartiennent à l'utilisateur connecté
    const groups = await prisma.group.findMany({
      where: { 
        group_id: { in: group_ids },
        user_id: currentUser.id
      },
    });

    if (groups.length !== group_ids.length) {
      return NextResponse.json(
        { error: 'Un ou plusieurs groupes non trouvés ou non autorisés' },
        { status: 404 }
      );
    }

    // Créer le message d'abord
    const createdMessage = await prisma.message.create({
      data: {
        content: message,
        delivered_status: 'PENDING',
      },
    });

    // Créer une campagne pour chaque groupe
    const campaigns = [];
    for (const group_id of group_ids) {
      const campaign = await prisma.campaign.create({
        data: {
          name: group_ids.length > 1 ? `${name} - ${groups.find(g => g.group_id === group_id)?.name}` : name,
          project_id,
          group_id,
          status: 'DRAFT',
        },
      });

      // Lier le message à la campagne
      await prisma.campaignMessage.create({
        data: {
          campaign_id: campaign.campaign_id,
          message_id: createdMessage.message_id,
          order: 0,
        },
      });

      campaigns.push(campaign);
    }

    return NextResponse.json({
      success: true,
      campaigns: campaigns.map(campaign => ({
        id: campaign.campaign_id,
        name: campaign.name,
        status: campaign.status,
      })),
      message: `${campaigns.length} campagne(s) créée(s) avec succès`,
    });
  } catch (error) {
    console.error('Erreur lors de la création de la campagne:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la campagne' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
