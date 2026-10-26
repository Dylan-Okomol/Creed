import { getChapterContent } from '@/lib/content';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ project: string; chapter: string }> }
) {
  const { project, chapter } = await params;
  const contentData = await getChapterContent(project, chapter);

  if (!contentData) {
    return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
  }

  return NextResponse.json({
    content: contentData.content,
    metadata: contentData.metadata,
  });
}
