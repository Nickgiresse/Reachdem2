import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { auth } from '@/lib/auth';

const prisma = new PrismaClient();

// GET - Récupérer le profil utilisateur
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Récupérer les données utilisateur avec le profil
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        UserProfile: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du profil' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT - Mettre à jour le profil utilisateur
export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await request.json();
    const { firstName, lastName, phone, city, country, locale } = body;

    // Validation des données
    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: 'Le prénom et le nom sont requis' },
        { status: 400 }
      );
    }

    // Vérifier si le profil existe
    const existingProfile = await prisma.userProfile.findUnique({
      where: { userId }
    });

    if (existingProfile) {
      // Mettre à jour le profil existant
      const updatedProfile = await prisma.userProfile.update({
        where: { userId },
        data: {
          first_name: firstName,
          last_name: lastName,
          phone: phone || null,
          city: city || null,
          country: country || null,
          locale: locale || 'FR',
          updated_at: new Date()
        }
      });

      return NextResponse.json({
        message: 'Profil mis à jour avec succès',
        profile: updatedProfile
      });
    } else {
      // Créer un nouveau profil
      const newProfile = await prisma.userProfile.create({
        data: {
          userId,
          first_name: firstName,
          last_name: lastName,
          phone: phone || null,
          city: city || null,
          country: country || null,
          locale: locale || 'FR',
          account_type: 'INDIVIDUAL',
          is_admin: false,
          is_ban: false,
          kyc_objects: []
        }
      });

      return NextResponse.json({
        message: 'Profil créé avec succès',
        profile: newProfile
      });
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du profil' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
