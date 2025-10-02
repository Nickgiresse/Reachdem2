import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      include: {
        UserProfile: true,
        Project: {
          include: {
            _count: {
              select: {
                campaigns: true,
                phonebooks: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transformer les données pour correspondre au format attendu par le frontend
    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.name || (user.UserProfile ? `${user.UserProfile.first_name} ${user.UserProfile.last_name}` : null),
      email: user.email,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt.toISOString(),
      lastLogin: user.UserProfile?.last_connection?.toISOString(),
      isActive: !user.UserProfile?.is_ban,
      stats: {
        projects: user.Project.length,
        campaigns: user.Project.reduce((acc, project) => acc + project._count.campaigns, 0),
        messages: 0, // Calculé séparément si nécessaire
        contacts: user.Project.reduce((acc, project) => acc + project._count.phonebooks, 0)
      }
    }));

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