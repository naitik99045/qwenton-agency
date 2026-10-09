import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/require-user';
import { getDB } from '@/lib/db/adapter';
import { z } from 'zod';

const uploadFileSchema = z.object({
  fileName: z.string().min(1).max(255),
  content: z.string().min(1),
  mimeType: z.string().default('text/plain'),
});

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const db = getDB();
    const files = await db.getFilesByUser(user.uid);
    return NextResponse.json({ files });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const body = await req.json();
    const { fileName, content, mimeType } = uploadFileSchema.parse(body);
    const db = getDB();

    const file = await db.createFile({
      ownerUid: user.uid,
      fileName,
      storageUrl: `storage://${user.uid}/${encodeURIComponent(fileName)}`,
      sizeBytes: Buffer.byteLength(content, 'utf8'),
      mimeType,
      status: 'ready',
      extractedText: content,
    });

    // Chunk document into ~500 character chunks for semantic retrieval
    const chunkSize = 500;
    const chunks: Array<{ fileId: string; ownerUid: string; chunkIndex: number; text: string }> = [];
    for (let i = 0; i < content.length; i += chunkSize) {
      chunks.push({
        fileId: file.id,
        ownerUid: user.uid,
        chunkIndex: Math.floor(i / chunkSize),
        text: content.slice(i, i + chunkSize),
      });
    }

    if (chunks.length > 0) {
      await db.saveChunks(chunks);
    }

    await db.createAuditEvent({
      actorUid: user.uid,
      action: 'file.upload',
      resource: `files/${file.id}`,
      details: { fileName, chunksCount: chunks.length },
    });

    return NextResponse.json({ file, chunksCount: chunks.length }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
