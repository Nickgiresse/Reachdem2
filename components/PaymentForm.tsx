// components/PaymentForm.tsx

"use client";

import React, { useState } from 'react';
import notchpayClient from '../lib/notchpay-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PaymentFormProps {
  onSuccess?: (transaction: any) => void;
  onError?: (error: any) => void;
}

function PaymentForm({ onSuccess, onError }: PaymentFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    amount: '5000',
    email: '',
    name: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Validation des données
      if (!formData.amount || !formData.email || !formData.name) {
        throw new Error('Veuillez remplir tous les champs');
      }

      // 1. Appel à l'API Route Next.js pour créer le paiement
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      // Vérifier si la réponse est du JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Non-JSON response received:', textResponse);
        throw new Error(`Server returned ${response.status}: ${textResponse.substring(0, 100)}...`);
      }
      
      const data = await response.json();
      console.log('PaymentForm: Full response data:', data);
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to create payment');
      }
      
      const payment = data.payment;
      console.log('PaymentForm: Payment object:', payment);
      
      // 2. Rediriger vers la page de paiement Notch Pay
      // NotchPay peut avoir différentes structures de réponse
      let checkoutUrl = null;
      
      if (payment.transaction && payment.transaction.checkout_url) {
        checkoutUrl = payment.transaction.checkout_url;
      } else if (payment.checkout_url) {
        checkoutUrl = payment.checkout_url;
      } else if (payment.url) {
        checkoutUrl = payment.url;
      } else if (payment.authorization_url) {
        checkoutUrl = payment.authorization_url;
      }
      
      console.log('PaymentForm: Checkout URL found:', checkoutUrl);
      
      if (checkoutUrl) {
        // Rediriger vers la page de checkout Notch Pay
        window.location.href = checkoutUrl;
      } else {
        console.error('PaymentForm: No checkout URL found in payment object:', payment);
        throw new Error('No checkout URL received from payment creation');
      }
      
    } catch (error: any) {
      console.error('Global Error:', error);
      setError(error.message);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Payer avec Notch Pay</CardTitle>
        <CardDescription>
          Effectuez un paiement sécurisé en quelques clics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="name">Nom complet</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="john@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Montant (XAF)</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="5000"
              min="100"
              required
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Création du Paiement...' : `Payer ${parseInt(formData.amount).toLocaleString()} XAF`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default PaymentForm;
