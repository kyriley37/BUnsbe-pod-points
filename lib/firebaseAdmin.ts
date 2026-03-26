import admin from "firebase-admin";
import fs from "fs";
import path from "path";

let _adminDb: admin.firestore.Firestore | null = null;

function loadServiceAccount() {
  // Production: full JSON stored in env var
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  }

  // Local dev: path to JSON file
  const rel = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (!rel) {
    throw new Error(
      "Missing FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_SERVICE_ACCOUNT_PATH env var"
    );
  }

  const fullPath = path.isAbsolute(rel) ? rel : path.join(process.cwd(), rel);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing service account file at ${fullPath}`);
  }

  return JSON.parse(fs.readFileSync(fullPath, "utf8"));
}

export function getAdminDb() {
  if (_adminDb) return _adminDb;

  const serviceAccount = loadServiceAccount();

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  _adminDb = admin.firestore();
  return _adminDb;
}

// Verify Firebase Auth ID token (server-side)
export async function verifyIdToken(idToken: string) {
  // ensures admin is initialized
  getAdminDb();
  return admin.auth().verifyIdToken(idToken);
}

