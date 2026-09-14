'use client';

import { useState } from 'react';

function toDatetimeLocalValue(date) {
  if (!date) return '';
  const d = date?.toDate ? date.toDate() : new Date(date);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function EventForm({ initialEvent, submitting, onSubmit, onCancelEdit }) {
  const [title, setTitle] = useState(initialEvent?.title ?? '');
  const [eventDate, setEventDate] = useState(toDatetimeLocalValue(initialEvent?.eventDate));
  const [location, setLocation] = useState(initialEvent?.location ?? '');
  const [price, setPrice] = useState(initialEvent?.price ?? '');
  const [qrFile, setQrFile] = useState(null);

  const isEditing = Boolean(initialEvent);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isEditing && !qrFile) {
      window.alert('Sube la imagen del QR.');
      return;
    }
    await onSubmit({
      title,
      eventDate: new Date(eventDate),
      location,
      price: Number(price),
      qrFile,
    });
    setTitle('');
    setEventDate('');
    setLocation('');
    setPrice('');
    setQrFile(null);
  }

  return (
    <div className="rounded-[20px] border border-white/10 bg-card p-6">
      <h2 className="font-display text-lg font-bold text-text-primary">
        {isEditing ? 'Editar evento' : 'Publicar nuevo evento'}
      </h2>
      <p className="mt-1.5 text-sm text-text-secondary">
        {isEditing ? 'Actualiza los datos o reemplaza el QR' : 'Sube el QR que te compartió el proveedor'}
      </p>

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3.5">
        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-accent-cyan/40 bg-white/[0.02] px-4 py-6 text-center">
          <span className="text-[12.5px] text-text-secondary">
            {qrFile ? qrFile.name : 'Haz clic para subir la imagen del QR'}
          </span>
          <span className="text-[10.5px] text-text-secondary/60">PNG o JPG</span>
          <input
            type="file"
            accept="image/png,image/jpeg"
            className="hidden"
            onChange={(e) => setQrFile(e.target.files?.[0] ?? null)}
          />
        </label>

        <div>
          <p className="mb-1.5 text-[10.5px] font-extrabold uppercase tracking-wide text-text-secondary">
            Nombre del evento
          </p>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej. Bad Bunny — Most Wanted Tour"
            className="w-full rounded-lg border border-white/10 bg-white/[0.045] px-3.5 py-2.5 text-sm text-text-primary outline-none focus:border-accent-cyan"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="mb-1.5 text-[10.5px] font-extrabold uppercase tracking-wide text-text-secondary">
              Fecha
            </p>
            <input
              type="datetime-local"
              required
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/[0.045] px-3.5 py-2.5 text-sm text-text-primary outline-none focus:border-accent-cyan"
            />
          </div>
          <div>
            <p className="mb-1.5 text-[10.5px] font-extrabold uppercase tracking-wide text-text-secondary">
              Lugar
            </p>
            <input
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Explanada GNP"
              className="w-full rounded-lg border border-white/10 bg-white/[0.045] px-3.5 py-2.5 text-sm text-text-primary outline-none focus:border-accent-cyan"
            />
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-[10.5px] font-extrabold uppercase tracking-wide text-text-secondary">
            Precio (MXN)
          </p>
          <input
            type="number"
            required
            min="0"
            step="1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="1450"
            className="w-full rounded-lg border border-white/10 bg-white/[0.045] px-3.5 py-2.5 text-sm text-text-primary outline-none focus:border-accent-cyan"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-1 rounded-xl bg-gradient-to-r from-accent-purple to-accent-magenta py-3.5 font-display font-bold text-white disabled:opacity-60"
        >
          {submitting ? 'Guardando…' : isEditing ? 'Guardar cambios' : 'Publicar evento'}
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-sm font-bold text-text-secondary underline"
          >
            Cancelar edición
          </button>
        )}
      </form>
    </div>
  );
}
