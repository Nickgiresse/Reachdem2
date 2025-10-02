# Configuration NotchPay - Guide Rapide

## Problème actuel
NotchPay retourne `null` car les clés API ne sont pas configurées.

## Solution immédiate

### 1. Créer le fichier .env
Créez un fichier `.env` à la racine de votre projet avec :

```env
NOTCHPAY_SECRET_KEY=sk_test_votre_cle_secrete_ici
NEXT_PUBLIC_NOTCHPAY_PUBLIC_KEY=pk_test_votre_cle_publique_ici
```

### 2. Obtenir vos clés NotchPay
1. Allez sur https://notchpay.co
2. Connectez-vous à votre compte
3. Allez dans "Settings" → "API Keys"
4. Copiez vos clés de test (commencent par `pk_test_` et `sk_test_`)

### 3. Tester
1. Redémarrez votre serveur : `npm run dev`
2. Allez sur la page des projets
3. Cliquez sur "Tester NotchPay"

## Si vous n'avez pas de compte NotchPay

### Option 1: Créer un compte
1. Allez sur https://notchpay.co
2. Créez un compte gratuit
3. Obtenez vos clés de test

### Option 2: Utiliser des clés de test temporaires
Pour tester rapidement, vous pouvez utiliser des clés de test génériques :

```env
NOTCHPAY_SECRET_KEY=sk_test_1234567890abcdef1234567890abcdef
NEXT_PUBLIC_NOTCHPAY_PUBLIC_KEY=pk_test_1234567890abcdef1234567890abcdef
```

**Note:** Ces clés ne fonctionneront pas pour de vrais paiements, mais permettront de tester l'interface.

## Vérification
Une fois configuré, vous devriez voir dans les logs :
- `NotchPay Server: Secret key available: true`
- Les méthodes disponibles de NotchPay
- Une réponse de paiement valide (même si elle échoue côté NotchPay)
