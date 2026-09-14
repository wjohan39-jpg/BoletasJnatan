'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getUpcomingEvents } from '@/lib/events';
import EventCard from '@/components/EventCard';

const BUSINESS_NAME = 'Boletas Jnatan';

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    getUpcomingEvents()
      .then((data) => {
        if (active) {
          setEvents(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setError(true);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col px-4 pb-10 pt-8">
      <header className="mb-6">
        <div className="flex items-center gap-2">
          <h1 className="animate-gradient-flow bg-[length:200%_auto] bg-gradient-to-r from-accent-purple via-accent-magenta to-accent-cyan bg-clip-text font-display text-3xl font-extrabold leading-tight text-transparent">
            {BUSINESS_NAME}
          </h1>
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            className="mt-1 flex-shrink-0 text-accent-magenta"
            aria-label="Vendedor verificado"
          >
            <title>Vendedor verificado</title>
            <circle cx="12" cy="12" r="10" fill="currentColor" />
            <path d="M8 12.5l2.5 2.5L16 9.5" stroke="white" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="mt-1.5 text-[11px] font-bold uppercase tracking-widest text-accent-magenta">
          Vendedor verificado
        </p>
        <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-text-secondary">
          Compra tu boleta escaneando el QR
        </p>
        <div className="mt-4 h-0.5 bg-gradient-to-r from-accent-purple via-accent-magenta to-accent-cyan opacity-70" />
      </header>

      {loading && <p className="text-center text-text-secondary">Cargando eventos…</p>}

      {!loading && error && (
        <p className="text-center text-text-secondary">
          No se pudieron cargar los eventos. Intenta de nuevo más tarde.
        </p>
      )}

      {!loading && !error && events.length === 0 && (
        <p className="text-center text-text-secondary">No hay eventos disponibles por ahora.</p>
      )}

      <div className="flex flex-col gap-6">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      <footer className="mt-10 flex flex-col items-center gap-3 border-t border-white/10 pt-6 text-center">
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-text-secondary">
          Síguenos
        </span>
        <div className="flex gap-3">
          <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-bold text-text-primary">
            IG
          </a>
          <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-bold text-text-primary">
            FB
          </a>
          <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-bold text-text-primary">
            TT
          </a>
        </div>
        <p className="text-[11.5px] text-text-secondary/70">
          © {new Date().getFullYear()} {BUSINESS_NAME}. Todos los derechos reservados.
        </p>
        <Link href="/admin" className="text-[10px] text-text-secondary/40">
          Admin
        </Link>
      </footer>
    </main>
  );
}
