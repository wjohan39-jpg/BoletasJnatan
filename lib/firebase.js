import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// This app only ever reads/writes Firebase from the browser (see
// docs/superpowers/specs — client-SDK-only architecture), so it never
// initializes on the server. It's also wrapped in try/catch: Firebase throws
// synchronously (not a rejected promise) when the config is missing or
// malformed — e.g. before `.env.local` is filled in — and an uncaught throw
// at module scope crashes the whole page instead of hitting any of the
// try/catch blocks in the components that call db/auth. Every caller
// already handles a null value gracefully (loading/error states, a failed
// login), so falling back to null here is safe.
function initFirebase() {
  if (typeof window === 'undefined') {
    return { db: null, auth: null };
  }
  try {
    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    return { db: getFirestore(app), auth: getAuth(app) };
  } catch {
    return { db: null, auth: null };
  }
}

export const { db, auth } = initFirebase();
