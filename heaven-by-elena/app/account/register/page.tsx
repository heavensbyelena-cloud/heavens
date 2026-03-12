'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [confirm,   setConfirm]   = useState('');
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [done,      setDone]      = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!firstName || !email || !password) { setError('Veuillez remplir tous les champs.'); return; }
    if (password.length < 6) { setError('Le mot de passe doit contenir au moins 6 caractères.'); return; }
    if (password !== confirm) { setError('Les mots de passe ne correspondent pas.'); return; }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signUp({
        email, password,
        options: { data: { first_name: firstName } },
      });
      if (authError) throw authError;
      setDone(true);
    } catch (err: unknown) {
      setError((err as Error).message.includes('already registered')
        ? 'Cet email est déjà utilisé.'
        : 'Une erreur est survenue.');
    } finally { setLoading(false); }
  }

  if (done) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '20px' }}>✦</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', fontWeight: 400, marginBottom: '16px' }}>Compte créé !</h1>
          <p style={{ color: 'var(--gris)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '28px' }}>
            Vérifiez votre boîte email pour confirmer votre adresse, puis connectez-vous.
          </p>
          <Link href="/account/login" className="btn-primary">Se connecter</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', background: 'var(--fond-casse)' }}>
      <div style={{ width: '100%', maxWidth: '440px', background: 'var(--blanc)', border: '1px solid var(--bordure)', padding: '48px 40px' }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', fontWeight: 400, letterSpacing: '0.15em', textAlign: 'center', marginBottom: '8px' }}>
          Créer un compte
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--gris)', fontSize: '0.85rem', marginBottom: '36px' }}>
          Rejoignez Heaven&apos;s By Elena
        </p>

        <form onSubmit={handleSubmit} noValidate>
          {[
            { id: 'firstName', label: 'Prénom', value: firstName, setter: setFirstName, type: 'text',  placeholder: 'Elena',            autoComplete: 'given-name' },
            { id: 'email',     label: 'Email',  value: email,     setter: setEmail,     type: 'email', placeholder: 'votre@email.fr',   autoComplete: 'email' },
            { id: 'password',  label: 'Mot de passe (6 caractères min.)', value: password, setter: setPassword, type: 'password', placeholder: '••••••••', autoComplete: 'new-password' },
            { id: 'confirm',   label: 'Confirmer le mot de passe', value: confirm, setter: setConfirm, type: 'password', placeholder: '••••••••', autoComplete: 'new-password' },
          ].map(f => (
            <div key={f.id} style={{ marginBottom: '18px' }}>
              <label className="form-label" htmlFor={f.id}>{f.label}</label>
              <input id={f.id} type={f.type} value={f.value} onChange={e => f.setter(e.target.value)} placeholder={f.placeholder} autoComplete={f.autoComplete} className="form-input" />
            </div>
          ))}

          {error && <p style={{ color: '#c05050', fontSize: '0.85rem', marginBottom: '16px', textAlign: 'center' }}>{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '14px', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '28px', fontSize: '0.85rem', color: 'var(--gris)' }}>
          Déjà inscrit ?{' '}
          <Link href="/account/login" style={{ color: 'var(--noir)', textDecoration: 'underline' }}>Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
