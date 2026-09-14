# Boletas de Concierto — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Next.js 14 app where a concert-ticket reseller publishes QR codes to a public mobile-first feed and manages them from a password-protected admin panel, replacing their current Instagram/Facebook posting workflow.

**Architecture:** Single Next.js App Router project, JavaScript only, Tailwind CSS for styling. All Firebase access happens from the browser via the Firebase JS SDK (Firestore + Storage + Auth) — no Firebase Admin SDK, no API routes. Firestore/Storage security rules enforce that only an authenticated user can write; anyone can read. The public page (`/`) and admin panel (`/admin`) are both Client Components since they call the Firebase client SDK directly.

**Tech Stack:** Next.js 14 (App Router, JS), React 18, Firebase JS SDK v10 (firestore, storage, auth), Tailwind CSS 3, deployed on Vercel.

**Spec:** `docs/superpowers/specs/2026-09-14-boletas-ticket-app-design.md`

## Global Constraints

- JavaScript only — no TypeScript, no `.ts`/`.tsx` files.
- Firebase config comes only from `NEXT_PUBLIC_FIREBASE_*` env vars — never hardcode credentials.
- No Firebase Admin SDK, no custom API routes/server actions — all reads/writes go through the client SDK directly, per the approved design.
- No automated test framework (Jest/Vitest/emulators) — out of scope per the spec's explicit "no extra features" instruction. Verification is `npm run build` (catches syntax/import errors) plus manual checks with the dev server running, per the project's standing instruction to verify UI changes in a real browser before calling them done. Task 9 covers the full manual walkthrough.
- Visual system is fixed by the approved mockup: background `#0a0a0f`, cards `#14121c`/`#120f19`, accents purple `#b026ff` / magenta `#ff2ec4` / cyan `#21e6e6`, text primary `#f6f3f9` / secondary `#8b8399`, display font "Unbounded" (700/800), body font "Manrope" (400–800).
- Past events (`eventDate` earlier than now) are excluded from the public feed by query filter, never deleted from Firestore.
- Path alias `@/*` resolves to the project root (configured via `jsconfig.json`) — used in all imports below.

---

### Task 1: Project scaffold, Tailwind design tokens, root layout

**Files:**
- Create: `package.json`
- Create: `next.config.js`
- Create: `jsconfig.json`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `.gitignore`
- Create: `app/globals.css`
- Create: `app/layout.js`
- Create: `app/page.js` (temporary placeholder, replaced in Task 5)

**Interfaces:**
- Produces: Tailwind color tokens `bg`, `card`, `cardInner`, `accent.purple`, `accent.magenta`, `accent.cyan`, `text.primary`, `text.secondary`; font families `font-display` (Unbounded) and `font-body` (Manrope), available to every later task via Tailwind classes.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "boletas-jsg",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "firebase": "^10.13.0",
    "next": "14.2.5",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.19",
    "eslint": "^8.57.0",
    "eslint-config-next": "14.2.5",
    "postcss": "^8.4.39",
    "tailwindcss": "^3.4.4"
  }
}
```

- [ ] **Step 2: Create `next.config.js`**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
    ],
  },
};

module.exports = nextConfig;
```

- [ ] **Step 3: Create `jsconfig.json`**

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

