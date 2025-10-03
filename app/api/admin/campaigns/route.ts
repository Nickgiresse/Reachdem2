import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const campaigns = await prisma.campaign.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        project: {
          select: {
            project_id: true,
            sender_name: true,
          },
        },
        groups: {
          include: {
            group: {
              select: {
                group_id: true,
                name: true,
              },
            },
          },
        },
        messages: {
          select: {
            message_id: true,
            content: true,
            status: true,
            sent_at: true,
            created_at: true,
            contact: {
              select: {
                contact_id: true,
                first_name: true,
                last_name: true,
                phone: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    // Transformer les données pour correspondre à l'interface attendue
    const transformedCampaigns = campaigns.map((campaign) => {
      const totalRecipients = campaign.messages.length;
      const sent = campaign.messages.filter(m => m.status === 'SENT' || m.status === 'DELIVERED').length;
      const delivered = campaign.messages.filter(m => m.status === 'DELIVERED').length;
      const failed = campaign.messages.filter(m => m.status === 'FAILED').length;

      return {
        id: campaign.campaign_id,
        name: campaign.name,
        status: campaign.status,
        scheduledAt: campaign.scheduled_at?.toISOString(),
        createdAt: campaign.created_at.toISOString(),
        updatedAt: campaign.updated_at.toISOString(),
        user: {
          id: campaign.user.id,
          name: campaign.user.name || "Utilisateur",
          email: campaign.user.email,
        },
        project: {
          id: campaign.project.project_id,
          name: campaign.project.sender_name,
        },
        group: {
          id: campaign.groups[0]?.group.group_id || "",
          name: campaign.groups[0]?.group.name || "Aucun groupe",
        },
        messages: campaign.messages.slice(0, 1).map(msg => ({
          id: msg.message_id,
          content: msg.content,
        })),
        stats: {
          totalRecipients,
          sent,
          delivered,
          failed,
        },
      };
    });

    return NextResponse.json(transformedCampaigns);
  } catch (error) {
    console.error("Erreur lors de la récupération des campagnes:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des campagnes" },
      { status: 500 }
    );
  }
}