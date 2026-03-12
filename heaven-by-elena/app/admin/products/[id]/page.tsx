'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { ProductCategory } from '@/types';

const CATS: { slug: ProductCategory; label: string }[] = [
  { slug: 'boucles',   label: "Boucles d'oreille" },
  { slug: 'colliers',  label: 'Colliers' },
  { slug: 'parrure',   label: 'Parrure' },
  { slug: 'bougies',   label: 'Bougies' },
  { slug: 'lunettes',  label: 'Lunettes' },
  { slug: 'sacs',      label: 'Sacs à mains' },
];

const initialForm = {
  name: '',
  description: '',
  price: '',
  category: '',
  badge: '',
  stock: '',
  image_url: '',
};

export default function AdminEditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [error, setError] = useState('');

  // Au chargement : récupérer l'ID depuis params, fetch GET /api/products/[id], pré-remplir le formulaire
  useEffect(() => {
    if (!id) {
      setFetching(false);
      setFetchError('ID produit manquant');
      return;
    }
    setFetchError('');
    fetch(`/api/products/${id}`, { credentials: 'include' })
      .then(res => {
        if (!res.ok) {
          if (res.status === 404) setFetchError('Produit introuvable');
          else setFetchError('Erreur lors du chargement');
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (!data) return;
        const p = data.product;
        if (p) {
          setForm({
            name: p.name ?? '',
            description: p.description ?? '',
            price: String(p.price ?? ''),
            category: p.category ?? '',
            badge: p.badge ?? '',
            stock: p.stock != null && p.stock !== '' ? String(p.stock) : '',
            image_url: p.image_url ?? '',
          });
        } else {
          setFetchError('Produit introuvable');
        }
      })
      .catch(() => setFetchError('Erreur réseau'))
      .finally(() => setFetching(false));
  }, [id]);

  function update(k: string, v: string) {
    setForm(prev => ({ ...prev, [k]: v }));
  }

  // À la soumission : PUT /api/products/[id]
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;
    if (!form.name || !form.price || !form.category) {
      setError('Nom, prix et catégorie sont requis.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          stock: form.stock ? parseInt(form.stock, 10) : null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Erreur lors de la mise à jour');
      }
      router.push('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour.');
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div style={{ padding: '80px', textAlign: 'center', color: 'var(--gris)' }}>
        Chargement du produit…
      </div>
    );
  }

  if (fetchError) {
    return (
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '60px 40px', textAlign: 'center' }}>
        <p style={{ color: '#c05050', marginBottom: '20px' }}>{fetchError}</p>
        <Link href="/admin" style={{ color: 'var(--gris)', textDecoration: 'none', fontSize: '0.8rem' }}>
          ← Retour à l’administration
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '60px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
        <Link href="/admin" style={{ color: 'var(--gris)', textDecoration: 'none', fontSize: '0.8rem' }}>
          ← Retour
        </Link>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', fontWeight: 400 }}>
          Modifier le produit
        </h1>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {[
          { key: 'name',      label: 'Nom *',      type: 'text',   placeholder: 'Collier Lumière' },
          { key: 'price',     label: 'Prix (€) *', type: 'number', placeholder: '65.00' },
          { key: 'badge',     label: 'Badge',      type: 'text',   placeholder: 'Fait main' },
          { key: 'stock',     label: 'Stock',      type: 'number', placeholder: 'Vide = illimité' },
          { key: 'image_url', label: 'URL image', type: 'url',    placeholder: 'https://...' },
        ].map(f => (
          <div key={f.key} style={{ marginBottom: '18px' }}>
            <label className="form-label">{f.label}</label>
            <input
              type={f.type}
              value={(form as Record<string, string>)[f.key]}
              onChange={e => update(f.key, e.target.value)}
              placeholder={f.placeholder}
              className="form-input"
              step={f.type === 'number' ? '0.01' : undefined}
            />
          </div>
        ))}

        <div style={{ marginBottom: '18px' }}>
          <label className="form-label">Catégorie *</label>
          <select
            value={form.category}
            onChange={e => update('category', e.target.value)}
            className="form-input"
            style={{ appearance: 'none' }}
          >
            <option value="">— Choisir —</option>
            {CATS.map(c => (
              <option key={c.slug} value={c.slug}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '28px' }}>
          <label className="form-label">Description</label>
          <textarea
            value={form.description}
            onChange={e => update('description', e.target.value)}
            rows={4}
            className="form-input"
            style={{ resize: 'vertical' }}
            placeholder="Description du produit…"
          />
        </div>

        {/* Aperçu de l'image actuelle */}
        {form.image_url ? (
          <div style={{ marginBottom: '24px' }}>
            <p className="form-label">Image actuelle</p>
            <div style={{ position: 'relative', width: 160, height: 160, background: 'var(--rose-clair)', overflow: 'hidden', border: '1px solid var(--bordure)' }}>
              <Image
                src={form.image_url}
                alt="Aperçu"
                fill
                style={{ objectFit: 'cover' }}
                sizes="160px"
                unoptimized={form.image_url.startsWith('https://res.cloudinary.com')}
              />
            </div>
          </div>
        ) : (
          <div style={{ marginBottom: '24px' }}>
            <p className="form-label">Image actuelle</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--gris)' }}>Aucune image</p>
          </div>
        )}

        {error && (
          <p style={{ color: '#c05050', fontSize: '0.85rem', marginBottom: '16px' }}>{error}</p>
        )}

        <div style={{ display: 'flex', gap: '16px' }}>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ padding: '14px 32px', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Enregistrement…' : 'Enregistrer'}
          </button>
          <Link href="/admin" className="btn-secondary" style={{ padding: '14px 24px' }}>
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}
