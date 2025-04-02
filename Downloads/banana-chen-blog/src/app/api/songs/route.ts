import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const songs = await prisma.song.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(songs);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching songs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const song = await prisma.song.create({
      data: json,
    });
    return NextResponse.json(song);
  } catch (error) {
    return NextResponse.json({ error: 'Error creating song' }, { status: 500 });
  }
} 