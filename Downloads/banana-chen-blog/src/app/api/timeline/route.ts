import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const timeline = await prisma.timeline.findMany({
      orderBy: {
        date: 'asc',
      },
    });
    return NextResponse.json(timeline);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching timeline' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const timeline = await prisma.timeline.create({
      data: json,
    });
    return NextResponse.json(timeline);
  } catch (error) {
    return NextResponse.json({ error: 'Error creating timeline entry' }, { status: 500 });
  }
} 