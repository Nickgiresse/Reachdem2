import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message, phone } = body;

    // Validation des données
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { message: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      );
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Adresse email invalide' },
        { status: 400 }
      );
    }

    // Ici vous pouvez ajouter votre logique d'envoi d'email
    // Par exemple avec Nodemailer, SendGrid, Resend, etc.
    
    // Simulation d'envoi d'email
    console.log('Nouveau message de contact reçu:');
    console.log('Nom:', name);
    console.log('Email:', email);
    console.log('Téléphone:', phone || 'Non fourni');
    console.log('Sujet:', subject);
    console.log('Message:', message);

    // Vous pouvez remplacer cette simulation par un vrai service d'email
    // await sendEmail({
    //   to: 'contact@reachdem.co',
    //   from: email,
    //   subject: `Contact: ${subject}`,
    //   html: `
    //     <h2>Nouveau message de contact</h2>
    //     <p><strong>Nom:</strong> ${name}</p>
    //     <p><strong>Email:</strong> ${email}</p>
    //     <p><strong>Téléphone:</strong> ${phone || 'Non fourni'}</p>
    //     <p><strong>Sujet:</strong> ${subject}</p>
    //     <p><strong>Message:</strong></p>
    //     <p>${message.replace(/\n/g, '<br>')}</p>
    //   `
    // });

    return NextResponse.json({
      success: true,
      message: 'Message envoyé avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erreur lors de l\'envoi du message'
      },
      { status: 500 }
    );
  }
}
