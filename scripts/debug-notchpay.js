// scripts/debug-notchpay.js
const NotchPay = require('notchpay.js');

console.log('=== Debug NotchPay ===');

// Vérifier les variables d'environnement
console.log('NOTCHPAY_SECRET_KEY:', process.env.NOTCHPAY_SECRET_KEY ? 'Définie' : 'Non définie');
console.log('NEXT_PUBLIC_NOTCHPAY_PUBLIC_KEY:', process.env.NEXT_PUBLIC_NOTCHPAY_PUBLIC_KEY ? 'Définie' : 'Non définie');

if (!process.env.NOTCHPAY_SECRET_KEY) {
  console.error('❌ NOTCHPAY_SECRET_KEY n\'est pas définie');
  process.exit(1);
}

try {
  console.log('\n=== Initialisation de NotchPay ===');
  const notchpay = NotchPay(process.env.NOTCHPAY_SECRET_KEY);
  
  console.log('✅ NotchPay initialisé');
  console.log('Type de notchpay:', typeof notchpay);
  console.log('Propriétés principales:', Object.keys(notchpay));
  
  if (notchpay.payments) {
    console.log('\n=== Objet payments ===');
    console.log('Type de payments:', typeof notchpay.payments);
    console.log('Méthodes de payments:', Object.keys(notchpay.payments));
    
    // Tester chaque méthode
    Object.keys(notchpay.payments).forEach(method => {
      console.log(`- ${method}:`, typeof notchpay.payments[method]);
    });
  } else {
    console.log('❌ Pas d\'objet payments trouvé');
  }
  
  // Tester la structure complète
  console.log('\n=== Structure complète ===');
  console.log(JSON.stringify(notchpay, null, 2));
  
} catch (error) {
  console.error('❌ Erreur:', error.message);
  console.error('Stack:', error.stack);
}
