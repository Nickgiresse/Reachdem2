// app/error/page.tsx

"use client";

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-600">
            Paiement Échoué
          </CardTitle>
          <CardDescription>
            Une erreur s'est produite lors du traitement de votre paiement
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
              onClick={() => window.location.href = '/payment-test'}
              className="w-full"
            >
              Réessayer le Paiement
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/dashboard'}
              className="w-full"
            >
              Retour au Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
