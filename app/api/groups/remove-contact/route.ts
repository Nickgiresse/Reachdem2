import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { group_id, contact_id } = body;

    // Validation des données
    if (!group_id || !contact_id) {
      return NextResponse.json(
        { error: 'Groupe et contact sont obligatoires' },
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

    // Vérifier que le contact existe
    const contact = await prisma.contact.findUnique({
      where: { contact_id },
    });

    if (!contact) {
      return NextResponse.json(
        { error: 'Contact non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier que la relation existe
    const existingRelation = await prisma.groupContact.findUnique({
      where: {
        group_id_contact_id: {
          group_id,
          contact_id,
        }
      }
    });

    if (!existingRelation) {
      return NextResponse.json(
        { error: 'Le contact n\'est pas dans ce groupe' },
        { status: 400 }
      );
    }

    // Supprimer la relation
    await prisma.groupContact.delete({
      where: {
        group_id_contact_id: {
          group_id,
          contact_id,
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: `Contact retiré du groupe "${group.name}" avec succès`,
    });
  } catch (error) {
    console.error('Erreur lors du retrait du contact du groupe:', error);
    return NextResponse.json(
      { error: 'Erreur lors du retrait du contact du groupe' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
