import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-utils";

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
    const { firstName, lastName, email, phone, address } = body;

    // Validation des champs requis
    if (!firstName || !lastName || !phone) {
      return NextResponse.json(
        { error: "Les champs nom, prénom et téléphone sont requis" },
        { status: 400 }
      );
    }

    // Récupérer ou créer un projet pour l'utilisateur connecté
    let userProject = await prisma.project.findFirst({
      where: { 
        user_id: currentUser.id,
        sender_name: "Projet par défaut"
      }
    });

    if (!userProject) {
      userProject = await prisma.project.create({
        data: {
          sender_name: "Projet par défaut",
          user_id: currentUser.id,
        }
      });
    }

    // Créer ou récupérer un phonebook par défaut pour cet utilisateur
    let defaultPhonebook = await prisma.phonebook.findFirst({
      where: { 
        name: "Contacts par défaut",
        project_id: userProject.project_id
      }
    });

    if (!defaultPhonebook) {
      defaultPhonebook = await prisma.phonebook.create({
        data: {
          name: "Contacts par défaut",
          description: "Phonebook par défaut pour les contacts",
          project_id: userProject.project_id,
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
    // Vérifier l'authentification
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    // Récupérer les projets de l'utilisateur connecté
    const userProjects = await prisma.project.findMany({
      where: { user_id: currentUser.id },
      select: { project_id: true }
    });

    const userProjectIds = userProjects.map(p => p.project_id);

    // Récupérer les phonebooks des projets de l'utilisateur
    const userPhonebooks = await prisma.phonebook.findMany({
      where: { project_id: { in: userProjectIds } },
      select: { phonebook_id: true }
    });

    const userPhonebookIds = userPhonebooks.map(pb => pb.phonebook_id);

    // Récupérer seulement les contacts de l'utilisateur connecté
    const contacts = await prisma.contact.findMany({
      where: {
        phonebook_id: { in: userPhonebookIds }
      },
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
