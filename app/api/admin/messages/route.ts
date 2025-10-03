import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const messages = await prisma.message.findMany({
      include: {
        campaign: {
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
          },
        },
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
      orderBy: {
        created_at: "desc",
      },
    });

    // Transformer les données pour correspondre à l'interface attendue
    const transformedMessages = messages.map((message) => ({
      id: message.message_id,
      content: message.content,
      status: message.status,
      sentAt: message.sent_at?.toISOString(),
      createdAt: message.created_at.toISOString(),
      user: {
        id: message.campaign.user.id,
        name: message.campaign.user.name || "Utilisateur",
        email: message.campaign.user.email,
      },
      campaign: {
        id: message.campaign.campaign_id,
        name: message.campaign.name,
      },
      project: {
        id: message.campaign.project.project_id,
        name: message.campaign.project.sender_name,
      },
      group: {
        id: message.campaign.groups[0]?.group.group_id || "",
        name: message.campaign.groups[0]?.group.name || "Aucun groupe",
      },
      recipient: {
        name: `${message.contact.first_name} ${message.contact.last_name}`,
        phone: message.contact.phone,
        email: message.contact.email || undefined,
      },
    }));

    return NextResponse.json(transformedMessages);
  } catch (error) {
    console.error("Erreur lors de la récupération des messages:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des messages" },
      { status: 500 }
    );
  }
}
