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

// This app only ever reads/writes Firebase from the browser (see
// docs/superpowers/specs — client-SDK-only architecture). Initializing only
// in the browser means a server-side render (including `next build`'s
// prerender pass) never calls Firebase with build-time env vars that may be
// missing, instead of throwing on an incomplete/invalid config.
const app =
  typeof window !== 'undefined'
    ? getApps().length
      ? getApp()
      : initializeApp(firebaseConfig)
    : null;

export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;
export const auth = app ? getAuth(app) : null;
