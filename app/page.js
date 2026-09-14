'use client';

import { useEffect, useState } from 'react';
import { getUpcomingEvents } from '@/lib/events';
import EventCard from '@/components/EventCard';

const BUSINESS_NAME = 'Boletas [Nombre]';

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
        <h1 className="bg-gradient-to-r from-accent-purple via-accent-magenta to-accent-cyan bg-clip-text font-display text-3xl font-extrabold leading-tight text-transparent">
          {BUSINESS_NAME}
        </h1>
        <p className="mt-1.5 text-[11px] font-bold uppercase tracking-widest text-text-secondary">
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
      </footer>
    </main>
  );
}
