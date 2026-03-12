'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Head from 'next/head';
import Link from 'next/link';
import ProductGrid from '@/components/Product/ProductGrid';
import type { Product, ProductCategory } from '@/types';

const CATEGORY_DEFINITIONS: { slug: ProductCategory; label: string }[] = [
  { slug: 'boucles',   label: "Boucles d'oreille" },
  { slug: 'colliers',  label: 'Colliers' },
  { slug: 'parrure',   label: 'Parrure' },
  { slug: 'bougies',   label: 'Bougies' },
  { slug: 'lunettes',  label: 'Lunettes' },
  { slug: 'sacs',      label: 'Sacs à mains' },
];

const CATEGORY_SEO: Record<
  ProductCategory,
  { title: string; description: string; ogImage: string }
> = {
  colliers: {
    title: "Colliers — Heaven's By Elena",
    description:
      'Découvrez nos colliers faits main en gold filled et argent sterling, créés avec soin par Elena.',
    ogImage: 'https://placehold.co/1200x630/F5E6E0/8A8A8A?text=Colliers',
  },
  boucles: {
    title: "Boucles d’oreille — Heaven's By Elena",
    description:
      'Boucles d’oreille délicates et lumineuses, façonnées à la main pour sublimer chaque tenue.',
    ogImage: 'https://placehold.co/1200x630/F5E6E0/8A8A8A?text=Boucles',
  },
  parrure: {
    title: "Parrure — Heaven's By Elena",
    description:
      'Parrures complètes et harmonieuses pour des looks élégants et sophistiqués.',
    ogImage: 'https://placehold.co/1200x630/F5E6E0/8A8A8A?text=Parrure',
  },
  bougies: {
    title: "Bougies — Heaven's By Elena",
    description:
      'Bougies parfumées et décoratives, pensées comme des objets de décoration raffinés.',
    ogImage: 'https://placehold.co/1200x630/F5E6E0/8A8A8A?text=Bougies',
  },
  lunettes: {
    title: "Lunettes — Heaven's By Elena",
    description:
      'Sélection de lunettes tendance pour compléter votre style avec élégance.',
    ogImage: 'https://placehold.co/1200x630/F5E6E0/8A8A8A?text=Lunettes',
  },
  sacs: {
    title: "Sacs à mains — Heaven's By Elena",
    description:
      'Sacs à mains élégants et intemporels, pensés pour accompagner vos journées et vos soirées.',
    ogImage: 'https://placehold.co/1200x630/F5E6E0/8A8A8A?text=Sacs',
  },
};

const DEFAULT_SEO = {
  title: "Boutique — Heaven's By Elena",
  description:
    "Découvrez l’ensemble des créations Heaven's By Elena : colliers, boucles d’oreille, parrures, bougies, lunettes et sacs à mains.",
  ogImage:
    'https://placehold.co/1200x630/F5E6E0/8A8A8A?text=Heaven%27s+By+Elena',
};

function AdminRefreshButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  async function refresh() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/refresh-session', { method: 'POST', credentials: 'include' });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.role === 'admin') {
        window.location.href = '/admin';
        return;
      }
      setError(data.error || 'Profil non admin dans Supabase (is_admin = true ou role = admin).');
    } catch {
      setError('Erreur réseau.');
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <button type="button" onClick={refresh} disabled={loading} style={{ background: 'var(--noir)', color: 'var(--blanc)', border: 'none', padding: '8px 14px', fontSize: '0.8rem', cursor: loading ? 'wait' : 'pointer', textDecoration: 'underline' }}>
        {loading ? 'Actualisation…' : 'Actualiser ma session'}
      </button>
      {error && <span style={{ display: 'block', marginTop: '6px', fontSize: '0.8rem', color: 'var(--gris)' }}>{error}</span>}
    </>
  );
}

