import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    // Récupérer les détails de l'utilisateur avec ses relations
    const user = await prisma.user.findUnique({
      where: { id: userId },
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
    console.error('Erreur lors de la récupération des détails utilisateur:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la récupération des détails utilisateur',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}