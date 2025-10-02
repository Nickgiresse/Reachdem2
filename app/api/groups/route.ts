import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { getCurrentUser } from '@/lib/auth-utils';

const prisma = new PrismaClient();

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

    // Récupérer seulement les groupes de l'utilisateur connecté
    const groups = await prisma.group.findMany({
      where: {
        user_id: currentUser.id
      },
      include: {
        contacts: {
          select: {
            contact_id: true,
          }
        }
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    // Transformer les données pour correspondre au format attendu par le frontend
    const formattedGroups = groups.map((group) => ({
      group_id: group.group_id,
      name: group.name,
      description: group.description || '',
      members: group.contacts.length,
      createdAt: new Date(group.created_at).toLocaleDateString('fr-FR'),
    }));

    return NextResponse.json(formattedGroups);
  } catch (error) {
    console.error('Erreur lors de la récupération des groupes:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des groupes' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

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
    const { name, description, contactIds } = body;

    // Validation des données
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Le nom du groupe est obligatoire' },
        { status: 400 }
      );
    }

    // Créer le groupe pour l'utilisateur connecté
    const group = await prisma.group.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        user_id: currentUser.id,
      },
    });

    // Si des contacts sont fournis, les ajouter au groupe
    if (contactIds && Array.isArray(contactIds) && contactIds.length > 0) {
      // Vérifier que tous les contacts existent
      const contacts = await prisma.contact.findMany({
        where: { contact_id: { in: contactIds } },
      });

      if (contacts.length !== contactIds.length) {
        return NextResponse.json(
          { error: 'Un ou plusieurs contacts non trouvés' },
          { status: 404 }
        );
      }

      // Ajouter les contacts au groupe
      const groupContacts = contactIds.map(contact_id => ({
        group_id: group.group_id,
        contact_id,
        added_at: new Date(),
      }));

      await prisma.groupContact.createMany({
        data: groupContacts,
      });
    }

    // Retourner le groupe créé avec le nombre de membres
    const createdGroup = await prisma.group.findUnique({
      where: { group_id: group.group_id },
      include: {
        contacts: {
          select: {
            contact_id: true,
          }
        }
      },
    });

    const formattedGroup = {
      group_id: createdGroup!.group_id,
      name: createdGroup!.name,
      description: createdGroup!.description || '',
      members: createdGroup!.contacts.length,
      createdAt: new Date(createdGroup!.created_at).toLocaleDateString('fr-FR'),
    };

    return NextResponse.json(formattedGroup, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du groupe:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du groupe' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get('id');

    if (!groupId) {
      return NextResponse.json(
        { error: 'ID du groupe requis' },
        { status: 400 }
      );
    }

    // Vérifier que le groupe existe et appartient à l'utilisateur connecté
    const group = await prisma.group.findUnique({
      where: { group_id: groupId },
    });

    if (!group) {
      return NextResponse.json(
        { error: 'Groupe non trouvé' },
        { status: 404 }
      );
    }

    if (group.user_id !== currentUser.id) {
      return NextResponse.json(
        { error: 'Non autorisé à supprimer ce groupe' },
        { status: 403 }
      );
    }

    // Supprimer le groupe (les relations seront supprimées automatiquement grâce à onDelete: Cascade)
    await prisma.group.delete({
      where: { group_id: groupId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression du groupe:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du groupe' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}