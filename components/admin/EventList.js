'use client';

import Image from 'next/image';

function formatDate(date) {
  const d = date?.toDate ? date.toDate() : new Date(date);
  return new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }).format(d);
}

function formatPrice(price) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(price);
}

function isPast(date) {
  const d = date?.toDate ? date.toDate() : new Date(date);
  return d.getTime() < Date.now();
}

export default function EventList({ events, onEdit, onDelete }) {
  return (
    <div>
      <h2 className="font-display text-lg font-bold text-text-primary">Eventos</h2>
      <div className="mt-4 flex flex-col gap-3">
        {events.length === 0 && (
          <p className="text-sm text-text-secondary">Todavía no hay eventos publicados.</p>
        )}
        {events.map((event) => {
          const past = isPast(event.eventDate);
          return (
            <div
              key={event.id}
              className={`flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-card px-4 py-3.5 ${past ? 'opacity-55' : ''}`}
            >
              <div className="flex min-w-0 items-center gap-3.5">
                <Image
                  src={event.qrImageData}
                  alt=""
                  width={44}
                  height={44}
                  unoptimized
                  className="h-11 w-11 flex-shrink-0 rounded-lg bg-white object-contain p-0.5"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold text-text-primary">{event.title}</p>
                  <p className="truncate text-xs text-text-secondary">
                    {formatDate(event.eventDate)} · {event.location}
                  </p>
                </div>
              </div>

              <span
                className={`flex-shrink-0 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide ${
                  past ? 'bg-white/5 text-text-secondary' : 'bg-accent-cyan/15 text-accent-cyan'
                }`}
              >
                {past ? 'Pasado' : 'Activo'}
              </span>

              <span className="flex-shrink-0 font-display text-sm font-bold text-text-primary">
                {formatPrice(event.price)}
              </span>

              <div className="flex flex-shrink-0 gap-2">
                <button
                  onClick={() => onEdit(event)}
                  aria-label="Editar"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-text-primary"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(event)}
                  aria-label="Eliminar"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-red-400"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18" />
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
