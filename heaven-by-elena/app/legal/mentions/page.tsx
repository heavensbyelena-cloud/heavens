import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Mentions légales' };

export default function MentionsPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 40px' }}>
      <h1 className="section-title" style={{ marginBottom: '50px', textAlign: 'left' }}>Mentions légales</h1>
      {[
        { title: 'Éditeur du site', items: ["Nom : Heaven's By Elena", "Responsable : Elena", "Email : contact@heavensbyelena.fr", "Statut : Auto-entrepreneur"] },
        { title: 'Hébergement', items: ["Vercel Inc.", "340 Pine Street, Suite 1501", "San Francisco, CA 94104, USA", "https://vercel.com"] },
        { title: 'Propriété intellectuelle', items: ["L'ensemble du contenu de ce site (textes, images, photographies, logo, design) est protégé par le droit d'auteur et appartient à Heaven's By Elena. Toute reproduction est interdite sans autorisation préalable."] },
      ].map(s => (
        <section key={s.title} style={{ marginBottom: '32px' }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.15rem', fontWeight: 400, letterSpacing: '0.1em', marginBottom: '12px' }}>{s.title}</h2>
          {s.items.map((item, i) => <p key={i} style={{ fontSize: '0.9rem', color: 'var(--gris)', lineHeight: 1.8 }}>{item}</p>)}
        </section>
      ))}
    </div>
  );
}
