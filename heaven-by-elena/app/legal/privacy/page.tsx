import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Politique de confidentialité' };

export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 40px' }}>
      <h1 className="section-title" style={{ marginBottom: '50px', textAlign: 'left' }}>Politique de confidentialité</h1>
      {[
        { title: 'Données collectées', text: "Nous collectons uniquement les données nécessaires au traitement de vos commandes : nom, email, adresse de livraison. Ces données ne sont jamais vendues ni partagées avec des tiers à des fins commerciales." },
        { title: 'Utilisation des données', text: "Vos données sont utilisées pour : traiter et livrer vos commandes, vous envoyer les confirmations de commande, vous contacter en cas de problème lié à votre commande." },
        { title: 'Conservation des données', text: "Vos données sont conservées pendant la durée légale requise (10 ans pour les données de facturation) puis supprimées." },
        { title: 'Vos droits (RGPD)', text: "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement et de portabilité de vos données. Pour exercer ces droits, contactez-nous à contact@heavensbyelena.fr." },
        { title: 'Cookies', text: "Notre site utilise uniquement des cookies techniques nécessaires au fonctionnement (panier, session). Aucun cookie publicitaire ni de tracking tiers n'est utilisé." },
      ].map(s => (
        <section key={s.title} style={{ marginBottom: '32px' }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.15rem', fontWeight: 400, letterSpacing: '0.1em', marginBottom: '12px' }}>{s.title}</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--gris)', lineHeight: 1.8 }}>{s.text}</p>
        </section>
      ))}
      <p style={{ fontSize: '0.78rem', color: 'var(--gris)', marginTop: '40px' }}>Dernière mise à jour : mars 2025</p>
    </div>
  );
}
