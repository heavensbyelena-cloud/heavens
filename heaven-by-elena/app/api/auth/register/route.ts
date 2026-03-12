/**
 * POST /api/auth/register
 * Crée l'utilisateur Supabase et le profil avec role = 'user'.
 * Optionnel: envoi email de confirmation via Resend (si RESEND_API_KEY défini).
 */
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-server';
import { checkAuthRateLimit } from '@/lib/rate-limit';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  if (!checkAuthRateLimit(request)) {
    return NextResponse.json(
      { error: 'Trop de tentatives. Réessayez plus tard.' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    const first_name = typeof body.first_name === 'string' ? body.first_name.trim() : '';

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Format d’email invalide' },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Mot de passe trop court (6 caractères minimum)' },
        { status: 400 }
      );
    }

    const admin = createAdminClient();
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
      user_metadata: { first_name: first_name || null },
    });

    if (error) {
      const msg = (error as Error).message ?? '';
      if (msg.includes('already') || msg.includes('registered')) {
        return NextResponse.json(
          { error: 'Email déjà utilisé.' },
          { status: 409 }
        );
      }
      throw error;
    }

    if (data.user) {
      await admin.from('profiles').insert({
        id: data.user.id,
        email,
        first_name: first_name || null,
        is_admin: false,
        role: 'user',
      });
    }

    if (process.env.RESEND_API_KEY) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM ?? 'Heaven\'s By Elena <onboarding@resend.dev>',
            to: [email],
            subject: 'Bienvenue chez Heaven\'s By Elena',
            html: `<p>Bienvenue ! Votre compte a été créé. Vous pouvez vous connecter sur le site.</p>`,
          }),
        });
      } catch {
        // Ne pas faire échouer l'inscription si l'email échoue
      }
    }

    return NextResponse.json(
      { message: 'Compte créé. Vous pouvez vous connecter.' },
      { status: 201 }
    );
  } catch (err: unknown) {
    const msg = (err as Error).message ?? '';
    if (msg.includes('already') || msg.includes('registered')) {
      return NextResponse.json(
        { error: 'Email déjà utilisé.' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
