import { getAllBooks } from '@/lib/content';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const books = await getAllBooks();
    return NextResponse.json(books || []);
  } catch (error) {
    console.error('Error fetching books for admin:', error);
    return NextResponse.json([], { status: 200 }); // Return empty array instead of 500 to prevent frontend crash
  }
}
