'use client';

import { useState } from 'react';
import Link from 'next/link';
import AdminProductActions from '@/app/admin/products/AdminProductActions';
import AdminOrderStatus from '@/app/admin/orders/AdminOrderStatus';
import AdminReviewActions from '@/app/admin/reviews/AdminReviewActions';
import { formatPrice, translateStatus } from '@/lib/utils';

type TabId = 'dashboard' | 'products' | 'orders' | 'reviews';

// Couleurs d'affichage pour les statuts de commande
const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: '#e8a040',
  paid: '#5a8a5a',
  processing: '#4a7ab5',
  shipped: '#7a5ab5',
  delivered: '#5a8a5a',
  cancelled: '#c05050',
};

const PRODUCT_CATEGORY_FILTERS: { value: string; label: string }[] = [
  { value: 'all', label: 'Toutes' },
  { value: 'colliers', label: 'Colliers' },
  { value: 'boucles', label: "Boucles d'oreille" },
  { value: 'parrure', label: 'Parrure' },
  { value: 'bougies', label: 'Bougies' },
  { value: 'lunettes', label: 'Lunettes' },
  { value: 'sacs', label: 'Sacs à mains' },
];

const ORDER_STATUS_FILTERS: { value: string; label: string }[] = [
  { value: 'all', label: 'Tous' },
  { value: 'pending', label: 'En attente' },
  { value: 'paid', label: 'Payées' },
  { value: 'processing', label: 'En traitement' },
  { value: 'shipped', label: 'Expédiées' },
  { value: 'delivered', label: 'Livrées' },
  { value: 'cancelled', label: 'Annulées' },
];

interface AdminTabsProps {
  dashboard: {
    nbProducts: number;
    nbOrders: number;
    nbPending: number;
    recentOrders: Array<{
      id: string;
      subtotal: number;
      shipping_cost: number;
      total: number;
      status: string;
      created_at: string;
      customer_name: string | null;
    }>;
  };
  products: Array<{
    id: string;
    image_url: string | null;
    name: string;
    category: string;
    price: number;
    stock: number | null;
  }>;
  orders: Array<{
    id: string;
    customer_name: string | null;
    customer_email: string | null;
    subtotal?: number | null;
    shipping_cost?: number | null;
    total?: number | null;
    total_price?: number | null;
    shipping_address?: {
      first_name?: string;
      last_name?: string;
      address?: string;
      city?: string;
      postal_code?: string;
      country?: string;
      phone?: string;
    } | null;
    status: string;
    created_at: string;
    items: unknown[];
  }>;
  reviews: Array<{
    id: string;
    rating: number;
    comment: string | null;
    author_name: string | null;
    status: string;
    created_at: string;
  }>;
}

function stars(n: number) {
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}

