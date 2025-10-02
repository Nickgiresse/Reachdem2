# Configuration NotchPay

## Problème actuel
NotchPay retourne `null` ou `undefined`, ce qui indique un problème de configuration.

## Solution

### 1. Créer le fichier .env
Créez un fichier `.env` à la racine de votre projet avec le contenu suivant :

```env
# Base de données
DATABASE_URL="postgresql://username:password@localhost:5432/reachdem2"

# URL de base pour l'application
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Clés API NotchPay (remplacez par vos vraies clés)
NEXT_PUBLIC_NOTCHPAY_PUBLIC_KEY="pk_test_votre_cle_publique_ici"
NOTCHPAY_SECRET_KEY="sk_test_votre_cle_secrete_ici"
NOTCHPAY_WEBHOOK_SECRET="whsec_votre_webhook_secret_ici"

# Environnement
NODE_ENV="development"
```

### 2. Obtenir vos clés NotchPay

1. **Connectez-vous à NotchPay** : https://notchpay.co
2. **Allez dans "Settings" → "API Keys"**
3. **Copiez vos clés** :
   - **Public Key** : Commence par `pk_test_` ou `pk_live_`
   - **Secret Key** : Commence par `sk_test_` ou `sk_live_`
   - **Webhook Secret** : Commence par `whsec_`

### 3. Tester la configuration

Exécutez le script de test :
```bash
node scripts/test-notchpay.js
```

### 4. Redémarrer le serveur

Après avoir configuré les clés :
```bash
npm run dev
```

### 5. Tester dans l'interface

1. Allez sur la page des projets
2. Cliquez sur "Tester NotchPay"
3. Vérifiez les logs dans la console

## Erreurs courantes

### "Payment provider returned invalid response"
- **Cause** : Clés API invalides ou non configurées
- **Solution** : Vérifiez vos clés dans le fichier `.env`

### "NOTCHPAY_SECRET_KEY is not set"
- **Cause** : Variable d'environnement manquante
- **Solution** : Créez le fichier `.env` avec les bonnes clés

### "Network error"
- **Cause** : Problème de connexion internet
- **Solution** : Vérifiez votre connexion

## Format des clés

- **Clé publique** : `pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- **Clé secrète** : `sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- **Webhook secret** : `whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## Support

Si le problème persiste :
1. Vérifiez les logs dans la console
2. Testez avec le script `test-notchpay.js`
3. Contactez le support NotchPay
