import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const groups = await prisma.group.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        contacts: {
          select: {
            contact: {
              select: {
                contact_id: true,
                phonebook: {
                  select: {
                    project: {
                      select: {
                        project_id: true,
                        sender_name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        campaigns: {
          select: {
            campaign_id: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    // Transformer les données pour correspondre à l'interface attendue
    const transformedGroups = groups.map((group) => {
      // Récupérer le projet associé (via le premier contact)
      const project = group.contacts[0]?.contact.phonebook?.project;

      return {
        id: group.group_id,
        name: group.name,
        description: group.description,
        createdAt: group.created_at.toISOString(),
        updatedAt: group.updated_at.toISOString(),
        user: {
          id: group.user.id,
          name: group.user.name || "Utilisateur",
          email: group.user.email,
        },
        project: {
          id: project?.project_id || "",
          name: project?.sender_name || "Aucun projet",
        },
        contactCount: group.contacts.length,
        campaignCount: group.campaigns.length,
      };
    });

    return NextResponse.json(transformedGroups);
  } catch (error) {
    console.error("Erreur lors de la récupération des groupes:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des groupes" },
      { status: 500 }
    );
  }
}