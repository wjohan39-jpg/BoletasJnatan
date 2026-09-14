'use client';

import { useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getAllEvents, createEvent, updateEvent, deleteEvent } from '@/lib/events';
import { uploadQrImage, deleteQrImage } from '@/lib/qrImages';
import LoginForm from '@/components/admin/LoginForm';
import EventForm from '@/components/admin/EventForm';
import EventList from '@/components/admin/EventList';

export default function AdminPage() {
  const [user, setUser] = useState(undefined);
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [listError, setListError] = useState(false);

  useEffect(() => {
    if (!auth) {
      setUser(null);
      return;
    }
    return onAuthStateChanged(auth, setUser);
  }, []);

  const refreshEvents = useCallback(async () => {
    try {
      const data = await getAllEvents();
      setEvents(data);
      setListError(false);
    } catch {
      setListError(true);
    }
  }, []);

  useEffect(() => {
    if (user) refreshEvents();
  }, [user, refreshEvents]);

  async function handleSubmit({ title, eventDate, location, price, qrFile }) {
    setSubmitting(true);
    try {
      if (editingEvent) {
        let { qrImageUrl, qrImagePath } = editingEvent;
        if (qrFile) {
          await deleteQrImage(editingEvent.qrImagePath);
          ({ qrImageUrl, qrImagePath } = await uploadQrImage(qrFile));
        }
        await updateEvent(editingEvent.id, { title, eventDate, location, price, qrImageUrl, qrImagePath });
      } else {
        const { qrImageUrl, qrImagePath } = await uploadQrImage(qrFile);
        await createEvent({ title, eventDate, location, price, qrImageUrl, qrImagePath });
      }
      setEditingEvent(null);
      await refreshEvents();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(event) {
    if (!window.confirm(`¿Eliminar "${event.title}"? Esta acción no se puede deshacer.`)) return;
    await deleteEvent(event.id);
    await deleteQrImage(event.qrImagePath);
    await refreshEvents();
  }

  if (user === undefined) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-text-secondary">Cargando…</p>
      </main>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <span className="bg-gradient-to-r from-accent-purple to-accent-cyan bg-clip-text font-display text-lg font-extrabold text-transparent">
            Boletas [Nombre]
          </span>
          <span className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-text-secondary">
            Panel Admin
          </span>
        </div>
        <button
          onClick={() => signOut(auth)}
          className="rounded-lg border border-white/15 px-4 py-2 text-sm font-bold text-text-primary"
        >
          Cerrar sesión
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[400px_1fr]">
        <EventForm
          key={editingEvent?.id ?? 'new'}
          initialEvent={editingEvent}
          submitting={submitting}
          onSubmit={handleSubmit}
          onCancelEdit={() => setEditingEvent(null)}
        />
        {listError ? (
          <p className="text-sm text-text-secondary">No se pudo cargar la lista de eventos.</p>
        ) : (
          <EventList events={events} onEdit={setEditingEvent} onDelete={handleDelete} />
        )}
      </div>
    </main>
  );
}
