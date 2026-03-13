import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import ProductGrid from '@/components/Product/ProductGrid';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import type { Product } from '@/types';

export const metadata: Metadata = {
  title: "Heaven's By Elena — Bijoux faits main",
  description: "Bijoux faits main, portés avec âme. Créations artisanales en gold filled & argent sterling.",
};

// Section Explorer : 6 catégories (pas Accessoire)
const CATEGORIES = [
  { name: "Boucles d'oreille", slug: 'boucles',   img: 'https://placehold.co/300x400/F5E6E0/8A8A8A?text=Boucles' },
  { name: 'Colliers',          slug: 'colliers',  img: 'https://placehold.co/300x400/F5E6E0/8A8A8A?text=Colliers' },
  { name: 'Parrure',           slug: 'parrure',   img: 'https://placehold.co/300x400/F5E6E0/8A8A8A?text=Parrure' },
  { name: 'Bougies',           slug: 'bougies',   img: 'https://placehold.co/300x400/F5E6E0/8A8A8A?text=Bougies' },
  { name: 'Lunettes',          slug: 'lunettes', img: 'https://placehold.co/300x400/F5E6E0/8A8A8A?text=Lunettes' },
  { name: 'Sacs à mains',      slug: 'sacs',      img: 'https://placehold.co/300x400/F5E6E0/8A8A8A?text=Sacs' },
];

const ENGAGEMENTS = [
  { icon: '✦', title: 'Fait main en France',             sub: 'Créations artisanales' },
  { icon: '◇', title: 'Gold filled & Argent sterling',   sub: 'Métaux nobles' },
  { icon: '⬡', title: 'Livraison soignée',               sub: 'Emballage luxueux' },
  { icon: '↺', title: 'Retours 14 jours',                sub: 'Satisfait ou remboursé' },
];

async function getBestSellers(): Promise<Product[]> {
  try {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from('products')
      .select('id, name, price, badge, category, image_url')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(4);
    return (data as Product[]) ?? [];
  } catch { return []; }
}

export default async function HomePage() {
  const products = await getBestSellers();

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '85vh', alignItems: 'center' }} className="hero-section">
        <div style={{ padding: '80px 60px' }} className="hero-text">
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.8rem', fontWeight: 400, lineHeight: 1.3, marginBottom: '20px' }}>
            Bijoux faits main,<br />portés avec âme
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--gris)', maxWidth: '400px', marginBottom: '0' }}>
            Chaque pièce est unique, créée avec soin par Elena
          </p>
          <Link href="/shop" className="btn-primary" style={{ marginTop: '30px' }}>
            Découvrir
          </Link>
        </div>
        <div style={{ width: '100%', height: '100%', minHeight: '500px', background: "url('https://placehold.co/800x1000/F5E6E0/8A8A8A?text=Heaven%27s+by+Elena') center/cover no-repeat" }} role="img" aria-label="Heaven's By Elena" />
      </section>

      {/* ── CATÉGORIES ───────────────────────────────────── */}
      <section style={{ padding: '100px 40px', background: 'var(--blanc)' }} id="boutique">
        <h2 className="section-title" style={{ marginBottom: '60px' }}>Explorer</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', maxWidth: '1100px', margin: '0 auto' }} className="cats-grid">
          {CATEGORIES.map(cat => (
            <Link key={cat.slug} href={`/shop?category=${cat.slug}`} style={{ textAlign: 'center', textDecoration: 'none', color: 'var(--noir)', display: 'block' }}>
              <div style={{ width: '100%', aspectRatio: '3/4', borderRadius: '4px', overflow: 'hidden', marginBottom: '16px', background: 'var(--rose-clair)', position: 'relative' }}>
                <Image src={cat.img} alt={cat.name} fill sizes="300px" style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }} />
              </div>
              <span style={{ fontSize: '0.78rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gris)' }}>{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── MEILLEURES VENTES ────────────────────────────── */}
      <section style={{ padding: '100px 40px', background: 'var(--blanc)' }}>
        <h2 className="section-title" style={{ marginBottom: '60px' }}>Meilleures ventes</h2>
        <ProductGrid products={products} emptyMessage="Aucun produit disponible pour le moment." />
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <Link href="/shop" className="btn-secondary">Voir tous les produits</Link>
        </div>
      </section>

      {/* ── NOTRE HISTOIRE ───────────────────────────────── */}
      <section style={{ padding: '100px 40px', background: 'var(--fond-casse)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }} className="story-grid">
          <div style={{ width: '100%', aspectRatio: '4/5', background: "url('https://placehold.co/500x600/F5E6E0/8A8A8A?text=Elena') center/cover no-repeat" }} role="img" aria-label="Elena créatrice" />
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 400, letterSpacing: '0.15em', marginBottom: '28px' }}>Notre histoire</h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--gris)', lineHeight: 1.8, marginBottom: '16px' }}>
              Elena crée ses bijoux à la main, avec passion et minutie. Chaque pièce est façonnée en gold filled et argent sterling, en série limitée, pour vous offrir des créations durables et élégantes.
            </p>
            <p style={{ fontSize: '0.95rem', color: 'var(--gris)', lineHeight: 1.8 }}>
              Des matériaux nobles, un savoir-faire artisanal et une attention portée à chaque détail : voilà ce qui fait l&apos;âme de Heaven&apos;s By Elena.
            </p>
          </div>
        </div>
      </section>

      {/* ── ENGAGEMENTS ──────────────────────────────────── */}
      <section style={{ padding: '100px 40px', background: 'var(--blanc)' }}>
        <h2 className="section-title" style={{ marginBottom: '60px' }}>Nos engagements</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '50px', maxWidth: '1000px', margin: '0 auto' }} className="engage-grid">
          {ENGAGEMENTS.map(e => (
            <div key={e.title} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', color: 'var(--rose-poudre)', marginBottom: '16px' }}>{e.icon}</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.95rem', fontWeight: 400, letterSpacing: '0.1em', marginBottom: '6px' }}>{e.title}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--gris)' }}>{e.sub}</p>
            </div>
          ))}
        </div>
      </section>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media(max-width:968px){
              .hero-section{ grid-template-columns:1fr !important; }
              .hero-text{ padding:60px 30px !important; order:1; }
              .hero-section > div:last-child{ order:2; min-height:360px !important; }
              .cats-grid{ grid-template-columns:repeat(2,1fr) !important; }
              .story-grid{ grid-template-columns:1fr !important; gap:40px !important; }
              .engage-grid{ grid-template-columns:repeat(2,1fr) !important; }
            }
            @media(max-width:480px){
              .cats-grid{ grid-template-columns:repeat(2,1fr) !important; gap:16px !important; }
              .engage-grid{ grid-template-columns:repeat(2,1fr) !important; }
            }
          `,
        }}
      />
    </>
  );
}
