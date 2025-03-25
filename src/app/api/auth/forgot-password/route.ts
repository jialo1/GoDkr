import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

// Configuration du transporteur d'email
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Ne pas révéler si l'email existe ou non
      return NextResponse.json(
        { message: 'Si un compte existe avec cet email, vous recevrez un lien de réinitialisation' },
        { status: 200 }
      );
    }

    // Générer un token de réinitialisation
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 heure

    // Sauvegarder le token dans la base de données
    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Créer le lien de réinitialisation
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`;

    // Envoyer l'email
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Réinitialisation de votre mot de passe',
      html: `
        <p>Bonjour ${user.name},</p>
        <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
        <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>Ce lien expirera dans 1 heure.</p>
        <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.</p>
      `,
    });

    return NextResponse.json(
      { message: 'Si un compte existe avec cet email, vous recevrez un lien de réinitialisation' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la réinitialisation du mot de passe:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de la réinitialisation du mot de passe' },
      { status: 500 }
    );
  }
} 