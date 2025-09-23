import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function testGroups() {
  try {
    console.log('🧪 Test des groupes...\n');

    // 1. Créer un groupe de test
    console.log('1. Création d\'un groupe de test...');
    const testGroup = await prisma.group.create({
      data: {
        name: 'Groupe Test',
        description: 'Groupe créé pour les tests',
      },
    });
    console.log('✅ Groupe créé:', testGroup);

    // 2. Récupérer tous les groupes
    console.log('\n2. Récupération de tous les groupes...');
    const groups = await prisma.group.findMany({
      include: {
        contacts: {
          select: {
            contact_id: true,
          }
        }
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    console.log('✅ Groupes trouvés:', groups.length);
    groups.forEach(group => {
      console.log(`   - ${group.name}: ${group.contacts.length} membres`);
    });

    // 3. Vérifier la structure des données
    console.log('\n3. Vérification de la structure des données...');
    const formattedGroups = groups.map((group) => ({
      id: group.group_id,
      name: group.name,
      description: group.description || '',
      members: group.contacts.length,
      createdAt: new Date(group.created_at).toLocaleDateString('fr-FR'),
    }));

    console.log('✅ Données formatées:');
    formattedGroups.forEach(group => {
      console.log(`   - ${group.name}: ${group.members} membres, créé le ${group.createdAt}`);
    });

    // 4. Nettoyer - supprimer le groupe de test
    console.log('\n4. Nettoyage...');
    await prisma.group.delete({
      where: { group_id: testGroup.group_id },
    });
    console.log('✅ Groupe de test supprimé');

    console.log('\n🎉 Tous les tests sont passés avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testGroups();
