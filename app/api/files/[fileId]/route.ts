import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/require-user';
import { getDB } from '@/lib/db/adapter';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ fileId: string }> }) {
  try {
    const user = await requireUser(req);
    const { fileId } = await params;
    const db = getDB();

    const file = await db.getFile(fileId);
    if (!file || file.ownerUid !== user.uid) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    await db.deleteFile(fileId);
    return NextResponse.json({ success: true, message: 'File and indexed knowledge chunks deleted.' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
