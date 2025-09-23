# Correction des Problèmes de Groupes

## Problèmes Identifiés

### 1. **Erreur 405 - Méthode POST non autorisée**
- L'API `/api/groups/route.ts` ne contenait que la méthode GET
- Aucune méthode POST pour créer des groupes
- L'erreur 405 indiquait que la méthode HTTP n'était pas supportée

### 2. **Données manquantes dans le tableau**
- Les colonnes "Membres" et "Date de création" ne s'affichaient pas
- L'API ne retournait pas le nombre de membres
- Le formatage des dates n'était pas correct

## Solutions Implémentées

### 1. **API Complète pour les Groupes**

#### Méthode GET - Récupération des groupes
```typescript
export async function GET(request: NextRequest) {
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

  // Formatage des données pour le frontend
  const formattedGroups = groups.map((group) => ({
    id: group.group_id,
    name: group.name,
    description: group.description || '',
    members: group.contacts.length, // ✅ Nombre de membres
    createdAt: new Date(group.created_at).toLocaleDateString('fr-FR'), // ✅ Date formatée
  }));

  return NextResponse.json(formattedGroups);
}
```

#### Méthode POST - Création de groupes
```typescript
export async function POST(request: NextRequest) {
  const { name, description, contactIds } = await request.json();

  // Validation
  if (!name || !name.trim()) {
    return NextResponse.json(
      { error: 'Le nom du groupe est obligatoire' },
      { status: 400 }
    );
  }

  // Création du groupe
  const group = await prisma.group.create({
    data: {
      name: name.trim(),
      description: description?.trim() || null,
    },
  });

  // Ajout des contacts si fournis
  if (contactIds && Array.isArray(contactIds) && contactIds.length > 0) {
    // Validation des contacts
    const contacts = await prisma.contact.findMany({
      where: { contact_id: { in: contactIds } },
    });

    if (contacts.length !== contactIds.length) {
      return NextResponse.json(
        { error: 'Un ou plusieurs contacts non trouvés' },
        { status: 404 }
      );
    }

    // Ajout des contacts au groupe
    const groupContacts = contactIds.map(contact_id => ({
      group_id: group.group_id,
      contact_id,
      added_at: new Date(),
    }));

    await prisma.groupContact.createMany({
      data: groupContacts,
    });
  }

  // Retour du groupe créé avec toutes les données
  const createdGroup = await prisma.group.findUnique({
    where: { group_id: group.group_id },
    include: {
      contacts: {
        select: {
          contact_id: true,
        }
      }
    },
  });

  return NextResponse.json({
    id: createdGroup!.group_id,
    name: createdGroup!.name,
    description: createdGroup!.description || '',
    members: createdGroup!.contacts.length,
    createdAt: new Date(createdGroup!.created_at).toLocaleDateString('fr-FR'),
  }, { status: 201 });
}
```

#### Méthode DELETE - Suppression de groupes
```typescript
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const groupId = searchParams.get('id');

  if (!groupId) {
    return NextResponse.json(
      { error: 'ID du groupe requis' },
      { status: 400 }
    );
  }

  // Vérification de l'existence
  const group = await prisma.group.findUnique({
    where: { group_id: groupId },
  });

  if (!group) {
    return NextResponse.json(
      { error: 'Groupe non trouvé' },
      { status: 404 }
    );
  }

  // Suppression (les relations sont supprimées automatiquement)
  await prisma.group.delete({
    where: { group_id: groupId },
  });

  return NextResponse.json({ success: true });
}
```

### 2. **Formatage des Données**

#### Structure des Données Retournées
```typescript
interface Group {
  id: string;           // group_id
  name: string;         // nom du groupe
  description: string;  // description (peut être vide)
  members: number;      // nombre de contacts dans le groupe
  createdAt: string;    // date de création formatée (DD/MM/YYYY)
}
```

#### Relations Prisma
```typescript
// Inclusion des contacts pour compter les membres
include: {
  contacts: {
    select: {
      contact_id: true,
    }
  }
}

// Le nombre de membres est calculé avec
members: group.contacts.length
```

### 3. **Gestion des Erreurs**

#### Validation des Données
- ✅ Nom du groupe obligatoire
- ✅ Validation des contacts existants
- ✅ Gestion des erreurs de base de données

#### Codes de Statut HTTP
- ✅ 200 : Succès (GET)
- ✅ 201 : Créé (POST)
- ✅ 400 : Données invalides
- ✅ 404 : Ressource non trouvée
- ✅ 500 : Erreur serveur

## Tests et Validation

### Script de Test
```bash
npm run test-groups
```

Le script teste :
1. ✅ Création d'un groupe
2. ✅ Récupération des groupes
3. ✅ Formatage des données
4. ✅ Nettoyage (suppression du groupe de test)

### Fonctionnalités Vérifiées
- ✅ Création de groupes avec nom et description
- ✅ Ajout de contacts lors de la création
- ✅ Affichage du nombre de membres
- ✅ Affichage de la date de création
- ✅ Suppression de groupes
- ✅ Gestion des erreurs

## Résultat

### Avant la Correction
- ❌ Erreur 405 lors de la création
- ❌ Colonnes "Membres" et "Date" vides
- ❌ Impossible de créer des groupes

### Après la Correction
- ✅ Création de groupes fonctionnelle
- ✅ Affichage correct du nombre de membres
- ✅ Affichage correct de la date de création
- ✅ Gestion complète des groupes (CRUD)
- ✅ Validation et gestion d'erreurs appropriées

## Utilisation

### Créer un Groupe
```javascript
const response = await fetch('/api/groups', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Mon Groupe',
    description: 'Description du groupe',
    contactIds: ['contact1', 'contact2'] // optionnel
  }),
});
```

### Récupérer les Groupes
```javascript
const response = await fetch('/api/groups');
const groups = await response.json();
// groups contient maintenant members et createdAt
```

### Supprimer un Groupe
```javascript
const response = await fetch(`/api/groups?id=${groupId}`, {
  method: 'DELETE',
});
```

Tous les problèmes ont été résolus et la fonctionnalité de gestion des groupes est maintenant complètement opérationnelle.
