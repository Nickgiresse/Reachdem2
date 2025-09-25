import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { group_id, contact_ids } = body;

    // Validation des données
    if (!group_id || !contact_ids || !Array.isArray(contact_ids) || contact_ids.length === 0) {
      return NextResponse.json(
        { error: 'Groupe et contacts sont obligatoires' },
        { status: 400 }
      );
    }

    // Vérifier que le groupe existe
    const group = await prisma.group.findUnique({
      where: { group_id },
    });

    if (!group) {
      return NextResponse.json(
        { error: 'Groupe non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier que tous les contacts existent
    const contacts = await prisma.contact.findMany({
      where: { contact_id: { in: contact_ids } },
    });

    if (contacts.length !== contact_ids.length) {
      return NextResponse.json(
        { error: 'Un ou plusieurs contacts non trouvés' },
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
