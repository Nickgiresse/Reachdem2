// scripts/test-notchpay.js
const NotchPay = require('notchpay.js');

console.log('=== Test de configuration NotchPay ===');

// Vérifier les variables d'environnement
console.log('Variables d\'environnement:');
console.log('NOTCHPAY_SECRET_KEY:', process.env.NOTCHPAY_SECRET_KEY ? 'Définie' : 'Non définie');
console.log('NEXT_PUBLIC_NOTCHPAY_PUBLIC_KEY:', process.env.NEXT_PUBLIC_NOTCHPAY_PUBLIC_KEY ? 'Définie' : 'Non définie');

if (!process.env.NOTCHPAY_SECRET_KEY) {
  console.error('❌ NOTCHPAY_SECRET_KEY n\'est pas définie dans .env');
  process.exit(1);
}

try {
  console.log('\n=== Initialisation de NotchPay ===');
  const notchpay = NotchPay(process.env.NOTCHPAY_SECRET_KEY);
  
  console.log('✅ NotchPay initialisé avec succès');
  console.log('Méthodes disponibles:', Object.keys(notchpay));
  
  if (notchpay.payments) {
    console.log('Méthodes de paiement:', Object.keys(notchpay.payments));
  }
  
  console.log('\n=== Test de création de paiement ===');
  
  // Test avec des données minimales
  const testPayment = {
    amount: 1000,
    currency: 'XAF',
    customer: { 
      email: 'test@example.com', 
      name: 'Test User' 
    },
    reference: `test_${Date.now()}`,
    description: 'Test payment'
  };
  
  console.log('Données de test:', testPayment);
  
  notchpay.payments.initializePayment(testPayment)
    .then(payment => {
      console.log('✅ Paiement créé avec succès:', payment);
      console.log('Structure de la réponse:', JSON.stringify(payment, null, 2));
    })
    .catch(error => {
      console.error('❌ Erreur lors de la création du paiement:', error);
      console.error('Message d\'erreur:', error.message);
      console.error('Code d\'erreur:', error.code);
    });
    
} catch (error) {
  console.error('❌ Erreur lors de l\'initialisation de NotchPay:', error);
  console.error('Message:', error.message);
}
