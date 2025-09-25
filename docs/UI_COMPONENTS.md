# Composants UI Personnalisés

Ce document décrit les composants UI personnalisés créés pour remplacer les alertes et confirmations natives du navigateur.

## 🎯 Objectif

Remplacer tous les `alert()`, `confirm()` et `prompt()` par des interfaces personnalisées plus élégantes et cohérentes avec le design de l'application.

## 📦 Composants Disponibles

### 1. Toast (Notifications temporaires)

Pour les erreurs et messages d'information temporaires.

```tsx
import { useToast } from "@/hooks/use-toast";

function MyComponent() {
  const { toast } = useToast();

  const handleError = () => {
    toast({
      variant: "destructive",
      title: "Erreur",
      description: "Une erreur s'est produite",
    });
  };

  const handleSuccess = () => {
    toast({
      variant: "success",
      title: "Succès",
      description: "Opération réussie !",
    });
  };
}
```

**Variants disponibles :**
- `default` : Message d'information standard
- `destructive` : Message d'erreur (rouge)
- `success` : Message de succès (vert)
- `warning` : Message d'avertissement (jaune)

### 2. ConfirmationDialog (Dialogue de confirmation)

Pour remplacer `confirm()`.

```tsx
import { useConfirmation } from "@/hooks/use-confirmation";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

function MyComponent() {
  const confirmation = useConfirmation();

  const handleDelete = () => {
    confirmation.confirm(
      {
        title: "Supprimer l'élément",
        description: "Êtes-vous sûr de vouloir supprimer cet élément ?",
        confirmText: "Supprimer",
        cancelText: "Annuler",
        variant: "destructive",
      },
      () => {
        // Action à exécuter si confirmé
        console.log("Suppression confirmée");
      }
    );
  };

  return (
    <div>
      <button onClick={handleDelete}>Supprimer</button>
      
      <ConfirmationDialog
        isOpen={confirmation.isOpen}
        onClose={confirmation.handleCancel}
        onConfirm={confirmation.handleConfirm}
        title={confirmation.options.title}
        description={confirmation.options.description}
        confirmText={confirmation.options.confirmText}
        cancelText={confirmation.options.cancelText}
        variant={confirmation.options.variant}
      />
    </div>
  );
}
```

### 3. NotificationDialog (Dialogue de notification)

Pour remplacer `alert()` avec des messages de succès ou d'information.

```tsx
import { useNotification } from "@/hooks/use-notification";
import { NotificationDialog } from "@/components/ui/notification-dialog";

function MyComponent() {
  const notification = useNotification();

  const handleSuccess = () => {
    notification.show({
      title: "Succès",
      description: "Opération réussie !",
      variant: "success",
    });
  };

  return (
    <div>
      <button onClick={handleSuccess}>Valider</button>
      
      <NotificationDialog
        isOpen={notification.isOpen}
        onClose={notification.hide}
        title={notification.options.title}
        description={notification.options.description}
        variant={notification.options.variant}
        buttonText={notification.options.buttonText}
      />
    </div>
  );
}
```

## 🔧 Configuration

### Toaster dans le Layout

Le composant `Toaster` doit être ajouté au layout principal :

```tsx
// app/layout.tsx
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
```

## 📋 Règles d'Utilisation

### ✅ À utiliser

- **Toast** : Pour les erreurs, messages d'information temporaires
- **ConfirmationDialog** : Pour les confirmations d'actions destructives
- **NotificationDialog** : Pour les messages de succès, avertissements

### ❌ À éviter

- `alert()` - Remplacer par `NotificationDialog`
- `confirm()` - Remplacer par `ConfirmationDialog`
- `prompt()` - Créer un formulaire personnalisé

## 🎨 Personnalisation

### Variants de Couleur

- `default` : Bleu (information)
- `success` : Vert (succès)
- `warning` : Jaune (avertissement)
- `destructive` : Rouge (erreur/suppression)

### Icônes

Chaque variant a une icône associée :
- `default` : Info
- `success` : CheckCircle
- `warning` : AlertTriangle
- `destructive` : XCircle

## 🔄 Migration

Pour migrer du code existant :

1. **Remplacer `alert()`** :
   ```tsx
   // Avant
   alert("Message");
   
   // Après
   notification.show({
     title: "Information",
     description: "Message",
     variant: "default"
   });
   ```

2. **Remplacer `confirm()`** :
   ```tsx
   // Avant
   if (confirm("Êtes-vous sûr ?")) {
     // action
   }
   
   // Après
   confirmation.confirm({
     title: "Confirmation",
     description: "Êtes-vous sûr ?",
     variant: "destructive"
   }, () => {
     // action
   });
   ```

3. **Remplacer les erreurs** :
   ```tsx
   // Avant
   alert("Erreur: " + error.message);
   
   // Après
   toast({
     variant: "destructive",
     title: "Erreur",
     description: error.message
   });
   ```
