import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const place = await prisma.place.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!place) {
      return NextResponse.json(
        { message: 'Lieu non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(place);
  } catch (error) {
    console.error('Erreur lors de la récupération du lieu:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération du lieu' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      );
    }

    const place = await prisma.place.findUnique({
      where: { id: params.id },
      include: { author: true },
    });

    if (!place) {
      return NextResponse.json(
        { message: 'Lieu non trouvé' },
        { status: 404 }
      );
    }

    if (place.author.email !== session.user.email) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 403 }
      );
    }

    const data = await request.json();
    const updatedPlace = await prisma.place.update({
      where: { id: params.id },
      data: {
        name: data.name,
        description: data.description,
        address: data.address,
        category: data.category,
        imageUrl: data.imageUrl,
        latitude: data.latitude,
        longitude: data.longitude,
      },
    });

    return NextResponse.json(updatedPlace);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du lieu:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour du lieu' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      );
    }

    const place = await prisma.place.findUnique({
      where: { id: params.id },
      include: { author: true },
    });

    if (!place) {
      return NextResponse.json(
        { message: 'Lieu non trouvé' },
        { status: 404 }
      );
    }

    if (place.author.email !== session.user.email) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 403 }
      );
    }

    await prisma.place.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Lieu supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du lieu:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la suppression du lieu' },
      { status: 500 }
    );
  }
} 