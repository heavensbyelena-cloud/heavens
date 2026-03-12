import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase-server';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { formatPrice, formatDate, translateStatus } from '@/lib/utils';

interface PageProps {
  params: { id: string };
}

export default async function OrderDetailPage({ params }: PageProps) {
  const supabase = createServerSupabaseClient();
  const admin = createAdminClient();

  // Auth obligatoire
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect('/account/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  // On récupère directement la commande avec cet ID
  const { data: order } = await admin
    .from('orders')
    .select(
      'id, user_id, customer_name, customer_email, items, shipping_address, subtotal, shipping_cost, total_price, total, status, created_at, notes',
    )
    .eq('id', Number(params.id))
    .maybeSingle();

  if (!order) {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 40px' }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem' }}>
          Commande introuvable.
        </p>
      </div>
    );
  }

  // Sécurité : un client ne peut voir que ses propres commandes
  if (!profile?.is_admin && order.user_id && order.user_id !== user.id) {
    redirect('/account/dashboard');
  }

  const subtotal = order.subtotal ?? 0;
  const shipping = order.shipping_cost ?? 0;
  const total = order.total_price ?? order.total ?? subtotal + shipping;
  const statusLabel = translateStatus(order.status);

  const isAdmin = !!profile?.is_admin;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 40px' }}>
      {/* Fil d'Ariane / retour */}
      <div style={{ marginBottom: '24px', fontSize: '0.8rem' }}>
        <Link
          href={isAdmin ? '/admin/orders' : '/account/dashboard'}
          style={{ color: 'var(--gris)', textDecoration: 'none' }}
        >
          ← {isAdmin ? 'Retour aux commandes admin' : 'Retour à mes commandes'}
        </Link>
      </div>

      {/* En-tête commande */}
      <h1
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '2rem',
          fontWeight: 400,
          letterSpacing: '0.12em',
          marginBottom: '8px',
          textTransform: 'uppercase',
        }}
      >
        Commande #{(order.id ? order.id.slice(0, 8) : 'N/A').toUpperCase()}
      </h1>
      <p style={{ color: 'var(--gris)', fontSize: '0.9rem', marginBottom: '16px' }}>
        Passée le {formatDate(order.created_at)}
      </p>

      {/* Statut */}
      <div style={{ marginBottom: '32px' }}>
        <span
          style={{
            display: 'inline-block',
            padding: '4px 14px',
            fontSize: '0.7rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            border: '1px solid var(--bordure)',
          }}
        >
          {statusLabel}
        </span>
      </div>

      {/* Résumé + adresse */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,2fr) minmax(0,1.4fr)',
          gap: '32px',
          marginBottom: '40px',
        }}
      >
        {/* Adresse de livraison */}
        <div>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.3rem',
              fontWeight: 400,
              marginBottom: '12px',
            }}
          >
            Adresse de livraison
          </h2>
          {order.shipping_address ? (
            <div style={{ fontSize: '0.9rem', color: 'var(--gris-fonce)' }}>
              <p>
                {order.shipping_address.first_name} {order.shipping_address.last_name}
              </p>
              <p>{order.shipping_address.address}</p>
              <p>
                {order.shipping_address.postal_code} {order.shipping_address.city}
              </p>
              <p>{order.shipping_address.country}</p>
              {order.shipping_address.phone && <p>Tél. : {order.shipping_address.phone}</p>}
            </div>
          ) : (
            <p style={{ fontSize: '0.9rem', color: 'var(--gris)' }}>Aucune adresse renseignée.</p>
          )}
        </div>

        {/* Récapitulatif des montants */}
        <div
          style={{
            border: '1px solid var(--bordure)',
            padding: '20px',
            background: 'var(--fond-clair, #faf8f6)',
          }}
        >
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.2rem',
              fontWeight: 400,
              marginBottom: '16px',
            }}
          >
            Récapitulatif
          </h2>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.9rem',
              marginBottom: '4px',
            }}
          >
            <span>Sous-total:</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.9rem',
              marginBottom: '8px',
            }}
          >
            <span>Livraison:</span>
            <span>{formatPrice(shipping)}</span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '1rem',
              fontWeight: 500,
              borderTop: '1px solid var(--bordure)',
              paddingTop: '8px',
              marginTop: '8px',
            }}
          >
            <span>Total:</span>
            <span>{formatPrice(total)}</span>
          </div>
          {order.notes && (
            <p
              style={{
                marginTop: '12px',
                fontSize: '0.85rem',
                color: 'var(--gris)',
              }}
            >
              Note : {order.notes}
            </p>
          )}
        </div>
      </div>

      {/* Liste des produits */}
      <div>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1.3rem',
            fontWeight: 400,
            marginBottom: '16px',
          }}
        >
          Produits
        </h2>

        <div style={{ borderTop: '1px solid var(--bordure)' }}>
          {order.items && order.items.length > 0 ? (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {order.items.map((item) => {
                const lineTotal = item.price * item.qty;
                return (
                  <li
                    key={item.product_id + String(item.price) + String(item.qty)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '16px 0',
                      borderBottom: '1px solid var(--bordure)',
                      gap: '16px',
                    }}
                  >
                    {item.image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image_url}
                        alt={item.product_name}
                        style={{
                          width: '64px',
                          height: '64px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                          border: '1px solid var(--bordure)',
                        }}
                      />
                    )}
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: '1rem',
                          marginBottom: '4px',
                        }}
                      >
                        {item.product_name}
                      </p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--gris)' }}>
                        Qté : {item.qty} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right', minWidth: '90px', fontSize: '0.9rem' }}>
                      {formatPrice(lineTotal)}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p style={{ padding: '16px 0', color: 'var(--gris)', fontSize: '0.9rem' }}>
              Aucun article dans cette commande.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

