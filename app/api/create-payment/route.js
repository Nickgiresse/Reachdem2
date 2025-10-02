// app/api/create-payment/route.js

import { NextResponse } from 'next/server';
const notchpayServer = require('../../../lib/notchpay-server');

export async function POST(request) {
  try {
    console.log('API Route: Starting payment creation...');
    
    // Vérifier les clés API
    if (!process.env.NOTCHPAY_SECRET_KEY) {
      console.error('API Route: NOTCHPAY_SECRET_KEY is not set');
      return NextResponse.json(
        { 
          success: false, 
          error: 'NotchPay API key not configured. Please check your .env file.',
          details: 'NOTCHPAY_SECRET_KEY environment variable is missing'
        },
        { status: 500 }
      );
    }
    
    const { amount, email, name } = await request.json();
    console.log('API Route: Received data:', { amount, email, name });
    
    // Validation des données
    if (!amount || !email || !name) {
      console.log('API Route: Missing required fields');
      return NextResponse.json(
        { success: false, error: 'Missing required fields: amount, email, name' },
        { status: 400 }
      );
    }

    // Vérifier que notchpayServer est bien chargé
    if (!notchpayServer || !notchpayServer.payments) {
      console.error('API Route: NotchPay server not properly initialized');
      return NextResponse.json(
        { success: false, error: 'Payment service not available' },
        { status: 500 }
      );
    }

    // Assurez-vous d'avoir l'URL de base correcte pour le callback
    const origin = request.headers.get('origin') || 'http://localhost:3000';
    const callbackUrl = `${origin}/api/payment-callback`;
    console.log('API Route: Callback URL:', callbackUrl);

    console.log('API Route: Calling initializePayment...');
    console.log('API Route: NotchPay server object:', notchpayServer);
    console.log('API Route: NotchPay payments object:', notchpayServer.payments);
    console.log('API Route: Available methods:', Object.keys(notchpayServer.payments || {}));
    
    // Vérifier les méthodes disponibles
    console.log('API Route: Available payment methods:', Object.keys(notchpayServer.payments));
    
    // Utiliser la méthode 'create' selon la documentation officielle
    let paymentMethod = null;
    if (notchpayServer.payments.create) {
      paymentMethod = 'create';
    } else if (notchpayServer.payments.initializePayment) {
      paymentMethod = 'initializePayment';
    } else if (notchpayServer.payments.initialize) {
      paymentMethod = 'initialize';
    } else if (notchpayServer.payments.init) {
      paymentMethod = 'init';
    }
    
    if (!paymentMethod) {
      console.error('API Route: No suitable payment method found');
      console.error('API Route: Available methods:', Object.keys(notchpayServer.payments));
      return NextResponse.json(
        { 
          success: false, 
          error: 'No suitable payment method found',
          details: `Available methods: ${Object.keys(notchpayServer.payments).join(', ')}`
        },
        { status: 500 }
      );
    }
    
    console.log('API Route: Using payment method:', paymentMethod);
    
    let payment;
    try {
      // Essayer différentes structures de données selon la méthode
      let paymentData;
      if (paymentMethod === 'create') {
        paymentData = {
          amount: parseInt(amount, 10),
          currency: 'XAF',
          customer: { email, name },
          reference: `order_${Date.now()}`,
          callback: callbackUrl,
          description: 'Payment from Next.js app',
        };
      } else {
        // Pour initializePayment, essayer une structure différente
        paymentData = {
          amount: parseInt(amount, 10),
          currency: 'XAF',
          customer_email: email,
          customer_name: name,
          reference: `order_${Date.now()}`,
          callback_url: callbackUrl,
          description: 'Payment from Next.js app',
        };
      }
      
      console.log('API Route: Payment data being sent:', paymentData);
      
      // Utiliser la méthode détectée
      console.log('API Route: Calling method:', paymentMethod);
      payment = await notchpayServer.payments[paymentMethod](paymentData);

      console.log('API Route: Raw payment response:', payment);
      console.log('API Route: Payment type:', typeof payment);
      console.log('API Route: Payment is null?', payment === null);
      console.log('API Route: Payment is undefined?', payment === undefined);
      
      // Si la réponse est undefined, essayer de capturer l'erreur
      if (payment === undefined) {
        console.error('API Route: Payment response is undefined - this might be an API error');
        console.error('API Route: Check if NotchPay API is returning an error silently');
      }

      // Vérifier que la réponse de NotchPay est valide
      if (!payment) {
        console.error('API Route: NotchPay returned null/undefined payment');
        return NextResponse.json(
          { success: false, error: 'Payment provider returned invalid response - payment is null/undefined' },
          { status: 500 }
        );
      }
    } catch (notchpayError) {
      console.error('API Route: NotchPay API error:', notchpayError);
      console.error('API Route: NotchPay error message:', notchpayError.message);
      console.error('API Route: NotchPay error stack:', notchpayError.stack);
      
      return NextResponse.json(
        { 
          success: false, 
          error: `NotchPay API error: ${notchpayError.message}`,
          details: process.env.NODE_ENV === 'development' ? notchpayError.stack : undefined
        },
        { status: 500 }
      );
    }

    console.log('API Route: Payment created successfully:', payment);
    console.log('API Route: Payment structure:', JSON.stringify(payment, null, 2));
    
    // Gestion robuste des propriétés NotchPay
    const paymentId = payment.id || payment.transaction_id || payment.payment_id || payment.transaction?.id;
    const checkoutUrl = payment.checkout_url || payment.url || payment.authorization_url || payment.transaction?.checkout_url;
    const reference = payment.reference || payment.transaction?.reference || `order_${Date.now()}`;
    
    console.log('API Route: Extracted values:', { paymentId, checkoutUrl, reference });
    
    if (!checkoutUrl) {
      console.error('API Route: No checkout URL found in payment response');
      return NextResponse.json(
        { success: false, error: 'No checkout URL received from payment provider' },
        { status: 500 }
      );
    }
    
    // NotchPay retourne directement l'objet payment avec checkout_url
    return NextResponse.json({ 
      success: true, 
      payment: {
        transaction: {
          id: paymentId,
          checkout_url: checkoutUrl,
          reference: reference
        },
        ...payment
      }
    });
  } catch (error) {
    console.error('API Route: Error creating payment:', error);
    console.error('API Route: Error stack:', error.stack);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
