// app/success/page.tsx

"use client";

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">
            Paiement Réussi !
          </CardTitle>
          <CardDescription>
            Votre paiement a été traité avec succès
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {reference && (
            <div className="p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600">Référence du paiement</p>
              <p className="font-mono text-sm font-medium">{reference}</p>
            </div>
          )}
          
          <div className="space-y-2">
            <Button 
              onClick={() => window.location.href = '/dashboard'}
              className="w-full"
            >
              Retour au Dashboard
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/payment-test'}
              className="w-full"
            >
              Nouveau Paiement
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
