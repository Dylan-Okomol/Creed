import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const project = searchParams.get('project');
    const chapter = searchParams.get('chapter');

    if (!project || !chapter) {
      return NextResponse.json({ error: 'Missing project or chapter' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'content', project, 'chapters', `${chapter}.md`);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return NextResponse.json({ success: true, message: 'Chapter deleted successfully' });
    } else {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
