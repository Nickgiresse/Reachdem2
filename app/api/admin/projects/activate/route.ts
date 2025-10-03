import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Récupérer tous les projets en attente
    const pendingProjects = await prisma.project.findMany({
      where: {
        status: 'PENDING'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            UserProfile: {
              select: {
                first_name: true,
                last_name: true,
              }
            }
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
        created_at: 'asc'
      }
    });

    // Transformer les données
    const formattedProjects = pendingProjects.map((project) => ({
      project_id: project.project_id,
      sender_name: project.sender_name,
      created_at: project.created_at.toISOString(),
      user: {
        id: project.user.id,
        name: project.user.UserProfile?.first_name && project.user.UserProfile?.last_name 
          ? `${project.user.UserProfile.first_name} ${project.user.UserProfile.last_name}`
          : project.user.name || 'Utilisateur sans nom',
        email: project.user.email,
      },
      stats: {
        campaigns: project._count.campaigns,
        phonebooks: project._count.phonebooks,
      }
    }));

    return NextResponse.json(formattedProjects);
  } catch (error) {
    console.error('Erreur lors de la récupération des projets en attente:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la récupération des projets en attente',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, action } = body; // action: 'approve' ou 'reject'

    if (!projectId || !action) {
      return NextResponse.json(
        { error: 'ID du projet et action requis' },
        { status: 400 }
      );
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Action invalide. Utilisez "approve" ou "reject"' },
        { status: 400 }
      );
    }

    // Vérifier que le projet existe et est en attente
    const project = await prisma.project.findUnique({
      where: { project_id: projectId },
      include: {
        user: {
          select: {
            email: true,
            name: true
          }
        }
      }
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Projet non trouvé' },
        { status: 404 }
      );
    }

    if (project.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Ce projet n\'est pas en attente d\'approbation' },
        { status: 400 }
      );
    }

    // Mettre à jour le statut du projet
    const newStatus = action === 'approve' ? 'ACTIVE' : 'REJECTED';
    
    await prisma.project.update({
      where: { project_id: projectId },
      data: { 
        status: newStatus,
        updated_at: new Date()
      }
    });

    return NextResponse.json({ 
      success: true,
      message: `Projet ${action === 'approve' ? 'approuvé' : 'rejeté'} avec succès`,
      project: {
        id: project.project_id,
        name: project.sender_name,
        status: newStatus,
        user: project.user.email
      }
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du projet:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la mise à jour du projet',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
