'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getEventById } from '@/lib/events';
import EventCard from '@/components/EventCard';

const BUSINESS_NAME = 'Boletas Jnatan';

export default function EventPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(undefined);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    getEventById(id)
      .then((data) => {
        if (active) setEvent(data);
      })
      .catch(() => {
        if (active) setError(true);
      });
    return () => {
      active = false;
    };
  }, [id]);

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col px-4 pb-10 pt-8">
      <header className="mb-6">
        <h1 className="bg-gradient-to-r from-accent-purple via-accent-magenta to-accent-cyan bg-clip-text font-display text-2xl font-extrabold leading-tight text-transparent">
          {BUSINESS_NAME}
        </h1>
        <div className="mt-4 h-0.5 bg-gradient-to-r from-accent-purple via-accent-magenta to-accent-cyan opacity-70" />
      </header>

      {event === undefined && !error && (
        <p className="text-center text-text-secondary">Cargando evento…</p>
      )}

      {error && <p className="text-center text-text-secondary">No se pudo cargar este evento.</p>}

      {event === null && !error && (
        <p className="text-center text-text-secondary">Este evento ya no existe.</p>
      )}

      {event && <EventCard event={event} />}

      <Link href="/" className="mt-8 text-center text-sm font-bold text-accent-cyan underline">
        Ver todos los eventos
      </Link>
    </main>
  );
}
