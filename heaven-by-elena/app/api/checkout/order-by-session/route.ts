import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('session_id');
  if (!sessionId) {
    return NextResponse.json({ error: 'session_id manquant' }, { status: 400 });
  }

  try {
    const admin = createAdminClient();
    const { data: order, error } = await admin
      .from('orders')
      .select('id, status, total_price, customer_email')
      .eq('payment_id', sessionId)
      .maybeSingle();

    if (error) throw error;
    if (!order) {
      return NextResponse.json({ error: 'Commande non trouvée' }, { status: 404 });
    }

    // Marquer comme payée si ce n'est pas déjà fait (au cas où le webhook n'a pas encore été reçu)
    if (order.status === 'pending') {
      await admin
        .from('orders')
        .update({ status: 'paid', updated_at: new Date().toISOString() })
        .eq('id', order.id);
    }

    return NextResponse.json({ order: { ...order, status: 'paid' } });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
