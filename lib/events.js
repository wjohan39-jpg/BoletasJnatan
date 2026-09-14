import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

// Built lazily (not at module scope) so this module can be imported during
// a server-side render — where `db` is null, see lib/firebase.js — without
// throwing; these functions only ever actually run in the browser.
function eventsRef() {
  return collection(db, 'events');
}

export async function getUpcomingEvents() {
  const now = Timestamp.now();
  const q = query(eventsRef(), where('eventDate', '>=', now), orderBy('eventDate', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getAllEvents() {
  const q = query(eventsRef(), orderBy('eventDate', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function createEvent({ title, eventDate, location, price, qrImageUrl, qrImagePath }) {
  await addDoc(eventsRef(), {
    title,
    eventDate: Timestamp.fromDate(eventDate),
    location,
    price,
    qrImageUrl,
    qrImagePath,
    createdAt: Timestamp.now(),
  });
}

export async function updateEvent(id, { title, eventDate, location, price, qrImageUrl, qrImagePath }) {
  await updateDoc(doc(db, 'events', id), {
    title,
    eventDate: Timestamp.fromDate(eventDate),
    location,
    price,
    qrImageUrl,
    qrImagePath,
  });
}

export async function deleteEvent(id) {
  await deleteDoc(doc(db, 'events', id));
}
