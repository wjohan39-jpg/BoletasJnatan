'use client';

import { useState } from 'react';
import Image from 'next/image';
import { readQrImageFile } from '@/lib/qrImage';

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
  const [qrImageData, setQrImageData] = useState(initialEvent?.qrImageData ?? null);
  const [qrError, setQrError] = useState('');

  const isEditing = Boolean(initialEvent);

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setQrError('');
    try {
      const dataUrl = await readQrImageFile(file);
      setQrImageData(dataUrl);
    } catch (err) {
      setQrError(err.message);
      setQrImageData(null);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!qrImageData) {
      setQrError('Sube la imagen del QR.');
      return;
    }
    await onSubmit({
      title,
      eventDate: new Date(eventDate),
      location,
      price: Number(price),
      qrImageData,
    });
    setTitle('');
    setEventDate('');
    setLocation('');
    setPrice('');
    setQrImageData(null);
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
          {qrImageData ? (
            <Image
              src={qrImageData}
              alt="Vista previa del QR"
              width={96}
              height={96}
              unoptimized
              className="h-24 w-24 rounded-lg bg-white object-contain p-1"
            />
          ) : (
            <span className="text-[12.5px] text-text-secondary">Haz clic para subir la imagen del QR</span>
          )}
          <span className="text-[10.5px] text-text-secondary/60">
            {qrImageData ? 'Haz clic para cambiarla' : 'PNG o JPG, menos de 600 KB'}
          </span>
          <input
            type="file"
            accept="image/png,image/jpeg"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
        {qrError && <p className="text-sm text-red-400">{qrError}</p>}

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

        <div>
          <p className="mb-1.5 text-[10.5px] font-extrabold uppercase tracking-wide text-text-secondary">
            Fecha y hora
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
            placeholder="Digita la ubicación"
            className="w-full rounded-lg border border-white/10 bg-white/[0.045] px-3.5 py-2.5 text-sm text-text-primary outline-none focus:border-accent-cyan"
          />
        </div>

        <div>
          <p className="mb-1.5 text-[10.5px] font-extrabold uppercase tracking-wide text-text-secondary">
            Precio (COP)
          </p>
          <input
            type="number"
            required
            min="0"
            step="1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="150000"
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
