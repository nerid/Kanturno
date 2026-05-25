import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// ⚠️ Credenciales añadidas automáticamente
const firebaseConfig = {
  apiKey: "AIzaSyAzoxT6OgNHrtFuD6cZtOuGiTsfBq27GH8",
  authDomain: "kanturno.firebaseapp.com",
  databaseURL: "https://kanturno-default-rtdb.firebaseio.com",
  projectId: "kanturno",
  storageBucket: "kanturno.firebasestorage.app",
  messagingSenderId: "769477433569",
  appId: "1:769477433569:web:0234280a651141658fffa0",
  measurementId: "G-1Q2G4Q82WP"
};

import type { FirebaseApp } from 'firebase/app';
import type { Database } from 'firebase/database';
import type { Auth } from 'firebase/auth';

let app: FirebaseApp | undefined;
let db: Database | undefined;
let auth: Auth | undefined;

try {
  app = initializeApp(firebaseConfig);
  db = getDatabase(app);
  auth = getAuth(app);
} catch (error) {
  console.warn("Firebase no está configurado. La app funcionará de modo estático hasta que se agreguen las credenciales en src/lib/firebase.ts");
}

export { db, auth };
