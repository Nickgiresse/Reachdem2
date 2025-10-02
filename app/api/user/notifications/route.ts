import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { auth } from '@/lib/auth';

const prisma = new PrismaClient();

// GET - Récupérer les paramètres de notification
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

    // Pour l'instant, retourner des paramètres par défaut
    // Dans une vraie application, vous pourriez stocker ces préférences en base
    const defaultNotifications = {
      emailNotifications: true,
      smsNotifications: false,
      campaignUpdates: true,
      systemAlerts: true,
    };

    return NextResponse.json(defaultNotifications);
  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres de notification:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des paramètres de notification' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT - Mettre à jour les paramètres de notification
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
    const { emailNotifications, smsNotifications, campaignUpdates, systemAlerts } = body;

    // Validation des données
    if (typeof emailNotifications !== 'boolean' || 
        typeof smsNotifications !== 'boolean' || 
        typeof campaignUpdates !== 'boolean' || 
        typeof systemAlerts !== 'boolean') {
      return NextResponse.json(
        { error: 'Tous les paramètres de notification doivent être des booléens' },
        { status: 400 }
      );
    }

    // Pour l'instant, on simule la sauvegarde
    // Dans une vraie application, vous pourriez créer une table user_notifications
    // ou ajouter ces champs à la table user_profiles
    
    const updatedSettings = {
      emailNotifications,
      smsNotifications,
      campaignUpdates,
      systemAlerts,
      updatedAt: new Date().toISOString()
    };

    // TODO: Implémenter la sauvegarde en base de données
    // Exemple avec une table user_notifications:
    /*
    await prisma.userNotifications.upsert({
      where: { userId },
      update: {
        emailNotifications,
        smsNotifications,
        campaignUpdates,
        systemAlerts,
        updatedAt: new Date()
      },
      create: {
        userId,
        emailNotifications,
        smsNotifications,
        campaignUpdates,
        systemAlerts
      }
    });
    */

    return NextResponse.json({
      message: 'Paramètres de notification mis à jour avec succès',
      settings: updatedSettings
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des paramètres de notification:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour des paramètres de notification' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
