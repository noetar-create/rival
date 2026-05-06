import { NextRequest, NextResponse } from 'next/server';
import { getVideoById, incrementDownloads } from '@/lib/db';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const videoId = parseInt(id);

  const video = getVideoById(videoId);
  if (!video) {
    return NextResponse.json({ error: 'Video not found' }, { status: 404 });
  }

  if (!video.file_url) {
    return NextResponse.json({ error: 'No file available' }, { status: 404 });
  }

  // file_url is like /uploads/videos/filename.mp4
  const filePath = path.join(process.cwd(), 'public', video.file_url);

  try {
    const fileBuffer = await readFile(filePath);
    const filename = path.basename(filePath);

    incrementDownloads(videoId);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    });
  } catch {
    return NextResponse.json({ error: 'File not found on disk' }, { status: 404 });
  }
}
