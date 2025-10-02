// app/api/payment-callback/route.js

import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');
    const status = searchParams.get('status');
    
    // Vérifier le statut du paiement
    if (status === 'completed') {
      // Rediriger vers la page de succès
      return NextResponse.redirect(new URL(`/success?reference=${reference}`, request.url));
    } else if (status === 'failed') {
      // Rediriger vers la page d'erreur
      return NextResponse.redirect(new URL(`/error?reference=${reference}`, request.url));
    } else {
      // Statut inconnu, rediriger vers une page neutre
      return NextResponse.redirect(new URL(`/payment-status?reference=${reference}&status=${status}`, request.url));
    }
  } catch (error) {
    console.error('Error in payment callback:', error);
    return NextResponse.redirect(new URL('/error', request.url));
  }
}
