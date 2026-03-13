'use client';

import { useState } from 'react';
import AdminLoginModal from './AdminLoginModal';

export default function ComingSoonPage() {
  const [showAdminModal, setShowAdminModal] = useState(false);

  return (
    <>
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '60px 40px',
          background: 'linear-gradient(135deg, var(--blanc) 0%, var(--rose-clair) 100%)',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            maxWidth: '700px',
            animation: 'fadeInUp 1s ease-out',
          }}
        >
          {/* Logo */}
          <div style={{ marginBottom: '40px' }}>
            <span
              style={{
                fontFamily: "'Great Vibes', cursive",
                fontSize: '3.5rem',
                color: 'var(--noir)',
                display: 'block',
                lineHeight: 1.2,
              }}
            >
              Heaven&apos;s
            </span>
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '0.8rem',
                fontVariant: 'small-caps',
                letterSpacing: '0.4em',
                color: 'var(--noir)',
                marginTop: '-8px',
                display: 'block',
              }}
            >
              By Elena
            </span>
          </div>

          {/* Titre */}
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '2.2rem',
              fontWeight: 400,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '12px',
              color: 'var(--noir)',
            }}
          >
            Bientôt Ouvert
          </h1>

          {/* Ligne décorative */}
          <div
            style={{
              width: 60,
              height: 1,
              background: 'var(--rose-poudre)',
              margin: '24px auto 32px',
            }}
          />

          {/* Description */}
          <div
            style={{
              fontSize: '1rem',
              color: 'var(--gris)',
              marginBottom: '40px',
              lineHeight: 1.8,
              maxWidth: 500,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            <p style={{ marginBottom: '16px' }}>
              Nous préparons quelque chose de magnifique pour vous.
            </p>
            <p>
              Notre boutique de bijoux faits main ouvrira très bientôt. Soyez parmi les premiers à
              découvrir nos créations exclusives.
            </p>
          </div>

          {/* Barre de progression */}
          <div
            style={{
              margin: '50px 0',
              maxWidth: 400,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            <span
              style={{
                fontSize: '0.75rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--gris)',
                marginBottom: '12px',
                display: 'block',
              }}
            >
              Bientôt
            </span>
            <div
              style={{
                width: '100%',
                height: 2,
                background: 'var(--rose-clair)',
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  background: 'var(--rose-poudre)',
                  width: '65%',
                  borderRadius: 2,
                  animation: 'loadingAnimation 2s ease-in-out infinite',
                }}
              />
            </div>
          </div>

          {/* Réseaux sociaux */}
          <div
            style={{
              marginTop: '60px',
              display: 'flex',
              justifyContent: 'center',
              gap: '30px',
              flexWrap: 'wrap',
            }}
          >
            <a
              href="https://www.tiktok.com/@elenaheavensofficiel"
              className="social-link"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: 'none',
                color: 'var(--noir)',
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                paddingBottom: 4,
                borderBottom: '1px solid transparent',
                transition: 'border-color 0.3s ease, color 0.3s ease',
              }}
            >
              TikTok
            </a>
            <a
              href="https://youtube.com/@elenaheavensofficiel"
              className="social-link"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: 'none',
                color: 'var(--noir)',
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                paddingBottom: 4,
                borderBottom: '1px solid transparent',
                transition: 'border-color 0.3s ease, color 0.3s ease',
              }}
            >
              YouTube
            </a>
            <a
              href="https://instagram.com"
              className="social-link"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: 'none',
                color: 'var(--noir)',
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                paddingBottom: 4,
                borderBottom: '1px solid transparent',
                transition: 'border-color 0.3s ease, color 0.3s ease',
              }}
            >
              Instagram
            </a>
          </div>

          {/* Lien Admin discret */}
          <div style={{ marginTop: '80px' }}>
            <button
              type="button"
              onClick={() => setShowAdminModal(true)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--gris)',
                fontSize: '0.65rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                opacity: 0.6,
                padding: '8px 12px',
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '0.6';
              }}
            >
              Admin
            </button>
          </div>
        </div>
      </div>

      <AdminLoginModal isOpen={showAdminModal} onClose={() => setShowAdminModal(false)} />

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes fadeInUp {
              from { opacity: 0; transform: translateY(30px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes loadingAnimation {
              0% { width: 65%; }
              50% { width: 80%; }
              100% { width: 65%; }
            }
            .social-link:hover {
              border-bottom-color: var(--rose-poudre) !important;
              color: var(--rose-poudre) !important;
            }
          `,
        }}
      />
    </>
  );
}
