import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const projects = await prisma.project.findMany({
      include: {
        user: {
          select: {
            email: true,
            name: true
          }
        },
        _count: {
          select: {
            campaigns: true,
            phonebooks: true
          }
        }
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    // Transformer les données pour correspondre au format attendu par le frontend
    const formattedProjects = projects.map((project) => ({
      project_id: project.project_id,
      sender_name: project.sender_name,
      created_at: project.created_at.toISOString(),
      user: project.user.email,
      userName: project.user.name,
      campaigns: project._count.campaigns,
      phonebooks: project._count.phonebooks,
      is_active: project._count.campaigns > 0
    }));

    return NextResponse.json(formattedProjects);
  } catch (error) {
    console.error('Erreur lors de la récupération des projets:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la récupération des projets',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
