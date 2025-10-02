# Intégration Notch Pay - Guide d'utilisation

## 📋 Prérequis

1. **Compte Notch Pay** : Créez un compte sur [Notch Pay](https://notchpay.co)
2. **Clés API** : Récupérez vos clés publique et secrète depuis votre dashboard Notch Pay
3. **Package Notch Pay** : Installez le package JavaScript

```bash
npm install notchpay-js
```

## 🔧 Configuration

### 1. Variables d'environnement

Créez un fichier `.env.local` à la racine de votre projet :

```env
# Clé Publique (utilisée côté client pour l'ouverture du checkout)
NEXT_PUBLIC_NOTCHPAY_PUBLIC_KEY=pk_test_votre_cle_publique

# Clé Secrète (utilisée côté serveur pour la création de paiement, etc.)
NOTCHPAY_SECRET_KEY=sk_test_votre_cle_secrete

# Clé Grant (optionnelle, pour les transferts)
NOTCHPAY_GRANT_KEY=votre_grant_key
```

### 2. Structure des fichiers créés

```
├── lib/
│   ├── notchpay-client.js     # Initialisation côté client
│   └── notchpay-server.js     # Initialisation côté serveur
├── app/api/
│   ├── create-payment/        # Création de paiement
│   ├── payment-callback/      # Callback après paiement
│   └── webhooks/notchpay/     # Webhooks Notch Pay
├── components/
│   └── PaymentForm.tsx        # Composant de paiement
├── app/
│   ├── payment-test/          # Page de test
│   ├── success/               # Page de succès
│   └── error/                 # Page d'erreur
└── .env.local                 # Variables d'environnement
```

## 🚀 Utilisation

### 1. Test de l'intégration

Visitez `/payment-test` pour tester l'intégration complète.

### 2. Utilisation du composant PaymentForm

```tsx
import PaymentForm from '@/components/PaymentForm';

function MyPage() {
  const handleSuccess = (transaction) => {
    console.log('Paiement réussi:', transaction);
  };

  const handleError = (error) => {
    console.error('Erreur de paiement:', error);
  };

  return (
    <PaymentForm 
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
}
```

### 3. API Routes disponibles

- **POST** `/api/create-payment` : Crée un nouveau paiement
- **GET** `/api/payment-callback` : Gère les redirections après paiement
- **POST** `/api/webhooks/notchpay` : Reçoit les webhooks de Notch Pay

## 🔒 Sécurité

- ✅ Clés secrètes stockées côté serveur uniquement
- ✅ Validation des données côté serveur
- ✅ Gestion des erreurs appropriée
- ✅ Webhooks sécurisés (à configurer dans votre dashboard Notch Pay)

## 📱 Fonctionnalités

- ✅ Création de paiement sécurisée
- ✅ Interface de paiement Notch Pay
- ✅ Gestion des callbacks
- ✅ Webhooks pour les événements
- ✅ Pages de succès/erreur
- ✅ Interface utilisateur moderne avec Tailwind CSS

## 🛠️ Personnalisation

### Modifier les montants par défaut

Dans `components/PaymentForm.tsx`, modifiez la valeur par défaut :

```tsx
const [formData, setFormData] = useState({
  amount: '10000', // Nouveau montant par défaut
  email: '',
  name: ''
});
```

### Ajouter des champs personnalisés

Ajoutez de nouveaux champs dans le formulaire et mettez à jour l'API route correspondante.

### Personnaliser les pages de succès/erreur

Modifiez les fichiers dans `app/success/` et `app/error/` selon vos besoins.

## 🐛 Dépannage

### Erreur "NEXT_PUBLIC_NOTCHPAY_PUBLIC_KEY is not set"

Vérifiez que votre fichier `.env.local` contient bien la clé publique avec le préfixe `NEXT_PUBLIC_`.

### Erreur "NOTCHPAY_SECRET_KEY is not set"

Vérifiez que votre fichier `.env.local` contient bien la clé secrète.

### Le checkout ne s'ouvre pas

1. Vérifiez la console du navigateur pour les erreurs
2. Assurez-vous que la clé publique est correcte
3. Vérifiez que le paiement a été créé avec succès

## 📞 Support

Pour toute question sur l'intégration Notch Pay, consultez la [documentation officielle](https://docs.notchpay.co).
