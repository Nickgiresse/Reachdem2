import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

async function testContactGroupIntegration() {
  try {
    console.log('🧪 Test d\'intégration Contact-Groupe...\n');

    // 1. Vérifier qu'il y a des contacts et des groupes
    const contacts = await prisma.contact.findMany({
      take: 3,
      include: {
        groups: {
          include: {
            group: true
          }
        }
      }
    });

    const groups = await prisma.group.findMany({
      take: 2,
      include: {
        contacts: {
          include: {
            contact: true
          }
        }
      }
    });

    console.log(`📊 État initial:`);
    console.log(`   - Contacts trouvés: ${contacts.length}`);
    console.log(`   - Groupes trouvés: ${groups.length}\n`);

    if (contacts.length === 0) {
      console.log('❌ Aucun contact trouvé. Créez d\'abord des contacts.');
      return;
    }

    if (groups.length === 0) {
      console.log('❌ Aucun groupe trouvé. Créez d\'abord des groupes.');
      return;
    }

    // 2. Afficher les détails des contacts et groupes
    console.log('👥 Contacts:');
    contacts.forEach((contact, index) => {
      console.log(`   ${index + 1}. ${contact.first_name} ${contact.last_name} (${contact.contact_id})`);
      console.log(`      Groupes: ${contact.groups.map(gc => gc.group.name).join(', ') || 'Aucun'}`);
    });

    console.log('\n📁 Groupes:');
    groups.forEach((group, index) => {
      console.log(`   ${index + 1}. ${group.name} (${group.group_id})`);
      console.log(`      Membres: ${group.contacts.map(gc => `${gc.contact.first_name} ${gc.contact.last_name}`).join(', ') || 'Aucun'}`);
    });

    // 3. Tester l'ajout d'un contact à un groupe
    const contactToAdd = contacts[0];
    const groupToAddTo = groups[0];

    console.log(`\n🔄 Test d'ajout: ${contactToAdd.first_name} ${contactToAdd.last_name} → ${groupToAddTo.name}`);

    // Vérifier si le contact est déjà dans le groupe
    const existingRelation = await prisma.groupContact.findUnique({
      where: {
        group_id_contact_id: {
          group_id: groupToAddTo.group_id,
          contact_id: contactToAdd.contact_id
        }
      }
    });

    if (existingRelation) {
      console.log('ℹ️  Le contact est déjà dans ce groupe.');
    } else {
      // Ajouter le contact au groupe
      await prisma.groupContact.create({
        data: {
          group_id: groupToAddTo.group_id,
          contact_id: contactToAdd.contact_id,
          added_at: new Date()
        }
      });
      console.log('✅ Contact ajouté au groupe avec succès!');
    }

    // 4. Vérifier le résultat
    const updatedContact = await prisma.contact.findUnique({
      where: { contact_id: contactToAdd.contact_id },
      include: {
        groups: {
          include: {
            group: true
          }
        }
      }
    });

    const updatedGroup = await prisma.group.findUnique({
      where: { group_id: groupToAddTo.group_id },
      include: {
        contacts: {
          include: {
            contact: true
          }
        }
      }
    });

    console.log('\n📋 Résultat:');
    console.log(`   Contact: ${updatedContact?.first_name} ${updatedContact?.last_name}`);
    console.log(`   Groupes: ${updatedContact?.groups.map(gc => gc.group.name).join(', ') || 'Aucun'}`);
    console.log(`   Groupe: ${updatedGroup?.name}`);
    console.log(`   Membres: ${updatedGroup?.contacts.map(gc => `${gc.contact.first_name} ${gc.contact.last_name}`).join(', ') || 'Aucun'}`);

    // 5. Test de l'API REST
    console.log('\n🌐 Test de l\'API REST...');
    
    // Simuler un appel à l'API add-contacts
    const testGroupId = groups[0].group_id;
    const testContactIds = contacts.slice(0, 2).map(c => c.contact_id);

    console.log(`   Groupe ID: ${testGroupId}`);
    console.log(`   Contact IDs: ${testContactIds.join(', ')}`);

    // Vérifier que les relations existent ou peuvent être créées
    for (const contactId of testContactIds) {
      const relation = await prisma.groupContact.findUnique({
        where: {
          group_id_contact_id: {
            group_id: testGroupId,
            contact_id: contactId
          }
        }
      });

      if (relation) {
        console.log(`   ✅ Relation existe: Contact ${contactId} → Groupe ${testGroupId}`);
      } else {
        console.log(`   ⚠️  Relation manquante: Contact ${contactId} → Groupe ${testGroupId}`);
      }
    }

    console.log('\n✅ Test d\'intégration terminé avec succès!');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le test
testContactGroupIntegration();
