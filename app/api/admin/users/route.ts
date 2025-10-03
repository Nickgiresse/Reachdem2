import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      include: {
        UserProfile: {
          select: {
            is_ban: true,
            first_name: true,
            last_name: true,
            last_connection: true,
          }
        },
        Project: {
          select: {
            project_id: true,
            sender_name: true,
            created_at: true,
            _count: {
              select: {
                campaigns: true,
                phonebooks: true
              }
            }
          }
        },
        _count: {
          select: {
            Project: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transformer les données pour correspondre au format attendu par le frontend
    const formattedUsers = users.map((user) => {
      // Calculer les statistiques
      const totalProjects = user.Project.length;
      const totalCampaigns = user.Project.reduce((sum, project) => sum + project._count.campaigns, 0);
      const totalContacts = user.Project.reduce((sum, project) => sum + project._count.phonebooks, 0);
      const totalMessages = 0; // À calculer si nécessaire

      return {
        id: user.id,
        name: user.UserProfile?.first_name && user.UserProfile?.last_name 
          ? `${user.UserProfile.first_name} ${user.UserProfile.last_name}`
          : user.name || 'Utilisateur sans nom',
        email: user.email,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt.toISOString(),
        lastLogin: user.UserProfile?.last_connection?.toISOString(),
        isActive: !user.UserProfile?.is_ban,
        stats: {
          projects: totalProjects,
          campaigns: totalCampaigns,
          messages: totalMessages,
          contacts: totalContacts,
        },
      };
    });

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la récupération des utilisateurs',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json(
        { error: 'ID utilisateur requis' },
        { status: 400 }
      );
    }

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            Project: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Supprimer l'utilisateur (les relations seront supprimées automatiquement grâce à onDelete: Cascade)
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ 
      success: true,
      message: `Utilisateur ${user.email} supprimé avec succès`
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la suppression de l\'utilisateur',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}