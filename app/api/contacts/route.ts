import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, address } = body;

    // Validation des champs requis
    if (!firstName || !lastName || !phone) {
      return NextResponse.json(
        { error: "Les champs nom, prénom et téléphone sont requis" },
        { status: 400 }
      );
    }

    // Créer ou récupérer un phonebook par défaut
    let defaultPhonebook = await prisma.phonebook.findFirst({
      where: { name: "Contacts par défaut" }
    });

    if (!defaultPhonebook) {
      // Récupérer le premier utilisateur existant ou créer un utilisateur par défaut
      let defaultUser = await prisma.user.findFirst();
      
      if (!defaultUser) {
        // Créer un utilisateur par défaut
        defaultUser = await prisma.user.create({
          data: {
            email: "default@example.com",
            name: "Utilisateur par défaut",
          }
        });
      }

      // Créer un projet par défaut
      let defaultProject = await prisma.project.findFirst({
        where: { sender_name: "Projet par défaut" }
      });

      if (!defaultProject) {
        defaultProject = await prisma.project.create({
          data: {
            sender_name: "Projet par défaut",
            user_id: defaultUser.id,
          }
        });
      }

      // Créer le phonebook par défaut
      defaultPhonebook = await prisma.phonebook.create({
        data: {
          name: "Contacts par défaut",
          description: "Phonebook par défaut pour les contacts",
          project_id: defaultProject.project_id,
        }
      });
    }

    const contact = await prisma.contact.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        email: email || null,
        address: address || null,
        phonebook_id: defaultPhonebook.phonebook_id,
      },
    });

    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création du contact:", error);
    return NextResponse.json(
      { 
        error: "Erreur interne du serveur",
        details: process.env.NODE_ENV === "development" ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
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
      },
      orderBy: {
        created_at: "desc",
      },
    });

    // Transformer les données pour correspondre au format attendu par le tableau
    const formattedContacts = contacts.map((contact) => ({
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
    }));

    return NextResponse.json(formattedContacts);
  } catch (error) {
    console.error("Erreur lors de la récupération des contacts:", error);
    return NextResponse.json(
      { 
        error: "Erreur interne du serveur",
        details: process.env.NODE_ENV === "development" ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}
