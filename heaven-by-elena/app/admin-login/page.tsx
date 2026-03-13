'use client';

import { useRouter } from 'next/navigation';
import AdminLoginModal from '@/components/ComingSoon/AdminLoginModal';

export default function AdminLoginPage() {
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, var(--blanc) 0%, var(--rose-clair) 100%)',
      }}
    >
      <AdminLoginModal
        isOpen={true}
        onClose={() => router.push('/')}
      />
    </div>
  );
}
