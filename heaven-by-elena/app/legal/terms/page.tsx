import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Conditions générales de vente' };

export default function TermsPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 40px' }}>
      <h1 className="section-title" style={{ marginBottom: '50px', textAlign: 'left' }}>Conditions générales de vente</h1>
      {[
        { title: '1. Objet', text: "Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre Heaven's By Elena et tout client souhaitant effectuer un achat via le site." },
        { title: '2. Produits', text: "Les produits proposés sont des bijoux artisanaux faits main par Elena, en gold filled et argent sterling. Les photographies sont représentatives mais de légères variations peuvent exister entre les créations." },
        { title: '3. Prix', text: "Les prix sont indiqués en euros TTC. Heaven's By Elena se réserve le droit de modifier ses prix à tout moment, les commandes étant facturées au tarif en vigueur au moment de la validation." },
        { title: '4. Commandes', text: "Toute commande passée sur le site constitue la formation d'un contrat de vente entre le client et Heaven's By Elena. La confirmation de commande est envoyée par email." },
        { title: '5. Livraison', text: "La livraison est offerte pour toute commande supérieure à 60€. Les délais de livraison sont de 5 à 10 jours ouvrés en France métropolitaine. En cas de retard, le client sera informé par email." },
        { title: '6. Retours', text: "Conformément à la législation en vigueur, le client dispose d'un délai de 14 jours à compter de la réception pour retourner tout article. Les produits doivent être retournés dans leur état d'origine." },
        { title: '7. Paiement', text: "Le paiement s'effectue de manière sécurisée. Les données bancaires ne sont pas conservées par Heaven's By Elena." },
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
