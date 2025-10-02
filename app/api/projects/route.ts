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

    // Récupérer seulement les projets de l'utilisateur connecté
    const projects = await prisma.project.findMany({
      where: {
        user_id: currentUser.id
      },
      select: {
        project_id: true,
        sender_name: true,
        created_at: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    // Transformer les données pour correspondre au format attendu par le frontend
    const formattedProjects = projects.map((project) => ({
      project_id: project.project_id,
      sender_name: project.sender_name,
      created_at: project.created_at,
      is_active: false, // Par défaut, les projets ne sont pas actifs
    }));

    return NextResponse.json(formattedProjects);
  } catch (error) {
    console.error('Erreur lors de la récupération des projets:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des projets' },
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
    const { sender_name } = body;

    // Validation des données
    if (!sender_name || !sender_name.trim()) {
      return NextResponse.json(
        { error: 'Le nom du projet est obligatoire' },
        { status: 400 }
      );
    }

    // Créer le projet pour l'utilisateur connecté
    const project = await prisma.project.create({
      data: {
        sender_name: sender_name.trim(),
        user_id: currentUser.id,
      },
    });

    // Retourner le projet créé avec le format attendu
    const formattedProject = {
      project_id: project.project_id,
      sender_name: project.sender_name,
      created_at: project.created_at,
      is_active: false,
    };

    return NextResponse.json(formattedProject, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du projet:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du projet' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
