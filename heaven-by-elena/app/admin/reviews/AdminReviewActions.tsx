'use client';

import { useRouter } from 'next/navigation';

export default function AdminReviewActions({ reviewId, currentStatus }: { reviewId: string; currentStatus: string }) {
  const router = useRouter();

  async function update(status: string) {
    await fetch(`/api/reviews/${reviewId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '120px' }}>
      {currentStatus !== 'approved' && (
        <button onClick={() => update('approved')} style={{ padding: '7px 16px', background: 'transparent', border: '1px solid #5a8a5a', color: '#5a8a5a', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>
          ✓ Approuver
        </button>
      )}
      {currentStatus !== 'rejected' && (
        <button onClick={() => update('rejected')} style={{ padding: '7px 16px', background: 'transparent', border: '1px solid #c05050', color: '#c05050', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>
          ✕ Refuser
        </button>
      )}
    </div>
  );
}
