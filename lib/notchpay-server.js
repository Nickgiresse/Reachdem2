// lib/notchpay-server.js

const NotchPay = require('notchpay.js');

// Utilise la variable d'environnement secrète pour l'initialisation côté serveur
const NOTCHPAY_SECRET_KEY = process.env.NOTCHPAY_SECRET_KEY;

console.log('NotchPay Server: Initializing...');
console.log('NotchPay Server: Secret key available:', !!NOTCHPAY_SECRET_KEY);

if (!NOTCHPAY_SECRET_KEY) {
  console.error('NotchPay Server: NOTCHPAY_SECRET_KEY is not set');
  throw new Error('NOTCHPAY_SECRET_KEY is not set');
}

let notchpayServer;

try {
  // Initialisation de l'instance server-side pour les opérations API
  notchpayServer = NotchPay(NOTCHPAY_SECRET_KEY);
  console.log('NotchPay Server: Successfully initialized');
  console.log('NotchPay Server: Available methods:', Object.keys(notchpayServer));
  console.log('NotchPay Server: Payments methods:', Object.keys(notchpayServer.payments));
} catch (error) {
  console.error('NotchPay Server: Initialization failed:', error);
  throw error;
}

// Si vous utilisez les transferts ou d'autres endpoints nécessitant la grantKey, adaptez ici.
// const notchpayServerWithGrant = NotchPay(NOTCHPAY_SECRET_KEY, {
//   grantKey: process.env.NOTCHPAY_GRANT_KEY
// });

module.exports = notchpayServer;
