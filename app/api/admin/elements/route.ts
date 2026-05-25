import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

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

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const admin = getAdminOrError();
  if ('error' in admin) return admin.error;

  const { data, error } = await admin.client
    .from('site_elements')
    .select('id, key, type, content, image_path, icon_name, style')
    .order('created_at', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data ?? [] });
}

export async function PATCH(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const admin = getAdminOrError();
  if ('error' in admin) return admin.error;

  const body = await req.json();
  const { id, patch } = body as { id: string; patch: Record<string, unknown> };

  const { data, error } = await admin.client
    .from('site_elements')
    .update(patch)
    .eq('id', id)
    .select('id, key, type, content, image_path, icon_name, style')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data });
}
