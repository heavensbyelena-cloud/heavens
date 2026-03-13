'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';

const NAV_LINKS = [
  { label: 'COLLIERS',          slug: 'colliers' },
  { label: "BOUCLES D'OREILLE", slug: 'boucles' },
  { label: 'PARRURE',           slug: 'parrure' },
  { label: 'BOUGIES',           slug: 'bougies' },
  { label: 'LUNETTES',          slug: 'lunettes' },
  { label: 'SACS À MAINS',      slug: 'sacs' },
];

interface HeaderProps {
  /** Afficher le lien Admin uniquement si true (session admin vérifiée côté serveur) */
  isAdmin?: boolean;
}

export default function Header({ isAdmin = false }: HeaderProps) {
  const { count, openCart } = useCart();
  const pathname = usePathname();

  return (
    <>
      {/* ── Barre annonce ── */}
      <div style={{
        background: 'var(--noir)',
        color: 'var(--blanc)',
        textAlign: 'center',
        padding: '10px 20px',
        fontSize: '0.7rem',
        letterSpacing: '0.15em',
      }}>
        ✦ Livraison offerte dès 60€ · Bijoux faits main · Gold filled & Argent sterling ✦
      </div>

      {/* ── Header principal ── */}
      <header style={{
        background: 'var(--blanc)',
        padding: '30px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '24px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: '1px solid var(--bordure)',
      }}>

        {/* Icônes gauche : Admin + Déconnexion (admin) + Mon compte */}
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          {isAdmin && (
            <>
              <a href="/admin" aria-label="Administration" style={{ color: 'var(--noir)', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none' }}>
                Admin
              </a>
              <form action="/api/auth/logout" method="POST" style={{ display: 'inline' }}>
                <button
                  type="submit"
                  aria-label="Déconnexion"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--gris)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    padding: 0,
                  }}
                >
                  Déconnexion
                </button>
              </form>
            </>
          )}
          <Link href="/account/dashboard" aria-label="Mon compte" style={{ color: 'var(--noir)', fontSize: '1rem', textDecoration: 'none' }}>
            👤
          </Link>
        </div>

        {/* Logo centré */}
        <Link href="/home" style={{ flex: 1, textAlign: 'center', minWidth: '200px', textDecoration: 'none' }}>
          <span style={{ fontFamily: "'Great Vibes', cursive", fontSize: '2.5rem', color: 'var(--noir)', display: 'block', lineHeight: 1.2 }}>
            Heaven&apos;s
          </span>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.75rem', fontVariant: 'small-caps', letterSpacing: '0.4em', color: 'var(--noir)', display: 'block', marginTop: '-4px' }}>
            By Elena
          </span>
        </Link>

        {/* Navigation */}
        <nav style={{ flex: 2, display: 'flex', justifyContent: 'center' }}>
          <ul style={{ listStyle: 'none', display: 'flex', gap: '36px', flexWrap: 'wrap', padding: 0 }}>
            {NAV_LINKS.map(link => {
              const href = `/shop?category=${link.slug}`;
              const isActive =
                pathname === '/shop' &&
                (typeof window !== 'undefined'
                  ? new URLSearchParams(window.location.search).get('category') === link.slug
                  : false);
              return (
                <li key={link.slug}>
                  <Link
                    href={href}
                    style={{
                      textDecoration: 'none',
                      color: isActive ? 'var(--rose-poudre)' : 'var(--noir)',
                      fontSize: '0.75rem',
                      letterSpacing: '0.25em',
                      textTransform: 'uppercase',
                      paddingBottom: '4px',
                      borderBottom: isActive ? '1px solid var(--rose-poudre)' : '1px solid transparent',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Icône panier */}
        <div>
          <button
            onClick={openCart}
            aria-label="Ouvrir le panier"
            style={{
              position: 'relative',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.1rem',
              color: 'var(--noir)',
              padding: 0,
            }}
          >
            🛒
            {count > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-10px',
                background: 'var(--rose-poudre)',
                color: 'var(--noir)',
                fontSize: '0.6rem',
                fontWeight: 500,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {count}
              </span>
            )}
          </button>
        </div>
      </header>
    </>
  );
}
