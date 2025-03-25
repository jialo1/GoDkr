import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const places = await prisma.place.findMany({
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(places);
  } catch (error) {
    console.error('Erreur lors de la récupération des lieux:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de la récupération des lieux' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { name, description, address, latitude, longitude, category, imageUrl } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    const place = await prisma.place.create({
      data: {
        name,
        description,
        address,
        latitude,
        longitude,
        category,
        imageUrl,
        authorId: user.id,
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(place, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du lieu:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de la création du lieu' },
      { status: 500 }
    );
  }
} 