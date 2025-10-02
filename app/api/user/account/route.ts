import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { auth } from '@/lib/auth';
import { hash, verify } from '@node-rs/argon2';

const prisma = new PrismaClient();

// PUT - Mettre à jour les informations de compte
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
    const { name, email, currentPassword, newPassword } = body;

    // Récupérer l'utilisateur actuel
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (email && email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'Cet email est déjà utilisé' },
          { status: 400 }
        );
      }
    }

    // Si un nouveau mot de passe est fourni, vérifier l'ancien
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: 'Le mot de passe actuel est requis pour changer le mot de passe' },
          { status: 400 }
        );
      }

      // Récupérer le compte avec le mot de passe hashé
      const account = await prisma.account.findFirst({
        where: { userId }
      });

      if (!account || !account.password) {
        return NextResponse.json(
          { error: 'Aucun mot de passe trouvé pour ce compte' },
          { status: 400 }
        );
      }

      // Vérifier le mot de passe actuel
      try {
        const isValidPassword = await verify(account.password, currentPassword);
        if (!isValidPassword) {
          return NextResponse.json(
            { error: 'Mot de passe actuel incorrect' },
            { status: 400 }
          );
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du mot de passe:', error);
        return NextResponse.json(
          { error: 'Erreur lors de la vérification du mot de passe' },
          { status: 500 }
        );
      }

      // Hasher le nouveau mot de passe
      const hashedNewPassword = await hash(newPassword);
      
      // Mettre à jour le mot de passe dans le compte
      await prisma.account.update({
        where: { id: account.id },
        data: { password: hashedNewPassword }
      });
    }

    // Mettre à jour les informations utilisateur
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name || user.name,
        email: email || user.email,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      message: 'Compte mis à jour avec succès',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        emailVerified: updatedUser.emailVerified
      }
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du compte:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du compte' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
