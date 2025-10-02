// app/api/webhooks/notchpay/route.js

import { NextResponse } from 'next/server';
import notchpayServer from '../../../../lib/notchpay-server';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Vérifier la signature du webhook (recommandé pour la sécurité)
    const signature = request.headers.get('x-notchpay-signature');
    
    // Traiter les différents types d'événements
    switch (body.event) {
      case 'payment.completed':
        console.log('Payment completed:', body.data);
        // Traiter le paiement réussi
        // Ex: mettre à jour la base de données, envoyer un email de confirmation, etc.
        break;
        
      case 'payment.failed':
        console.log('Payment failed:', body.data);
        // Traiter le paiement échoué
        // Ex: notifier l'utilisateur, libérer des ressources, etc.
        break;
        
      case 'payment.cancelled':
        console.log('Payment cancelled:', body.data);
        // Traiter l'annulation du paiement
        break;
        
      default:
        console.log('Unknown webhook event:', body.event);
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
