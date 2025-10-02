// lib/notchpay-client.js

import NotchPay from 'notchpay.js';

// Utilise la variable d'environnement publique pour l'initialisation côté client
const NOTCHPAY_PUBLIC_KEY = process.env.NEXT_PUBLIC_NOTCHPAY_PUBLIC_KEY;

if (!NOTCHPAY_PUBLIC_KEY) {
  throw new Error('NEXT_PUBLIC_NOTCHPAY_PUBLIC_KEY is not set');
}

// Initialisation de l'instance client-side
const notchpayClient = NotchPay(NOTCHPAY_PUBLIC_KEY);

export default notchpayClient;