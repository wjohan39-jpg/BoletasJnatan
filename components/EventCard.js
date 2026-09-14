import Image from 'next/image';

const WHATSAPP_NUMBER = '573057860229';

function whatsappLink(title) {
  const message = `Hola! Quiero comprar mi boleta para ${title}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function formatDate(date) {
  const d = date?.toDate ? date.toDate() : new Date(date);
  return new Intl.DateTimeFormat('es-CO', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  }).format(d);
}

function formatPrice(price) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
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

        <div className="mt-4 flex justify-center rounded-[20px] bg-white p-4 shadow-[0_18px_40px_-10px_rgba(11,60,255,0.55)]">
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

        <a
          href={whatsappLink(event.title)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-[#25D366]/40 bg-[#25D366]/10 py-3 text-[13px] font-extrabold text-[#25D366]"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 4.99L2 22l5.2-1.36a9.94 9.94 0 0 0 4.84 1.23h.01c5.5 0 9.96-4.46 9.96-9.96S17.55 2 12.04 2Zm5.82 14.14c-.25.7-1.24 1.28-2.03 1.45-.55.12-1.26.21-3.67-.78-3.08-1.27-5.06-4.37-5.21-4.57-.15-.2-1.24-1.65-1.24-3.15s.78-2.23 1.06-2.53c.28-.3.6-.38.8-.38.2 0 .4 0 .58.01.19.01.44-.07.68.53.25.6.85 2.07.92 2.22.07.15.12.33.02.53-.1.2-.15.33-.3.5-.15.18-.31.4-.44.53-.15.15-.3.31-.13.6.17.3.76 1.26 1.64 2.04 1.13.99 2.08 1.3 2.38 1.45.3.15.47.13.65-.08.17-.2.74-.86.94-1.16.2-.3.4-.25.66-.15.27.1 1.72.81 2.02.96.3.15.5.22.57.35.07.13.07.75-.18 1.45Z" />
          </svg>
          Escríbeme por WhatsApp
        </a>
      </div>
    </div>
  );
}
