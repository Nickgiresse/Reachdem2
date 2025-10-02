import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const groups = await prisma.group.findMany({
      include: {
        contacts: {
          select: {
            contact_id: true,
          }
        },
        campaigns: {
          select: {
            campaign_id: true,
            project: {
              select: {
                user: {
                  select: {
                    email: true
                  }
                }
              }
            }
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
      campaigns: group.campaigns.length,
      users: [...new Set(group.campaigns.map(c => c.project.user.email))]
    }));

    return NextResponse.json(formattedGroups);
  } catch (error) {
    console.error('Erreur lors de la récupération des groupes:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la récupération des groupes',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
