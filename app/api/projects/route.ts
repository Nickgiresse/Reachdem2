import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Pour l'instant, on récupère tous les projets
    // Dans une vraie application, vous devriez filtrer par utilisateur connecté
    const projects = await prisma.project.findMany({
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
    const body = await request.json();
    const { sender_name } = body;

    // Validation des données
    if (!sender_name || !sender_name.trim()) {
      return NextResponse.json(
        { error: 'Le nom du projet est obligatoire' },
        { status: 400 }
      );
    }

    // Récupérer le premier utilisateur existant ou créer un utilisateur par défaut
    let defaultUser = await prisma.user.findFirst();
    
    if (!defaultUser) {
      // Créer un utilisateur par défaut
      defaultUser = await prisma.user.create({
        data: {
          email: "default@example.com",
          name: "Utilisateur par défaut",
        }
      });
    }

    // Créer le projet
    const project = await prisma.project.create({
      data: {
        sender_name: sender_name.trim(),
        user_id: defaultUser.id,
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
