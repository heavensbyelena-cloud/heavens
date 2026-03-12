import type { Order } from '@/types';

interface OrderTableProps {
  orders: Order[];
}

/**
 * Tableau admin des commandes
 * Colonnes : N° | Client | Montant | Statut | Date | Actions
 * Action : changer le statut (select)
 */
export default function OrderTable({ orders }: OrderTableProps) {
  return (
    <table>
      <thead>
        {/* En-têtes */}
      </thead>
      <tbody>
        {/* Lignes commandes */}
      </tbody>
    </table>
  );
}
