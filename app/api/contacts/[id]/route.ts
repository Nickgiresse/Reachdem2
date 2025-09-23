import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contactId = params.id;

    if (!contactId) {
      return NextResponse.json(
        { error: "ID du contact requis" },
        { status: 400 }
      );
    }

    const contact = await prisma.contact.findUnique({
      where: { contact_id: contactId },
      include: {
        groups: {
          include: {
            group: {
              select: {
                name: true,
                group_id: true,
              }
            }
          }
        }
      }
    });

    if (!contact) {
      return NextResponse.json(
        { error: "Contact non trouvé" },
        { status: 404 }
      );
    }

    // Transformer les données pour correspondre au format attendu
    const formattedContact = {
      id: contact.contact_id,
      name: `${contact.first_name} ${contact.last_name}`,
      email: contact.email || "",
      phone: contact.phone,
      address: contact.address || "",
      addedAt: new Date(contact.created_at).toLocaleDateString("fr-FR"),
      groups: contact.groups.map(gc => ({
        group_id: gc.group.group_id,
        name: gc.group.name,
      })),
    };

    return NextResponse.json(formattedContact);
  } catch (error) {
    console.error("Erreur lors de la récupération du contact:", error);
    return NextResponse.json(
      { 
        error: "Erreur interne du serveur",
        details: process.env.NODE_ENV === "development" ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contactId = params.id;

    if (!contactId) {
      return NextResponse.json(
        { error: "ID du contact requis" },
        { status: 400 }
      );
    }

    // Vérifier si le contact existe
    const existingContact = await prisma.contact.findUnique({
      where: { contact_id: contactId }
    });

    if (!existingContact) {
      return NextResponse.json(
        { error: "Contact non trouvé" },
        { status: 404 }
      );
    }

    // Supprimer le contact
    await prisma.contact.delete({
      where: { contact_id: contactId }
    });

    return NextResponse.json(
      { message: "Contact supprimé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la suppression du contact:", error);
    return NextResponse.json(
      { 
        error: "Erreur interne du serveur",
        details: process.env.NODE_ENV === "development" ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}
