import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        name: true,
        email: true,
        bio: true,
        location: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de la récupération du profil' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { name, bio, location } = await request.json();

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        bio,
        location,
      },
      select: {
        name: true,
        email: true,
        bio: true,
        location: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de la mise à jour du profil' },
      { status: 500 }
    );
  }
} 