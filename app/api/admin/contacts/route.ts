import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const contacts = await prisma.contact.findMany({
      include: {
        groups: {
          include: {
            group: {
              select: {
                name: true,
                group_id: true,
              }
            }
          }
        },
        phonebook: {
          select: {
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
        created_at: "desc",
      },
    });

    // Transformer les données pour correspondre au format attendu par le frontend
    const formattedContacts = contacts.map((contact) => ({
      id: contact.contact_id,
      name: `${contact.first_name} ${contact.last_name}`,
      email: contact.email || "",
      phone: contact.phone,
      address: contact.address || "",
      addedAt: new Date(contact.created_at).toLocaleDateString("fr-FR"),
      groups: contact.groups.map(gc => ({
        group_id: gc.group.group_id,
        name: gc.group.name,
      })),
      user: contact.phonebook.project.user.email
    }));

    return NextResponse.json(formattedContacts);
  } catch (error) {
    console.error('Erreur lors de la récupération des contacts:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la récupération des contacts',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
