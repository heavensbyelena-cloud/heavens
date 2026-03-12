import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase-server';
import { requireAdminApi } from '@/lib/auth-api';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAdminApi(request);
    if (auth instanceof NextResponse) return auth;

    const { status } = await request.json();
    const allowed = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
    if (typeof status !== 'string' || !allowed.includes(status)) {
      return NextResponse.json({ error: 'Statut invalide' }, { status: 400 });
    }
    const admin = createAdminClient();
    const { error } = await admin.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', params.id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
