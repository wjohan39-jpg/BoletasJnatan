'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setError('Correo o contraseña incorrectos.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <h1 className="font-display text-2xl font-extrabold text-text-primary">Panel Admin</h1>
      <p className="mt-1 text-sm text-text-secondary">Inicia sesión para continuar</p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wide text-text-secondary">
            Correo
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-text-primary outline-none focus:border-accent-cyan"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wide text-text-secondary">
            Contraseña
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-text-primary outline-none focus:border-accent-cyan"
          />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-xl bg-gradient-to-r from-accent-purple to-accent-magenta px-4 py-3.5 font-display font-bold text-white disabled:opacity-60"
        >
          {submitting ? 'Entrando…' : 'Iniciar sesión'}
        </button>
      </form>
    </main>
  );
}