- [ ] **Step 4: Create `tailwind.config.js`**

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0f',
        card: '#14121c',
        cardInner: '#120f19',
        accent: {
          purple: '#b026ff',
          magenta: '#ff2ec4',
          cyan: '#21e6e6',
        },
        text: {
          primary: '#f6f3f9',
          secondary: '#8b8399',
        },
      },
      fontFamily: {
        display: ['var(--font-unbounded)', 'sans-serif'],
        body: ['var(--font-manrope)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 5: Create `postcss.config.js`**

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 6: Create `.gitignore`**

```
node_modules
.next
.env.local
.DS_Store
```

- [ ] **Step 7: Create `app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  -webkit-font-smoothing: antialiased;
}
```

- [ ] **Step 8: Create `app/layout.js`**

```jsx
import { Unbounded, Manrope } from 'next/font/google';
import './globals.css';

const unbounded = Unbounded({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-unbounded',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-manrope',
});

export const metadata = {
  title: 'Boletas [Nombre]',
  description: 'Compra tu boleta escaneando el QR',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${unbounded.variable} ${manrope.variable}`}>
      <body className="min-h-screen bg-bg font-body text-text-primary">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 9: Create temporary `app/page.js`**

```jsx
export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <p className="font-display text-2xl font-bold text-text-primary">
        Boletas [Nombre]
      </p>
    </main>
  );
}
```

- [ ] **Step 10: Install dependencies and verify the dev server boots**

Run: `npm install`
Then run: `npm run dev`
Expected: server starts on `http://localhost:3000`; opening it in a browser shows a dark page with the bold "Boletas [Nombre]" placeholder text centered, no console errors. Stop the dev server (Ctrl+C) after confirming.

- [ ] **Step 11: Commit**

```bash
git add package.json next.config.js jsconfig.json tailwind.config.js postcss.config.js .gitignore app/globals.css app/layout.js app/page.js package-lock.json
git commit -m "Scaffold Next.js + Tailwind project with design tokens"
```

---

### Task 2: Firebase client initialization

**Files:**
- Create: `lib/firebase.js`
- Create: `.env.local.example`

**Interfaces:**
- Produces: `db` (Firestore instance), `storage` (Storage instance), `auth` (Auth instance) exported from `@/lib/firebase`, consumed by Tasks 4, 6, 7.

- [ ] **Step 1: Create `lib/firebase.js`**

```js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
```

- [ ] **Step 2: Create `.env.local.example`**

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

- [ ] **Step 3: Verify the build still succeeds**

Run: `npm run build`
Expected: build completes without errors (the placeholder page doesn't import `lib/firebase.js` yet, so this just confirms no syntax errors were introduced).

- [ ] **Step 4: Commit**

```bash
git add lib/firebase.js .env.local.example
git commit -m "Add Firebase client initialization module"
```

---

### Task 3: Firestore and Storage security rules

**Files:**
- Create: `firestore.rules`
- Create: `storage.rules`

**Interfaces:**
- Produces: rule files the user pastes into Firebase Console (referenced by README in Task 8). No code dependency on other tasks.

- [ ] **Step 1: Create `firestore.rules`**

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /events/{eventId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

- [ ] **Step 2: Create `storage.rules`**

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /qr-codes/{fileName} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

- [ ] **Step 3: Verify**

Read both files back and confirm: `events` reads are `if true`, all writes require `request.auth != null`, and the storage path matches the `qr-codes/` prefix used by `uploadQrImage` in Task 4.

- [ ] **Step 4: Commit**

```bash
git add firestore.rules storage.rules
git commit -m "Add Firestore and Storage security rules"
```

---

### Task 4: Firestore events data layer + Storage QR helpers

**Files:**
- Create: `lib/events.js`
- Create: `lib/qrImages.js`

**Interfaces:**
- Consumes: `db` from `@/lib/firebase` (Task 2), `storage` from `@/lib/firebase` (Task 2).
- Produces:
  - `getUpcomingEvents(): Promise<Array<{id, title, eventDate, location, price, qrImageUrl, qrImagePath, createdAt}>>`
  - `getAllEvents(): Promise<Array<{...same shape}>>`
  - `createEvent({title, eventDate: Date, location, price: number, qrImageUrl, qrImagePath}): Promise<void>`
  - `updateEvent(id, {title, eventDate: Date, location, price: number, qrImageUrl, qrImagePath}): Promise<void>`
  - `deleteEvent(id): Promise<void>`
  - `uploadQrImage(file: File): Promise<{qrImageUrl: string, qrImagePath: string}>`
  - `deleteQrImage(path: string): Promise<void>`
  These are consumed by Task 5 (public feed) and Task 7 (admin CRUD).

- [ ] **Step 1: Create `lib/events.js`**

```js
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

const eventsRef = collection(db, 'events');

export async function getUpcomingEvents() {
  const now = Timestamp.now();
  const q = query(eventsRef, where('eventDate', '>=', now), orderBy('eventDate', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getAllEvents() {
  const q = query(eventsRef, orderBy('eventDate', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function createEvent({ title, eventDate, location, price, qrImageUrl, qrImagePath }) {
  await addDoc(eventsRef, {
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
```

- [ ] **Step 2: Create `lib/qrImages.js`**

```js
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

export async function uploadQrImage(file) {
  const path = `qr-codes/${Date.now()}-${file.name}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  const qrImageUrl = await getDownloadURL(storageRef);
  return { qrImageUrl, qrImagePath: path };
}

export async function deleteQrImage(path) {
  if (!path) return;
  const storageRef = ref(storage, path);
  await deleteObject(storageRef).catch(() => {});
}
```

`deleteQrImage` swallows errors because it's called during delete/replace flows where the file may already be gone — the Firestore write is the source of truth, not the storage cleanup.

- [ ] **Step 3: Verify the build still succeeds**

Run: `npm run build`
Expected: build completes without errors (nothing imports these modules yet, this just confirms valid syntax and imports).

- [ ] **Step 4: Commit**

```bash
git add lib/events.js lib/qrImages.js
git commit -m "Add Firestore events data layer and Storage QR helpers"
```

---

### Task 5: EventCard component + public feed page

**Files:**
- Create: `components/EventCard.js`
- Modify: `app/page.js` (replace Task 1's placeholder)

**Interfaces:**
- Consumes: `getUpcomingEvents` from `@/lib/events` (Task 4).
- Produces: `EventCard` component (props: `{event}`), used only here for now.

- [ ] **Step 1: Create `components/EventCard.js`**

```jsx
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
            src={event.qrImageUrl}
            alt={`Código QR para comprar boletas de ${event.title}`}
            width={240}
            height={240}
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
```

- [ ] **Step 2: Replace `app/page.js`**

```jsx
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
```

- [ ] **Step 3: Verify in the browser**

Run: `npm run dev`, open `http://localhost:3000`.
Expected (without real Firebase env vars yet, `getUpcomingEvents()` will reject): page shows the gradient wordmark header, then "No se pudieron cargar los eventos..." message, no crash, no red error overlay. This confirms the page renders and handles the no-config case gracefully. (Full data verification happens in Task 9 once `.env.local` is filled.)

- [ ] **Step 4: Commit**

```bash
git add components/EventCard.js app/page.js
git commit -m "Add EventCard component and public events feed"
```

---

### Task 6: Admin auth guard — login, logout, dashboard shell

**Files:**
- Create: `components/admin/LoginForm.js`
- Create: `app/admin/page.js`

**Interfaces:**
- Consumes: `auth` from `@/lib/firebase` (Task 2).
- Produces: `app/admin/page.js` renders `LoginForm` when signed out; Task 7 replaces the dashboard body (currently a placeholder) with the real form/list.

- [ ] **Step 1: Create `components/admin/LoginForm.js`**

```jsx
'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setError('Correo o contraseña incorrectos.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <h1 className="font-display text-2xl font-extrabold text-text-primary">Panel Admin</h1>
      <p className="mt-1 text-sm text-text-secondary">Inicia sesión para continuar</p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wide text-text-secondary">
            Correo
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-text-primary outline-none focus:border-accent-cyan"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wide text-text-secondary">
            Contraseña
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-text-primary outline-none focus:border-accent-cyan"
          />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-xl bg-gradient-to-r from-accent-purple to-accent-magenta px-4 py-3.5 font-display font-bold text-white disabled:opacity-60"
        >
          {submitting ? 'Entrando…' : 'Iniciar sesión'}
        </button>
      </form>
    </main>
  );
}
```

- [ ] **Step 2: Create `app/admin/page.js`**

```jsx
'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import LoginForm from '@/components/admin/LoginForm';

export default function AdminPage() {
  const [user, setUser] = useState(undefined);

  useEffect(() => onAuthStateChanged(auth, setUser), []);

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

      <p className="text-text-secondary">Dashboard en construcción.</p>
    </main>
  );
}
```

- [ ] **Step 3: Verify in the browser**

Run: `npm run dev`, open `http://localhost:3000/admin`.
Expected: since there's no session and no Firebase config yet, the page briefly shows "Cargando…" then the login form (dark card, "Panel Admin" heading, correo/contraseña fields, gradient "Iniciar sesión" button). Submitting with any credentials shows "Correo o contraseña incorrectos." without crashing (Firebase Auth call fails gracefully because there's no real project yet). This confirms the auth guard renders correctly; real login is verified in Task 9 once `.env.local` has real credentials and a user exists.

- [ ] **Step 4: Commit**

```bash
git add components/admin/LoginForm.js app/admin/page.js
git commit -m "Add admin auth guard with login/logout"
```

---

### Task 7: Event form + event list — full admin CRUD

**Files:**
- Create: `components/admin/EventForm.js`
- Create: `components/admin/EventList.js`
- Modify: `app/admin/page.js` (replace the "Dashboard en construcción" placeholder from Task 6)

**Interfaces:**
- Consumes: `getAllEvents`, `createEvent`, `updateEvent`, `deleteEvent` from `@/lib/events` (Task 4); `uploadQrImage`, `deleteQrImage` from `@/lib/qrImages` (Task 4).
- Produces: `EventForm` (props: `{initialEvent, submitting, onSubmit, onCancelEdit}`, calls `onSubmit({title, eventDate: Date, location, price: number, qrFile: File|null})`), `EventList` (props: `{events, onEdit, onDelete}`).

- [ ] **Step 1: Create `components/admin/EventForm.js`**

```jsx
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
```

- [ ] **Step 2: Create `components/admin/EventList.js`**

```jsx
'use client';

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
                <img
                  src={event.qrImageUrl}
                  alt=""
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
```

- [ ] **Step 3: Replace the dashboard body in `app/admin/page.js`**

```jsx
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

  useEffect(() => onAuthStateChanged(auth, setUser), []);

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
```

- [ ] **Step 4: Verify in the browser**

Run: `npm run dev`, open `http://localhost:3000/admin`.
Expected: after the (failing, since no real Firebase project yet) login attempt from Task 6's check, confirm the page still shows the login form without crashing, and that the dashboard layout (form + list side by side on desktop width) would render once authenticated — inspect by temporarily confirming no console errors on page load. Full authenticated CRUD verification happens in Task 9 with real Firebase credentials.

- [ ] **Step 5: Commit**

```bash
git add components/admin/EventForm.js components/admin/EventList.js app/admin/page.js
git commit -m "Add event form and event list with full admin CRUD wiring"
```

---

### Task 8: README with Firebase + deploy setup steps

**Files:**
- Create: `README.md`

**Interfaces:**
- None — documentation only.

- [ ] **Step 1: Create `README.md`**

```markdown
# Boletas [Nombre]

App para publicar códigos QR de boletos de concierto en una página propia,
en lugar de subirlos como post a Instagram/Facebook. Incluye una página
pública con el feed de eventos y un panel admin para publicarlos.

## Requisitos

- Node.js 18.17 o superior
- Una cuenta de Firebase (gratuita) y una cuenta de Vercel (gratuita)

## 1. Crear el proyecto en Firebase Console

1. Ve a [console.firebase.google.com](https://console.firebase.google.com) y crea un proyecto nuevo.
2. **Firestore Database** → Crear base de datos → modo producción → elige una región.
3. **Storage** → Comenzar → modo producción → misma región.
4. **Authentication** → Sign-in method → habilita **Correo electrónico/contraseña**.
5. En **Configuración del proyecto → General → Tus apps**, crea una app web (ícono `</>`) y copia el objeto `firebaseConfig` — lo usarás en el paso 4.

## 2. Crear el usuario admin

En **Authentication → Users → Add user**, crea el único usuario admin con el correo y contraseña que usará el vendedor para entrar a `/admin`.

## 3. Pegar las reglas de seguridad

- En **Firestore Database → Reglas**, reemplaza el contenido con el de `firestore.rules` (en la raíz de este repo) y publica.
- En **Storage → Reglas**, reemplaza el contenido con el de `storage.rules` y publica.

## 4. Configurar variables de entorno

```bash
cp .env.local.example .env.local
```

Llena `.env.local` con los valores del `firebaseConfig` del paso 1:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## 5. Correr en local

```bash
npm install
npm run dev
```

- Página pública: [http://localhost:3000](http://localhost:3000)
- Panel admin: [http://localhost:3000/admin](http://localhost:3000/admin)

## 6. Subir a GitHub y desplegar en Vercel

```bash
git remote add origin <url-de-tu-repo>
git push -u origin main
```

1. En [vercel.com](https://vercel.com), importa el repo de GitHub.
2. En **Environment Variables**, agrega las mismas 6 variables `NEXT_PUBLIC_FIREBASE_*` del paso 4 con sus valores reales.
3. Despliega. Cada `git push` a `main` vuelve a desplegar automáticamente.

## Cambiar el nombre del negocio

El placeholder "Boletas [Nombre]" aparece en `app/page.js`, `app/layout.js`
(metadata) y `app/admin/page.js` — reemplázalo por el nombre real del
negocio en esos tres archivos.
```

- [ ] **Step 2: Verify**

Read `README.md` back and confirm all 6 numbered sections are present and the commands match the actual file paths created in Tasks 1–7 (`firestore.rules`, `storage.rules`, `.env.local.example`).

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "Add README with Firebase and Vercel setup instructions"
```

---

### Task 9: Final verification pass

**Files:** none created — this task only runs checks.

**Interfaces:** none.

- [ ] **Step 1: Run a clean build**

Run: `npm run build`
Expected: build succeeds with no errors. Note any warnings for review, but they must not be errors.

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: no errors (Next.js's default ESLint config). Fix anything it flags.

- [ ] **Step 3: Manual browser walkthrough (requires real Firebase config)**

If `.env.local` has been filled with real Firebase project values and an admin user exists (README steps 1–4):

Run: `npm run dev`
1. Open `http://localhost:3000/admin`, log in with the admin user — confirm it reaches the dashboard (not stuck on "Cargando…" or the login form).
2. Publish a test event: upload any PNG/JPG as the "QR", fill title/fecha/lugar/precio, submit. Confirm it appears in the "Eventos" list on the right with an "Activo" badge.
3. Open `http://localhost:3000` in a new tab (or incognito, to confirm it works signed out). Confirm the test event appears as a card with the QR image, title, date/location, price, and "Escanea para comprar tu boleta".
4. Back in `/admin`, click edit on the test event, change the price, submit. Confirm the public page reflects the new price after a refresh.
5. Click delete on the test event, confirm the browser confirm dialog, confirm it disappears from both the admin list and the public page after refresh.
6. Create one more test event with a date in the past. Confirm it shows in the admin list with a "Pasado" badge and dimmed, but does NOT appear on the public page.
7. Click "Cerrar sesión", confirm it returns to the login form and `/admin` cannot be accessed without logging in again.
8. Resize the browser to a phone width (~390px) for both `/` and `/admin` and confirm no horizontal scrolling, text stays readable, and buttons are easily tappable.

If `.env.local` is still empty at this point in the plan's execution, skip this step and tell the user explicitly which of the above they still need to verify themselves once they've completed the Firebase setup in the README — do not claim the app works end-to-end without having run this checklist.

- [ ] **Step 4: Commit any fixes from Steps 1–3**

```bash
git add -A
git commit -m "Fix issues found in final verification pass"
```

Skip this commit if nothing needed fixing.
