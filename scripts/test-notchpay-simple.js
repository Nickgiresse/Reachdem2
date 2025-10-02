// scripts/test-notchpay-simple.js
const NotchPay = require('notchpay.js');

// Utiliser des clés de test temporaires pour le test
const NOTCHPAY_SECRET_KEY = process.env.NOTCHPAY_SECRET_KEY || 'sk_test_1234567890abcdef1234567890abcdef';

console.log('=== Test NotchPay Simple ===');
console.log('Secret Key:', NOTCHPAY_SECRET_KEY ? 'Définie' : 'Non définie');

try {
  const notchpay = NotchPay(NOTCHPAY_SECRET_KEY);
  console.log('✅ NotchPay initialisé');
  
  // Tester initializePayment avec des données minimales
  const testData = {
    amount: 1000,
    currency: 'XAF',
    customer_email: 'test@example.com',
    customer_name: 'Test User',
    reference: 'test_' + Date.now(),
    callback_url: 'http://localhost:3000/callback',
    description: 'Test payment'
  };
  
  console.log('Données de test:', testData);
  
  notchpay.payments.initializePayment(testData)
    .then(payment => {
      console.log('✅ Réponse NotchPay:', payment);
      console.log('Type de réponse:', typeof payment);
      if (payment) {
        console.log('Propriétés de la réponse:', Object.keys(payment));
      }
    })
    .catch(error => {
      console.error('❌ Erreur NotchPay:', error.message);
      console.error('Stack:', error.stack);
    });
    
} catch (error) {
  console.error('❌ Erreur d\'initialisation:', error.message);
}
