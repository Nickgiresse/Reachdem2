// app/payment-test/page.tsx

"use client";

import React from 'react';
import PaymentForm from '@/components/PaymentForm';

export default function PaymentTestPage() {
  const handleSuccess = (transaction: any) => {
    console.log('Payment successful:', transaction);
    // Vous pouvez ajouter ici une logique personnalisée
  };

  const handleError = (error: any) => {
    console.error('Payment error:', error);
    // Vous pouvez ajouter ici une logique de gestion d'erreur
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Test de Paiement
          </h1>
          <p className="text-gray-600">
            Testez l'intégration Notch Pay
          </p>
        </div>
        
        <PaymentForm 
          onSuccess={handleSuccess}
          onError={handleError}
        />
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Ceci est une page de test pour l'intégration Notch Pay</p>
          <p>Assurez-vous d'avoir configuré vos clés API dans .env.local</p>
        </div>
      </div>
    </div>
  );
}
