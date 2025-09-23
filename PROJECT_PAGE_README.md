# Page Projet - Gestion Complète

## Vue d'Ensemble

La page projet offre une interface complète pour gérer les projets de marketing avec un design moderne en grille et des fonctionnalités d'activation via QR code WhatsApp.

## Structure de la Page

### 1. **Header avec Actions**
```
┌─────────────────────────────────────────────────────────┐
│ 📁 Projets                    [Actualiser] [Créer projet] │
│ Gérez vos projets de marketing et campagnes              │
└─────────────────────────────────────────────────────────┘
```

### 2. **Grid de Cartes de Projets**
```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ Nom Projet  │ │ Nom Projet  │ │ Nom Projet  │
│ [En attente]│ │ [Actif]     │ │ [En attente]│
│ 💬 0 crédits│ │ 💬 100 créd.│ │ 💬 0 crédits│
│ ID: abc123  │ │ ID: def456  │ │ ID: ghi789  │
│ Créé le...  │ │ Créé le...  │ │ Créé le...  │
│ [Voir] [Act]│ │ [Voir] [Act]│ │ [Voir] [Act]│
└─────────────┘ └─────────────┘ └─────────────┘
```

## Fonctionnalités Implémentées

### 1. **Création de Projets**
- ✅ **Bouton "Créer projet"** : Ouvre un dialog avec formulaire
- ✅ **Formulaire simple** : Un seul champ pour le nom du projet
- ✅ **Validation** : Nom obligatoire avec trim automatique
- ✅ **Sauvegarde** : Création en base de données via API
- ✅ **Feedback** : Notification de succès et mise à jour de l'interface

### 2. **Affichage des Projets en Grid**
- ✅ **Cartes responsives** : Grid adaptatif (1/2/3 colonnes selon l'écran)
- ✅ **Informations complètes** :
  - Nom du projet
  - Statut (Actif/En attente) avec badge coloré
  - Nombre de crédits SMS avec icône
  - ID du projet (format monospace)
  - Date de création formatée
- ✅ **Actions** : Boutons "Voir détail" et "Activer"

### 3. **Système d'Activation**
- ✅ **Bouton "Activer"** : Ouvre l'interface d'activation
- ✅ **QR Code WhatsApp** : Génération automatique du QR code
- ✅ **Message personnalisé** : Contient le nom et l'ID du projet
- ✅ **Fonctionnalités** :
  - Copie du message dans le presse-papiers
  - Téléchargement du QR code en PNG
  - Interface claire et intuitive

### 4. **États de Chargement**
- ✅ **Skeleton loading** : Cartes de chargement pendant le fetch
- ✅ **État vide** : Message et icône quand aucun projet
- ✅ **Gestion d'erreurs** : Messages d'erreur appropriés

## Interface d'Activation

### Dialog d'Activation
```
┌─────────────────────────────────────┐
│ 🔲 Activation du projet             │
│ Scannez le QR code ou copiez le     │
│ message pour contacter l'admin      │
│                                     │
│     ┌─────────────┐                 │
│     │             │                 │
│     │   QR CODE   │                 │
│     │             │                 │
│     └─────────────┘                 │
│                                     │
│ Message à envoyer :                 │
│ ┌─────────────────────────────────┐ │
│ │ Bonjour, je souhaite activer    │ │
│ │ mon projet "Mon Projet"         │ │
│ │ (ID: abc123).                   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [Copier] [Télécharger]              │
└─────────────────────────────────────┘
```

### Fonctionnalités du QR Code
- **URL WhatsApp** : `https://wa.me/1234567890?text=...`
- **Message automatique** : Nom et ID du projet inclus
- **Génération** : Via API QR Server (gratuite)
- **Taille** : 200x200 pixels pour une bonne lisibilité

## API Backend

### Endpoints Disponibles

#### GET `/api/projects`
```typescript
// Récupère tous les projets
Response: {
  project_id: string;
  sender_name: string;
  sms_credit: number;
  created_at: string;
  is_active: boolean;
}[]
```

#### POST `/api/projects`
```typescript
// Crée un nouveau projet
Request: {
  sender_name: string;
}

Response: {
  project_id: string;
  sender_name: string;
  sms_credit: number;
  created_at: string;
  is_active: boolean;
}
```

### Gestion des Utilisateurs
- **Utilisateur par défaut** : Création automatique si aucun utilisateur
- **Association** : Chaque projet lié à un utilisateur
- **Crédits** : Initialisés à 0 par défaut

## Structure des Données

### Interface Project
```typescript
interface Project {
  project_id: string;    // ID unique du projet
  sender_name: string;   // Nom du projet
  sms_credit: number;    // Nombre de crédits SMS
  created_at: string;    // Date de création
  is_active?: boolean;   // Statut d'activation
}
```

### Base de Données
```sql
-- Table projects
project_id: string (PK)
sender_name: string
sms_credit: integer (default: 0)
user_id: string (FK)
created_at: datetime
updated_at: datetime
```

## Design et UX

### Couleurs et Styles
- **Couleur principale** : `#FB953C` (orange)
- **Statuts** :
  - Actif : Vert (`bg-green-100 text-green-800`)
  - En attente : Jaune (`bg-yellow-100 text-yellow-800`)
- **Cartes** : Ombres subtiles avec hover effects
- **Responsive** : Grid adaptatif selon la taille d'écran

### Animations
- **Skeleton loading** : Animation pulse pendant le chargement
- **Hover effects** : Ombres sur les cartes
- **Transitions** : Fluides pour les interactions

## Fonctionnalités Futures

### À Implémenter
1. **Vue détail** : Page dédiée pour chaque projet
2. **Gestion des crédits** : Achat et gestion des crédits SMS
3. **Statistiques** : Métriques d'utilisation par projet
4. **Paramètres** : Configuration avancée des projets
5. **Notifications** : Alertes pour l'activation des projets

### Améliorations Possibles
1. **Recherche** : Filtrage des projets par nom
2. **Tri** : Par date, nom, statut, crédits
3. **Pagination** : Pour de nombreux projets
4. **Export** : Export des données de projets
5. **Import** : Import de projets existants

## Utilisation

### Créer un Projet
1. Cliquer sur "Créer projet"
2. Entrer le nom du projet
3. Cliquer sur "Créer projet"
4. Le projet apparaît dans la grille

### Activer un Projet
1. Cliquer sur "Activer" sur une carte de projet
2. Scanner le QR code avec WhatsApp
3. Ou copier le message et l'envoyer manuellement
4. Télécharger le QR code si nécessaire

### Voir les Détails
1. Cliquer sur "Voir détail" (fonctionnalité à venir)
2. Accéder aux informations complètes du projet

## Résultat

La page projet offre maintenant :
- ✅ **Interface moderne** : Design en grille avec cartes élégantes
- ✅ **Fonctionnalité complète** : Création, affichage, activation
- ✅ **UX optimisée** : Chargement, états vides, feedback
- ✅ **Intégration WhatsApp** : QR code pour activation rapide
- ✅ **Responsive** : Adapté à tous les écrans
- ✅ **Professionnel** : Design cohérent avec le reste de l'application

L'interface est maintenant prête pour la gestion complète des projets de marketing avec un processus d'activation simplifié via WhatsApp.
