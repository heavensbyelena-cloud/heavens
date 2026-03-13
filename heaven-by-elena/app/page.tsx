import type { Metadata } from 'next';
import ComingSoonPage from '@/components/ComingSoon/ComingSoonPage';

export const metadata: Metadata = {
  title: "Heaven's By Elena — Bientôt ouvert",
  description:
    "Boutique de bijoux faits main. Créations artisanales en gold filled & argent sterling. Bientôt disponible.",
};

export default function Page() {
  return <ComingSoonPage />;
}
