import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { getCurrentUser } from '@/lib/auth-utils';

const prisma = new PrismaClient();

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
    const { group_id, contact_ids } = body;

    // Validation des données
    if (!group_id || !contact_ids || !Array.isArray(contact_ids) || contact_ids.length === 0) {
      return NextResponse.json(
        { error: 'Groupe et contacts sont obligatoires' },
        { status: 400 }
      );
    }

    // Vérifier que le groupe existe et appartient à l'utilisateur connecté
    const group = await prisma.group.findUnique({
      where: { group_id },
    });

    if (!group) {
      return NextResponse.json(
        { error: 'Groupe non trouvé' },
        { status: 404 }
      );
    }

    if (group.user_id !== currentUser.id) {
      return NextResponse.json(
        { error: 'Non autorisé à modifier ce groupe' },
        { status: 403 }
      );
    }

    // Récupérer les projets de l'utilisateur pour vérifier les contacts
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

    // Vérifier que tous les contacts existent et appartiennent à l'utilisateur connecté
    const contacts = await prisma.contact.findMany({
      where: { 
        contact_id: { in: contact_ids },
        phonebook_id: { in: userPhonebookIds }
      },
    });

    if (contacts.length !== contact_ids.length) {
      return NextResponse.json(
        { error: 'Un ou plusieurs contacts non trouvés ou non autorisés' },
        { status: 404 }
      );
    }

    // Vérifier quels contacts ne sont pas déjà dans le groupe
    const existingGroupContacts = await prisma.groupContact.findMany({
      where: {
        group_id,
        contact_id: { in: contact_ids },
      },
    });

    const existingContactIds = existingGroupContacts.map(gc => gc.contact_id);
    const newContactIds = contact_ids.filter(id => !existingContactIds.includes(id));

    if (newContactIds.length === 0) {
      return NextResponse.json(
        { error: 'Tous les contacts sélectionnés sont déjà dans ce groupe' },
        { status: 400 }
      );
    }

    // Ajouter les nouveaux contacts au groupe
    const groupContacts = newContactIds.map(contact_id => ({
      group_id,
      contact_id,
      added_at: new Date(),
    }));

    await prisma.groupContact.createMany({
      data: groupContacts,
    });

    const message = newContactIds.length === contact_ids.length
      ? `${newContactIds.length} contact(s) ajouté(s) au groupe "${group.name}" avec succès`
      : `${newContactIds.length} contact(s) ajouté(s) au groupe "${group.name}" avec succès. ${contact_ids.length - newContactIds.length} contact(s) étaient déjà dans le groupe.`;

    return NextResponse.json({
      success: true,
      message,
      added_count: newContactIds.length,
      already_in_group: contact_ids.length - newContactIds.length,
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout des contacts au groupe:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout des contacts au groupe' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
