'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { translateStatus } from '@/lib/utils';

const STATUSES = ['pending','paid','processing','shipped','delivered','cancelled'];

export default function AdminOrderStatus({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setSaving(true);
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      router.refresh();
    } finally { setSaving(false); }
  }

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={saving}
      style={{
        fontSize: '0.72rem',
        padding: '4px 8px',
        border: '1px solid var(--bordure)',
        background: 'transparent',
        cursor: 'pointer',
        fontFamily: 'Inter, sans-serif',
        opacity: saving ? 0.6 : 1,
      }}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {translateStatus(s)}
        </option>
      ))}
    </select>
  );
}