export default function AdminTabs({ dashboard, products, orders, reviews }: AdminTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [reviewFilter, setReviewFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  const filteredReviews = reviews.filter((r) => r.status === reviewFilter);
  const filteredProducts =
    productCategoryFilter === 'all'
      ? products
      : products.filter((p) => p.category === productCategoryFilter);
  const filteredOrders =
    orderStatusFilter === 'all'
      ? orders
      : orders.filter((o) => o.status === orderStatusFilter);

  const tabStyle = (active: boolean) => ({
    padding: '8px 20px',
    background: active ? 'var(--noir)' : 'transparent',
    color: active ? 'var(--blanc)' : 'var(--gris)',
    border: `1px solid ${active ? 'var(--noir)' : 'var(--bordure)'}`,
    fontSize: '0.72rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase' as const,
    cursor: 'pointer' as const,
    transition: 'all 0.2s',
  });

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 400, letterSpacing: '0.15em' }}>
          Administration
        </h1>
        <Link href="/" style={{ fontSize: '0.75rem', color: 'var(--gris)', textDecoration: 'none', letterSpacing: '0.15em' }}>
          ← Voir la boutique
        </Link>
      </div>

      {/* Tabs : boutons (pas de navigation) */}
      <nav style={{ display: 'flex', gap: '8px', marginBottom: '40px', flexWrap: 'wrap' }}>
        {(
          [
            { id: 'dashboard' as const, label: 'Dashboard' },
            { id: 'products' as const, label: 'Produits' },
            { id: 'orders' as const, label: 'Commandes' },
            { id: 'reviews' as const, label: 'Avis' },
          ] as const
        ).map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            style={tabStyle(activeTab === id)}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* Section Dashboard */}
      {activeTab === 'dashboard' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px', marginBottom: '50px' }}>
            <div style={{ background: 'var(--fond-casse)', border: '1px solid var(--bordure)', padding: '32px 28px' }}>
              <div style={{ fontSize: '2rem', color: 'var(--rose-poudre)', marginBottom: '12px' }}>◇</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', fontWeight: 400, lineHeight: 1, marginBottom: '6px' }}>{dashboard.nbProducts}</div>
              <div style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gris)' }}>Produits</div>
            </div>
            <div style={{ background: 'var(--fond-casse)', border: '1px solid var(--bordure)', padding: '32px 28px' }}>
              <div style={{ fontSize: '2rem', color: 'var(--rose-poudre)', marginBottom: '12px' }}>⬡</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', fontWeight: 400, lineHeight: 1, marginBottom: '6px' }}>{dashboard.nbOrders}</div>
              <div style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gris)' }}>Commandes</div>
            </div>
            <div style={{ background: 'var(--fond-casse)', border: '1px solid var(--bordure)', padding: '32px 28px' }}>
              <div style={{ fontSize: '2rem', color: 'var(--rose-poudre)', marginBottom: '12px' }}>★</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', fontWeight: 400, lineHeight: 1, marginBottom: '6px' }}>{dashboard.nbPending}</div>
              <div style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gris)' }}>Avis en attente</div>
            </div>
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', fontWeight: 400, letterSpacing: '0.1em', marginBottom: '20px' }}>
            Commandes récentes
          </h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--bordure)' }}>
                {['ID', 'Client', 'Sous-total', 'Livraison', 'Total', 'Statut', 'Date'].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: '10px 16px',
                      textAlign: 'left',
                      fontSize: '0.68rem',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: 'var(--gris)',
                      fontWeight: 400,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dashboard.recentOrders.map((o) => {
                const subtotal = o.subtotal ?? 0;
                const shipping = o.shipping_cost ?? 0;
                const total = o.total ?? subtotal + shipping;
                const color = ORDER_STATUS_COLORS[o.status] ?? 'var(--gris)';
                const label = translateStatus(o.status);

                return (
                  <tr key={o.id} style={{ borderBottom: '1px solid var(--bordure)' }}>
                    <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--gris)' }}>
                      {o.id ? String(o.id).slice(0, 8) : 'N/A'}
                    </td>
                    <td style={{ padding: '14px 16px' }}>{o.customer_name ?? '—'}</td>
                    <td style={{ padding: '14px 16px', fontFamily: "'Cormorant Garamond', serif" }}>{formatPrice(subtotal)}</td>
                    <td style={{ padding: '14px 16px', fontFamily: "'Cormorant Garamond', serif" }}>{formatPrice(shipping)}</td>
                    <td style={{ padding: '14px 16px', fontFamily: "'Cormorant Garamond', serif" }}>{formatPrice(total)}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          padding: '3px 10px',
                          fontSize: '0.65rem',
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          color,
                          border: `1px solid ${color}`,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {label}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--gris)', fontSize: '0.8rem' }}>
                      {new Date(o.created_at).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}

      {/* Section Produits */}
      {activeTab === 'products' && (
        <>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '2rem',
                fontWeight: 400,
              }}
            >
              Produits
            </h1>
            <Link href="/admin/products/new" className="btn-primary">
              + Ajouter un produit
            </Link>
          </div>

          {/* Filtres par catégorie */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              marginBottom: '20px',
            }}
          >
            {PRODUCT_CATEGORY_FILTERS.map((f) => {
              const active = productCategoryFilter === f.value;
              return (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setProductCategoryFilter(f.value)}
                  style={{
                    padding: '6px 14px',
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    border: `1px solid ${active ? 'var(--noir)' : 'var(--bordure)'}`,
                    background: active ? 'var(--noir)' : 'transparent',
                    color: active ? 'var(--blanc)' : 'var(--gris)',
                    cursor: 'pointer',
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--bordure)' }}>
                  {['Image', 'Nom', 'Catégorie', 'Prix', 'Stock', 'Actions'].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: '10px 16px',
                        textAlign: 'left',
                        fontSize: '0.68rem',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: 'var(--gris)',
                        fontWeight: 400,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--bordure)' }}>
                    <td style={{ padding: '12px 16px' }}>
                      {p.image_url ? (
                        <img
                          src={p.image_url}
                          alt={p.name}
                          style={{ width: 50, height: 50, objectFit: 'cover', background: 'var(--rose-clair)' }}
                        />
                      ) : (
                        <div style={{ width: 50, height: 50, background: 'var(--rose-clair)' }} />
                      )}
                    </td>
                    <td style={{ padding: '12px 16px', fontFamily: "'Cormorant Garamond', serif" }}>{p.name}</td>
                    <td
                      style={{
                        padding: '12px 16px',
                        color: 'var(--gris)',
                        fontSize: '0.8rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                      }}
                    >
                      {p.category}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {p.price?.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                    </td>
                    <td style={{ padding: '12px 16px', color: p.stock === 0 ? '#c05050' : 'var(--gris)' }}>
                      {p.stock ?? '∞'}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <AdminProductActions productId={p.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredProducts.length === 0 && (
              <p
                style={{
                  textAlign: 'center',
                  padding: '40px',
                  color: 'var(--gris)',
                  fontFamily: "'Cormorant Garamond', serif",
                }}
              >
                Aucun produit dans cette catégorie.
              </p>
            )}
          </div>
        </>
      )}

      {/* Section Commandes */}
      {activeTab === 'orders' && (
        <>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '2rem',
              fontWeight: 400,
              marginBottom: '20px',
            }}
          >
            Commandes
          </h1>

          {/* Filtres statut commandes */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              marginBottom: '20px',
            }}
          >
            {ORDER_STATUS_FILTERS.map((f) => {
              const active = orderStatusFilter === f.value;
              return (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setOrderStatusFilter(f.value)}
                  style={{
                    padding: '6px 14px',
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    border: `1px solid ${active ? 'var(--noir)' : 'var(--bordure)'}`,
                    background: active ? 'var(--noir)' : 'transparent',
                    color: active ? 'var(--blanc)' : 'var(--gris)',
                    cursor: 'pointer',
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--bordure)' }}>
                  {[
                    'Commande #',
                    'Client',
                    'Email',
                    'Articles',
                    'Sous-total',
                    'Livraison',
                    'Total',
                    'Statut',
                    'Date',
                    'Actions',
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: '10px 14px',
                        textAlign: 'left',
                        fontSize: '0.68rem',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: 'var(--gris)',
                        fontWeight: 400,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((o) => {
                  const subtotal = o.subtotal ?? 0;
                  const shipping = o.shipping_cost ?? 0;
                  const total = o.total_price ?? o.total ?? subtotal + shipping;
                  const color = ORDER_STATUS_COLORS[o.status] ?? 'var(--gris)';
                  const statusLabel = translateStatus(o.status);

                  return (
                    <tr key={o.id} style={{ borderBottom: '1px solid var(--bordure)' }}>
                      <td
                        style={{
                          padding: '12px 14px',
                          fontFamily: 'monospace',
                          fontSize: '0.75rem',
                          color: 'var(--gris)',
                        }}
                      >
                        {o.id ? String(o.id).slice(0, 8).toUpperCase() : 'N/A'}
                      </td>
                      <td style={{ padding: '12px 14px' }}>{o.customer_name ?? '—'}</td>
                      <td style={{ padding: '12px 14px', color: 'var(--gris)', fontSize: '0.8rem' }}>
                        {o.customer_email}
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'center', color: 'var(--gris)' }}>
                        {Array.isArray(o.items) ? o.items.length : 0}
                      </td>
                      <td style={{ padding: '12px 14px', fontFamily: "'Cormorant Garamond', serif" }}>
                        Sous-total: {formatPrice(subtotal)}
                      </td>
                      <td style={{ padding: '12px 14px', fontFamily: "'Cormorant Garamond', serif" }}>
                        Livraison: {formatPrice(shipping)}
                      </td>
                      <td
                        style={{
                          padding: '12px 14px',
                          fontFamily: "'Cormorant Garamond', serif",
                          fontWeight: 500,
                        }}
                      >
                        Total: {formatPrice(total)}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span
                          style={{
                            padding: '3px 10px',
                            fontSize: '0.65rem',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            color,
                            border: `1px solid ${color}`,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {statusLabel}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: '12px 14px',
                          color: 'var(--gris)',
                          fontSize: '0.78rem',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {new Date(o.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <AdminOrderStatus orderId={o.id} currentStatus={o.status} />
                          <button
                            type="button"
                            onClick={() => setSelectedOrderId(String(o.id))}
                            style={{
                              fontSize: '0.72rem',
                              padding: '4px 10px',
                              border: '1px solid var(--bordure)',
                              background: 'transparent',
                              cursor: 'pointer',
                              textTransform: 'uppercase',
                              letterSpacing: '0.08em',
                            }}
                          >
                            Voir détail
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {orders.length === 0 && (
              <p
                style={{
                  textAlign: 'center',
                  padding: '40px',
                  color: 'var(--gris)',
                  fontFamily: "'Cormorant Garamond', serif",
                }}
              >
                Aucune commande.
              </p>
            )}
          </div>

          {/* Modal détail commande */}
          {selectedOrderId && (() => {
            const order = orders.find((o) => String(o.id) === selectedOrderId);
            if (!order) return null;
            const subtotal = order.subtotal ?? 0;
            const shipping = order.shipping_cost ?? 0;
            const total = order.total_price ?? order.total ?? subtotal + shipping;
            const statusLabel = translateStatus(order.status);
            const addr = order.shipping_address ?? {};

            return (
              <div
                style={{
                  position: 'fixed',
                  inset: 0,
                  background: 'rgba(0,0,0,0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 40,
                }}
              >
                <div
                  style={{
                    background: 'white',
                    maxWidth: '640px',
                    width: '100%',
                    padding: '28px 26px',
                    border: '1px solid var(--bordure)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: '1.4rem',
                        fontWeight: 400,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Commande #{String(order.id).slice(0, 8).toUpperCase()}
                    </h2>
                    <button
                      type="button"
                      onClick={() => setSelectedOrderId(null)}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                      }}
                    >
                      Fermer
                    </button>
                  </div>

                  <p style={{ fontSize: '0.8rem', color: 'var(--gris)', marginBottom: '16px' }}>
                    Le{' '}
                    {new Date(order.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                    {' · '}
                    <strong>{statusLabel}</strong>
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1.2fr)', gap: '20px', marginBottom: '20px' }}>
                    <div>
                      <h3
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: '1.1rem',
                          fontWeight: 400,
                          marginBottom: '8px',
                        }}
                      >
                        Adresse de livraison
                      </h3>
                      <p style={{ fontSize: '0.86rem', color: 'var(--gris-fonce)' }}>
                        {(addr.first_name || addr.last_name) && (
                          <>
                            {addr.first_name} {addr.last_name}
                            <br />
                          </>
                        )}
                        {addr.address && (
                          <>
                            {addr.address}
                            <br />
                          </>
                        )}
                        {(addr.postal_code || addr.city) && (
                          <>
                            {addr.postal_code} {addr.city}
                            <br />
                          </>
                        )}
                        {addr.country && (
                          <>
                            {addr.country}
                            <br />
                          </>
                        )}
                        {addr.phone && <>Tél. : {addr.phone}</>}
                      </p>
                    </div>
                    <div>
                      <h3
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: '1.1rem',
                          fontWeight: 400,
                          marginBottom: '8px',
                        }}
                      >
                        Montants
                      </h3>
                      <div style={{ fontSize: '0.86rem', color: 'var(--gris)', marginBottom: '4px' }}>
                        <div>Sous-total: {formatPrice(subtotal)}</div>
                        <div>Livraison: {formatPrice(shipping)}</div>
                      </div>
                      <div
                        style={{
                          marginTop: '4px',
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: '1rem',
                          fontWeight: 500,
                        }}
                      >
                        Total: {formatPrice(total)}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: '1.1rem',
                        fontWeight: 400,
                        marginBottom: '8px',
                      }}
                    >
                      Produits
                    </h3>
                    <div style={{ borderTop: '1px solid var(--bordure)' }}>
                      {Array.isArray(order.items) && order.items.length > 0 ? (
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                          {order.items.map((it: any, idx: number) => {
                            const lineTotal = (it.price ?? 0) * (it.qty ?? 0);
                            return (
                              <li
                                key={`${it.product_id ?? idx}-${it.price ?? 0}-${it.qty ?? 0}`}
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  padding: '10px 0',
                                  borderBottom: '1px solid var(--bordure)',
                                  fontSize: '0.86rem',
                                }}
                              >
                                <span>
                                  {it.product_name ?? 'Produit'} · {it.qty ?? 0} × {formatPrice(it.price ?? 0)}
                                </span>
                                <span>{formatPrice(lineTotal)}</span>
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <p style={{ padding: '10px 0', fontSize: '0.86rem', color: 'var(--gris)' }}>
                          Aucun article dans cette commande.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </>
      )}

      {/* Section Avis */}
      {activeTab === 'reviews' && (
        <>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 400, marginBottom: '30px' }}>Modération des avis</h1>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
            {(['pending', 'approved', 'rejected'] as const).map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setReviewFilter(val)}
                style={{
                  padding: '6px 18px',
                  fontSize: '0.7rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  border: `1px solid ${reviewFilter === val ? 'var(--noir)' : 'var(--bordure)'}`,
                  background: reviewFilter === val ? 'var(--noir)' : 'transparent',
                  color: reviewFilter === val ? 'var(--blanc)' : 'var(--gris)',
                  cursor: 'pointer',
                }}
              >
                {val === 'pending' ? 'En attente' : val === 'approved' ? 'Approuvés' : 'Refusés'}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredReviews.map((r) => (
              <div key={r.id} style={{ border: '1px solid var(--bordure)', padding: '24px', display: 'flex', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ color: 'var(--rose-poudre)', fontSize: '0.9rem', marginBottom: '8px' }}>{stars(r.rating)}</div>
                  <p style={{ fontSize: '0.9rem', fontStyle: 'italic', color: 'var(--noir)', lineHeight: 1.6, marginBottom: '10px' }}>&ldquo;{r.comment ?? ''}&rdquo;</p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--gris)', letterSpacing: '0.1em' }}>
                    {r.author_name ?? 'Anonyme'} · {new Date(r.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <AdminReviewActions reviewId={r.id} currentStatus={r.status} />
              </div>
            ))}
            {filteredReviews.length === 0 && (
              <p style={{ textAlign: 'center', padding: '40px', color: 'var(--gris)', fontFamily: "'Cormorant Garamond', serif" }}>Aucun avis dans cette catégorie.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
