'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminProductActions({ productId }: { productId: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm('Supprimer ce produit ?')) return;
    await fetch(`/api/products/${productId}`, { method: 'DELETE' });
    router.refresh();
  }

  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
      <Link href={`/admin/products/${productId}`} style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--noir)', textDecoration: 'underline' }}>
        Modifier
      </Link>
      <button onClick={handleDelete} style={{ background: 'none', border: 'none', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c05050', cursor: 'pointer', textDecoration: 'underline' }}>
        Supprimer
      </button>
    </div>
  );
}
