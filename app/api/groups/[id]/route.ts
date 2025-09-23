import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const groupId = params.id;

    if (!groupId) {
      return NextResponse.json(
        { error: "ID du groupe requis" },
        { status: 400 }
      );
    }

    const group = await prisma.group.findUnique({
      where: { group_id: groupId },
      include: {
        contacts: {
          include: {
            contact: {
              select: {
                contact_id: true,
                first_name: true,
                last_name: true,
                email: true,
                phone: true,
                address: true,
                created_at: true,
              }
            }
          }
        }
      }
    });

    if (!group) {
      return NextResponse.json(
        { error: "Groupe non trouvé" },
        { status: 404 }
      );
    }

    // Transformer les données pour correspondre au format attendu
    const formattedGroup = {
      group_id: group.group_id,
      name: group.name,
      description: group.description || "",
      members: group.contacts.length,
      createdAt: new Date(group.created_at).toLocaleDateString("fr-FR"),
      contacts: group.contacts.map(gc => ({
        contact_id: gc.contact.contact_id,
        name: `${gc.contact.first_name} ${gc.contact.last_name}`,
        email: gc.contact.email || "",
        phone: gc.contact.phone,
        address: gc.contact.address || "",
        addedAt: new Date(gc.added_at).toLocaleDateString("fr-FR"),
      })),
    };

    return NextResponse.json(formattedGroup);
  } catch (error) {
    console.error("Erreur lors de la récupération du groupe:", error);
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