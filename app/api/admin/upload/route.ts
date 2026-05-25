import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { PUBLIC_BUCKET } from '@/lib/supabase';

function isAuthorized(req: NextRequest) {
  const provided = req.headers.get('x-admin-password');
  return !!provided && provided === process.env.ADMIN_PASSWORD;
}

function getAdminOrError() {
  try {
    return { client: getSupabaseAdmin() };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Admin client is not configured';
    return { error: NextResponse.json({ error: message }, { status: 500 }) };
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const admin = getAdminOrError();
  if ('error' in admin) return admin.error;

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'Missing file' }, { status: 400 });

  const ext = file.name.split('.').pop() || 'jpg';
  const path = `admin-uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  const { error } = await admin.client.storage.from(PUBLIC_BUCKET).upload(path, bytes, {
    contentType: file.type,
    upsert: true,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ image_path: path });
}
