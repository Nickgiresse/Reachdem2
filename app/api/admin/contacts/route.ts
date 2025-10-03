import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      include: {
        phonebook: {
          include: {
            project: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
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
      orderBy: {
        created_at: "desc",
      },
    });

    // Transformer les données pour correspondre à l'interface attendue
    const transformedContacts = contacts.map((contact) => ({
      id: contact.contact_id,
      firstName: contact.first_name,
      lastName: contact.last_name,
      email: contact.email || undefined,
      phone: contact.phone,
      address: contact.address || undefined,
      createdAt: contact.created_at.toISOString(),
      user: {
        id: contact.phonebook.project.user.id,
        name: contact.phonebook.project.user.name || "Utilisateur",
        email: contact.phonebook.project.user.email,
      },
      groups: contact.groups.map((groupContact) => ({
        id: groupContact.group.group_id,
        name: groupContact.group.name,
      })),
    }));

    return NextResponse.json(transformedContacts);
  } catch (error) {
    console.error("Erreur lors de la récupération des contacts:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des contacts" },
      { status: 500 }
    );
  }
}