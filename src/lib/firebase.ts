import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// ⚠️ IMPORTANTE: El administrador debe reemplazar esto con las credenciales de su proyecto Firebase
const firebaseConfig = {
  apiKey: "API_KEY_PLACEHOLDER",
  authDomain: "PROJECT_ID.firebaseapp.com",
  databaseURL: "https://PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "PROJECT_ID",
  storageBucket: "PROJECT_ID.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
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
