import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function seedData() {
  try {
    // Créer un utilisateur de test
    const user = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        name: 'Utilisateur Test',
        emailVerified: true,
      },
    });

    // Créer un profil utilisateur
    await prisma.userProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        account_type: 'BUSINESS',
        first_name: 'Test',
        last_name: 'User',
        phone: '+1234567890',
        city: 'Paris',
        country: 'France',
        locale: 'FR',
      },
    });

    // Créer des projets de test
    const project1 = await prisma.project.upsert({
      where: { project_id: 'test-project-1' },
      update: {},
      create: {
        project_id: 'test-project-1',
        sender_name: 'Mon Entreprise',
        user_id: user.id,
      },
    });

    const project2 = await prisma.project.upsert({
      where: { project_id: 'test-project-2' },
      update: {},
      create: {
        project_id: 'test-project-2',
        sender_name: 'Ma Startup',
        user_id: user.id,
      },
    });

    // Créer des groupes de test
    const group1 = await prisma.group.upsert({
      where: { group_id: 'test-group-1' },
      update: {},
      create: {
        group_id: 'test-group-1',
        name: 'Clients VIP',
        description: 'Groupe des clients les plus importants',
      },
    });

    const group2 = await prisma.group.upsert({
      where: { group_id: 'test-group-2' },
      update: {},
      create: {
        group_id: 'test-group-2',
        name: 'Prospects',
        description: 'Groupe des prospects potentiels',
      },
    });

    const group3 = await prisma.group.upsert({
      where: { group_id: 'test-group-3' },
      update: {},
      create: {
        group_id: 'test-group-3',
        name: 'Anciens clients',
        description: 'Groupe des anciens clients',
      },
    });

    console.log('Données de test créées avec succès !');
    console.log('Projets:', { project1: project1.sender_name, project2: project2.sender_name });
    console.log('Groupes:', { group1: group1.name, group2: group2.name, group3: group3.name });
  } catch (error) {
    console.error('Erreur lors de la création des données de test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedData();
