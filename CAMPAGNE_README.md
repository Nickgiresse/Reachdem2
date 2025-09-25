# Système de Gestion des Campagnes

## Fonctionnalités Implémentées

### 1. Interface de Création de Campagne
- **Bouton "Nouvelle campagne"** avec effet d'apparition
- **Sélection du canal** : SMS (actif, couleur orange) et WhatsApp (grisé, non disponible)
- **Formulaire de création** avec :
  - Nom de la campagne
  - Sélection du projet (depuis la base de données)
  - Bouton retour pour revenir à la sélection du canal
- **Formulaire de message** avec :
  - Zone de texte pour le message
  - **Sélection multiple de groupes** (checkboxes avec descriptions)
  - Compteur de groupes sélectionnés
  - Bouton retour pour revenir au formulaire précédent
  - Bouton "Créer campagne" final

### 2. API Routes Créées
- `GET /api/projects` - Récupère tous les projets
- `GET /api/groups` - Récupère tous les groupes
- `GET /api/campaigns` - Récupère toutes les campagnes
- `POST /api/campaigns` - Crée une ou plusieurs campagnes (une par groupe sélectionné)

### 3. Base de Données
- **Table `campaigns`** : Stocke les campagnes créées (une par groupe sélectionné)
- **Table `messages`** : Stocke les messages des campagnes
- **Table `campaign_messages`** : Lie les campagnes aux messages
- **Relations** avec les tables `projects` et `groups`
- **Gestion multiple** : Si plusieurs groupes sont sélectionnés, une campagne est créée pour chaque groupe

### 4. Interface d'Affichage
- **Tableau des campagnes** avec colonnes :
  - Nom de la campagne
  - Canal (SMS/WhatsApp)
  - Message (tronqué avec tooltip)
  - Date de création
  - Statut (avec couleurs)
- **États de chargement** et messages d'état vide
- **Recherche** dans les campagnes

## Installation et Utilisation

### 1. Installer les dépendances
```bash
npm install
```

### 2. Configurer la base de données
Assurez-vous que votre base de données PostgreSQL est configurée et que les migrations Prisma sont appliquées :
```bash
npx prisma migrate dev
npx prisma generate
```

### 3. Ajouter des données de test (optionnel)
```bash
npm run seed
```

### 4. Démarrer l'application
```bash
npm run dev
```

## Structure des Données

### Campagne
```typescript
interface Campaign {
  id: string;
  name: string;
  channel: "SMS" | "Whatsapp";
  createdAt: string;
  status: "Brouillon" | "Programmée" | "Envoyée";
  project?: string;
  group?: string;
  message?: string;
}
```

### Projet
```typescript
interface Project {
  project_id: string;
  sender_name: string;
  sms_credit: number;
  created_at: string;
}
```

### Groupe
```typescript
interface Group {
  group_id: string;
  name: string;
  description?: string;
  created_at: string;
}
```

## Flux de Création d'une Campagne

1. **Clic sur "Nouvelle campagne"** → Ouvre le dialog
2. **Sélection du canal** → SMS (actif, orange) ou WhatsApp (grisé)
3. **Formulaire de base** → Nom + Projet + Bouton "Créer campagne"
4. **Formulaire de message** → Message + Sélection multiple de groupes + Bouton "Créer campagne"
5. **Sauvegarde** → Création d'une campagne par groupe sélectionné + Rechargement de la page
6. **Affichage** → Les nouvelles campagnes apparaissent dans le tableau

## Personnalisation

### Couleurs et Styles
- Couleur principale : `#FB953C` (orange)
- **SMS** : Couleur orange (`bg-orange-50`, `text-orange-700`)
- **WhatsApp** : Grisé (non disponible)
- Couleurs de statut :
  - Brouillon : Jaune
  - Programmée : Bleu
  - Envoyée : Vert

### Animations
- Utilise Framer Motion pour les transitions
- Effets de flou et de translation
- Transitions fluides entre les étapes

## Prochaines Étapes

1. **Authentification** : Filtrer les données par utilisateur connecté
2. **WhatsApp** : Activer l'option WhatsApp quand disponible
3. **Planification** : Ajouter la fonctionnalité de programmation
4. **Statistiques** : Ajouter des métriques de campagne
5. **Templates** : Créer des modèles de messages prédéfinis
