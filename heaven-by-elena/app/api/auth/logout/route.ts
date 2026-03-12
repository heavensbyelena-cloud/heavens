import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { COOKIE_NAME } from '@/lib/jwt';

export async function POST() {
  try {
    const supabase = createServerSupabaseClient();
    await supabase.auth.signOut();

    const response = NextResponse.json({ message: 'Déconnecté' });
    response.cookies.set(COOKIE_NAME, '', { maxAge: 0, path: '/' });
    return response;
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
