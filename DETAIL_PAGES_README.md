# Pages de Détail - Documentation

## Vue d'ensemble

Cette fonctionnalité ajoute des pages de détail pour les groupes et les campagnes, permettant aux utilisateurs de consulter toutes les informations détaillées en cliquant sur les éléments dans les tableaux.

## Fonctionnalités ajoutées

### 1. Page de détail des groupes
- **Localisation**: `app/dashboard/groupe/[id]/page.tsx`
- **Déclencheur**: Clic sur le nom du groupe dans le tableau
- **Navigation**: `/dashboard/groupe/{id}`

#### Informations affichées :
- **Informations du groupe**:
  - Nom du groupe
  - Description (si disponible)
  - Nombre de membres
  - Date de création
- **Statistiques**:
  - Total des membres
  - Date de création
- **Liste des contacts**:
  - Grille des contacts avec informations complètes
  - Clic sur un contact → navigation vers sa page de détail
  - Affichage des informations : nom, email, téléphone, adresse, date d'ajout

#### Actions disponibles :
- **Actualiser**: Recharge les données du groupe
- **Modifier**: Bouton préparé pour l'édition future
- **Supprimer**: Supprime le groupe avec confirmation

### 2. Page de détail des campagnes
- **Localisation**: `app/dashboard/campagne/[id]/page.tsx`
- **Déclencheur**: Clic sur le nom de la campagne dans le tableau
- **Navigation**: `/dashboard/campagne/{id}`

#### Informations affichées :
- **Informations de la campagne**:
  - Nom de la campagne
  - Canal (SMS/WhatsApp) avec badge coloré
  - Statut avec badge coloré
  - Date de création
- **Cible et projet**:
  - Projet associé (nom et ID)
  - Groupe cible (nom cliquable et ID)
- **Message**:
  - Contenu du message
  - Statut de livraison
  - Date d'envoi (si envoyé)

#### Actions disponibles :
- **Actualiser**: Recharge les données de la campagne
- **Modifier**: Bouton préparé pour l'édition future
- **Supprimer**: Supprime la campagne avec confirmation

## APIs créées

### GET `/api/groups/[id]`
Récupère les détails d'un groupe spécifique.

**Réponse**:
```json
{
  "group_id": "group_id",
  "name": "Nom du groupe",
  "description": "Description du groupe",
  "members": 5,
  "createdAt": "01/01/2024",
  "contacts": [
    {
      "contact_id": "contact_id",
      "name": "Prénom Nom",
      "email": "email@example.com",
      "phone": "+1234567890",
      "address": "Adresse complète",
      "addedAt": "01/01/2024"
    }
  ]
}
```

### GET `/api/campaigns/[id]`
Récupère les détails d'une campagne spécifique.

**Réponse**:
```json
{
  "id": "campaign_id",
  "name": "Nom de la campagne",
  "channel": "SMS",
  "createdAt": "01/01/2024",
  "status": "Brouillon",
  "project": {
    "project_id": "project_id",
    "sender_name": "Nom du projet"
  },
  "group": {
    "group_id": "group_id",
    "name": "Nom du groupe"
  },
  "message": {
    "message_id": "message_id",
    "content": "Contenu du message",
    "delivered_status": "En attente",
    "sent_at": "2024-01-01T10:00:00.000Z"
  }
}
```

### DELETE `/api/campaigns/[id]`
Supprime une campagne spécifique.

## Structure des fichiers

### Nouveaux fichiers
- `app/dashboard/groupe/[id]/page.tsx`: Page de détail des groupes
- `app/dashboard/campagne/[id]/page.tsx`: Page de détail des campagnes
- `app/api/groups/[id]/route.ts`: API pour récupérer un groupe
- `app/api/campaigns/[id]/route.ts`: API pour récupérer/supprimer une campagne

### Fichiers modifiés
- `app/dashboard/groupe/page.tsx`: Colonne "Nom" rendue cliquable
- `app/dashboard/campagne/page.tsx`: Colonne "Nom" déjà cliquable

## Interface utilisateur

### Design cohérent
- **Layout**: Grid responsive (1 colonne sur mobile, 2 colonnes sur desktop)
- **Cartes**: Informations organisées en cartes avec icônes
- **Navigation**: Bouton retour vers la liste
- **Actions**: Boutons d'action dans le header

### Éléments interactifs
- **Noms cliquables**: Navigation vers les pages de détail
- **Liens croisés**: 
  - Contact → Groupe (depuis la page de détail du contact)
  - Groupe → Contact (depuis la page de détail du groupe)
  - Campagne → Groupe (depuis la page de détail de la campagne)

### Badges et statuts
- **Statuts de campagne**: Couleurs différentes selon le statut
- **Canaux**: Badges colorés pour SMS (orange) et WhatsApp (vert)
- **Statuts de livraison**: Indicateurs visuels pour le suivi

## Utilisation

### Navigation vers les pages de détail
1. **Groupes**:
   - Aller sur `/dashboard/groupe`
   - Cliquer sur le nom d'un groupe dans le tableau

2. **Campagnes**:
   - Aller sur `/dashboard/campagne`
   - Cliquer sur le nom d'une campagne dans le tableau

### Navigation croisée
- Depuis la page de détail d'un groupe → cliquer sur un contact
- Depuis la page de détail d'une campagne → cliquer sur le groupe cible
- Depuis la page de détail d'un contact → voir les groupes associés

## Fonctionnalités techniques

### Gestion des états
- **Loading states**: Squelettes pendant le chargement
- **Error handling**: Gestion des erreurs 404 et 500
- **Confirmation dialogs**: Pour les actions destructives

### Optimisations
- **Lazy loading**: Chargement des données à la demande
- **Caching**: Réutilisation des données déjà chargées
- **Responsive design**: Adaptation à tous les écrans

## Améliorations futures

### Groupes
- [ ] Édition des groupes directement depuis la page de détail
- [ ] Ajout/suppression de contacts depuis la page de détail
- [ ] Statistiques avancées (taux d'engagement, etc.)
- [ ] Export des contacts du groupe

### Campagnes
- [ ] Édition des campagnes directement depuis la page de détail
- [ ] Planification et envoi depuis la page de détail
- [ ] Statistiques de performance (taux d'ouverture, clics, etc.)
- [ ] Historique des modifications
- [ ] Duplication de campagnes

### Général
- [ ] Recherche et filtres dans les pages de détail
- [ ] Actions en lot (suppression multiple, etc.)
- [ ] Notifications en temps réel
- [ ] Historique des actions utilisateur