export default function ShopPage() {
  const searchParams = useSearchParams();
  const adminRequired = searchParams.get('admin_required') === '1';

  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [activeCategory, setActive] = useState<ProductCategory | null>(null);

  const baseUrl =
    typeof window !== 'undefined'
      ? process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL ?? '';

  const currentSeo = useMemo(() => {
    if (!activeCategory) return DEFAULT_SEO;
    return CATEGORY_SEO[activeCategory] ?? DEFAULT_SEO;
  }, [activeCategory]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json().catch(() => ({}));
      const list: Product[] = data.products ?? [];

      console.log('[Shop /api/products] Réponse:', {
        status: res.status,
        ok: res.ok,
        productsCount: list.length,
        products: list.length ? list.map(p => ({ id: p.id, name: p.name, category: p.category })) : '(tableau vide)',
        error: data.error ?? null,
      });

      setProducts(list);
      setFiltered(list);
    } catch (err) {
      console.error('[Shop /api/products] Erreur fetch:', err);
      setProducts([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  // Lire le paramètre ?category= depuis l'URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category') as ProductCategory | null;
    if (cat) filterBy(cat);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]);

  function filterBy(cat: ProductCategory | null) {
    setActive(cat);
    setFiltered(cat ? products.filter(p => p.category === cat) : products);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div style={{ minHeight: '80vh' }}>
      {adminRequired && (
        <div style={{ background: 'var(--rose-poudre)', padding: '16px 24px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--noir)' }}>
          <strong>Accès admin refusé.</strong> Votre session n&apos;a pas les droits admin à jour.
          <br />
          <span style={{ marginTop: '8px', display: 'inline-block' }}>
            <AdminRefreshButton />
            {' · '}
            <Link href="/account/login?redirect=/admin" style={{ textDecoration: 'underline', fontWeight: 600 }}>Me reconnecter</Link>
          </span>
        </div>
      )}
      <Head>
        <title>{currentSeo.title}</title>
        <meta name="description" content={currentSeo.description} />
        <meta property="og:title" content={currentSeo.title} />
        <meta property="og:description" content={currentSeo.description} />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={
            activeCategory
              ? `${baseUrl}/shop?category=${activeCategory}`
              : `${baseUrl}/shop`
          }
        />
        <meta property="og:image" content={currentSeo.ogImage} />
      </Head>

      {/* Schema.org BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Accueil',
                item: `${baseUrl}/`,
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Boutique',
                item: `${baseUrl}/shop`,
              },
              ...(activeCategory
                ? [
                    {
                      '@type': 'ListItem',
                      position: 3,
                      name:
                        CATEGORY_DEFINITIONS.find(
                          c => c.slug === activeCategory,
                        )?.label ?? activeCategory,
                      item: `${baseUrl}/shop?category=${activeCategory}`,
                    },
                  ]
                : []),
            ],
          }),
        }}
      />
      {/* En-tête */}
      <div style={{ padding: '60px 40px 40px', textAlign: 'center', borderBottom: '1px solid var(--bordure)' }}>
        <h1 className="section-title">La Boutique</h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--gris)', marginTop: '16px' }}>
          {filtered.length} création{filtered.length > 1 ? 's' : ''}
          {activeCategory && ` · ${activeCategory}`}
        </p>
      </div>

      {/* Filtres catégories */}
      <div style={{ padding: '30px 40px', borderBottom: '1px solid var(--bordure)', display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', background: 'var(--fond-casse)' }}>
        <button
          onClick={() => filterBy(null)}
          style={{
            padding: '8px 20px',
            border: !activeCategory ? '1px solid var(--rose-poudre)' : '1px solid var(--bordure)',
            background: 'transparent',
            color: !activeCategory ? 'var(--noir)' : 'var(--gris)',
            fontSize: '0.7rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: !activeCategory ? '0 0 0 1px var(--rose-poudre)' : 'none',
          }}
        >
          Tous les produits
        </button>
        {CATEGORY_DEFINITIONS.map(cat => (
          <button
            key={cat.slug}
            onClick={() => filterBy(cat.slug)}
            style={{
              padding: '8px 20px',
              border: activeCategory === cat.slug ? '1px solid var(--rose-poudre)' : '1px solid var(--bordure)',
              background: 'transparent',
              color: activeCategory === cat.slug ? 'var(--noir)' : 'var(--gris)',
              fontSize: '0.7rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: activeCategory === cat.slug ? '0 0 0 1px var(--rose-poudre)' : 'none',
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grille produits */}
      <div style={{ padding: '60px 40px' }}>
        <ProductGrid
          products={filtered}
          loading={loading}
          emptyMessage={activeCategory
            ? `Aucun produit dans la catégorie "${activeCategory}" pour le moment.`
            : 'Aucun produit disponible pour le moment.'}
        />
      </div>
    </div>
  );
}
