import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
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

export async function getEventById(id) {
  const snap = await getDoc(doc(db, 'events', id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function createEvent({ title, eventDate, location, price, qrImageData }) {
  await addDoc(eventsRef(), {
    title,
    eventDate: Timestamp.fromDate(eventDate),
    location,
    price,
    qrImageData,
    soldOut: false,
    createdAt: Timestamp.now(),
  });
}

export async function updateEvent(id, { title, eventDate, location, price, qrImageData }) {
  await updateDoc(doc(db, 'events', id), {
    title,
    eventDate: Timestamp.fromDate(eventDate),
    location,
    price,
    qrImageData,
  });
}

export async function setSoldOut(id, soldOut) {
  await updateDoc(doc(db, 'events', id), { soldOut });
}

export async function deleteEvent(id) {
  await deleteDoc(doc(db, 'events', id));
}
