import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const letters = await prisma.letter.findMany({
      orderBy: {
        date: 'desc',
      },
    });
    return NextResponse.json(letters);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching letters' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const letter = await prisma.letter.create({
      data: json,
    });
    return NextResponse.json(letter);
  } catch (error) {
    return NextResponse.json({ error: 'Error creating letter' }, { status: 500 });
  }
} 