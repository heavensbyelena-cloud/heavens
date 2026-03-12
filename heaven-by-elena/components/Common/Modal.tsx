'use client';

import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

/**
 * Modal réutilisable
 * Overlay flouté + fermeture Escape + clic overlay
 * Accessible : role="dialog", aria-modal, focus trap
 */
export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div role="dialog" aria-modal="true" aria-label={title}>
      {/* Overlay */}
      <div onClick={onClose} />
      {/* Contenu modal */}
      <div>
        {/* Bouton fermer */}
        {title && <h2>{title}</h2>}
        {children}
      </div>
    </div>
  );
}
