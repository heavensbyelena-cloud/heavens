'use client';

import { useState } from 'react';

interface Props {
  productId?: string;
  onSuccess?: () => void;
}

export default function ReviewForm({ productId, onSuccess }: Props) {
  const [rating, setRating]   = useState(0);
  const [hover,  setHover]    = useState(0);
  const [comment, setComment] = useState('');
  const [name,    setName]    = useState('');
  const [loading, setLoading] = useState(false);
  const [msg,     setMsg]     = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (!rating)              return setMsg({ text: 'Veuillez sélectionner une note.', type: 'error' });
    if (comment.trim().length < 5) return setMsg({ text: "L'avis doit contenir au moins 5 caractères.", type: 'error' });

    setLoading(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment: comment.trim().slice(0, 1000), author_name: name.trim() || null, product_id: productId }),
      });
      if (!res.ok) throw new Error();
      setMsg({ text: 'Merci ! Votre avis sera visible après modération.', type: 'success' });
      setRating(0); setComment(''); setName('');
      onSuccess?.();
    } catch {
      setMsg({ text: 'Une erreur est survenue. Réessayez.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: '580px', margin: '0 auto', background: 'var(--blanc)', border: '1px solid var(--bordure)', padding: '40px' }}>
      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', fontWeight: 400, letterSpacing: '0.15em', textAlign: 'center', marginBottom: '28px' }}>
        Laisser un avis
      </h3>

      <form onSubmit={handleSubmit} noValidate>
        {/* Étoiles interactives */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px', fontSize: '2rem', cursor: 'pointer' }} role="radiogroup" aria-label="Note">
          {[1,2,3,4,5].map(n => (
            <span
              key={n}
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              style={{ color: n <= (hover || rating) ? 'var(--rose-poudre)' : 'var(--bordure)', transition: 'color 0.15s', userSelect: 'none' }}
              role="radio" aria-checked={rating === n} aria-label={`${n} étoile${n > 1 ? 's' : ''}`}
            >
              ★
            </span>
          ))}
        </div>

        <div style={{ marginBottom: '18px' }}>
          <label className="form-label" htmlFor="rev-comment">Votre avis *</label>
          <textarea
            id="rev-comment"
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Partagez votre expérience..."
            required
            rows={4}
            className="form-input"
            style={{ resize: 'vertical' }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label className="form-label" htmlFor="rev-name">Votre prénom (optionnel)</label>
          <input id="rev-name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ex : Sophie" maxLength={50} className="form-input" />
        </div>

        <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '14px', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Publication...' : 'Publier mon avis'}
        </button>

        {msg && (
          <p style={{ textAlign: 'center', marginTop: '14px', fontSize: '0.85rem', color: msg.type === 'success' ? '#5a8a5a' : '#c05050' }}>
            {msg.text}
          </p>
        )}
      </form>
    </div>
  );
}
