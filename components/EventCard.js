import Image from 'next/image';

function formatDate(date) {
  const d = date?.toDate ? date.toDate() : new Date(date);
  return new Intl.DateTimeFormat('es-MX', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  }).format(d);
}

function formatPrice(price) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(price);
}

export default function EventCard({ event }) {
  return (
    <div className="rounded-[26px] bg-gradient-to-br from-accent-purple via-accent-magenta to-accent-cyan p-[1.5px]">
      <div className="rounded-[24.5px] bg-cardInner px-5 py-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-cyan/15 px-3 py-1.5 text-[10.5px] font-extrabold uppercase tracking-widest text-accent-cyan">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-cyan shadow-[0_0_8px_theme(colors.accent.cyan)]" />
          Próximo evento
        </span>

        <h2 className="mt-3 font-display text-xl font-extrabold leading-tight text-text-primary">
          {event.title}
        </h2>

        <div className="mt-4 flex justify-center rounded-[20px] bg-white p-4 shadow-[0_18px_40px_-10px_rgba(176,38,255,0.55)]">
          <Image
            src={event.qrImageData}
            alt={`Código QR para comprar boletas de ${event.title}`}
            width={240}
            height={240}
            unoptimized
            className="h-auto w-full max-w-[240px]"
          />
        </div>

        <p className="mt-4 text-center text-[12.5px] font-extrabold uppercase tracking-wide text-text-primary">
          Escanea para comprar tu boleta
        </p>

        <div className="mt-4 flex flex-col gap-2 text-[13.5px] text-text-secondary">
          <span>{formatDate(event.eventDate)}</span>
          <span>{event.location}</span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wide text-text-secondary">
            Desde
          </span>
          <span className="rounded-[13px] bg-gradient-to-r from-accent-magenta/55 to-accent-purple/55 px-4 py-2 font-display text-[17px] font-bold text-white">
            {formatPrice(event.price)}
          </span>
        </div>
      </div>
    </div>
  );
}
