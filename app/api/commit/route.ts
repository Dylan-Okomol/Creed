import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { project, chapter, content, metadata } = body;

    if (!project || !chapter || content === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Construct frontmatter if metadata is provided
    const frontmatter = metadata
      ? `---\ntitle: ${metadata.title || 'Untitled'}\nsection: ${metadata.section || 'General'}\n---\n\n`
      : '';
    const finalContent = frontmatter + content;

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_REPO = process.env.GITHUB_REPO;

    if (GITHUB_TOKEN && GITHUB_REPO) {
      try {
        const getFileRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/content/${project}/chapters/${chapter}.md`, {
          headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        });

        if (!getFileRes.ok) {
          if (getFileRes.status === 404) {
            const commitRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/content/${project}/chapters/${chapter}.md`, {
              method: 'PUT',
              headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                message: `Create chapter ${chapter} in ${project}`,
                content: Buffer.from(finalContent).toString('base64'),
              }),
            });
            if (commitRes.ok) return NextResponse.json({ success: true });
            throw new Error('Failed to create new file on GitHub');
          }
          throw new Error('Could not fetch current file from GitHub');
        }

        const fileData = await getFileRes.json();
        const sha = fileData.sha;

        const commitRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/content/${project}/chapters/${chapter}.md`, {
          method: 'PUT',
          headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: `Update chapter ${chapter} in ${project}`,
            content: Buffer.from(finalContent).toString('base64'),
            sha: sha,
          }),
        });

        if (commitRes.ok) return NextResponse.json({ success: true });
        throw new Error('GitHub commit failed');
      } catch (githubError) {
        console.error('GitHub commit failed, trying local fallback:', githubError);
      }
    }

    try {
      const contentDir = path.join(process.cwd(), 'content', project, 'chapters');

      if (!fs.existsSync(contentDir)) {
        fs.mkdirSync(contentDir, { recursive: true });
      }

      const filePath = path.join(contentDir, `${chapter}.md`);
      fs.writeFileSync(filePath, finalContent, 'utf8');

      return NextResponse.json({ success: true, message: 'Saved to local filesystem' });
    } catch (localError) {
      console.error('Local write failed:', localError);
      return NextResponse.json({ error: 'Local filesystem write failed' }, { status: 500 });
    }
  } catch (error) {
    console.error('Commit error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
