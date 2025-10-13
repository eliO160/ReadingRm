// ESM style (your server already uses `import`):
import * as admin from "firebase-admin";

/**
 * Initialize Firebase Admin exactly once and export helpers.
 * Keeping this in /config isolates secrets and makes it easy to mock in tests.
 */
let initialized = false;

export function getAdmin() {
  if (!initialized) {
    const raw = process.env.FB_SERVICE_ACCOUNT_JSON;
    if (!raw) {
      throw new Error("FB_SERVICE_ACCOUNT_JSON is missing. Add it to server/.env");
    }

    // Parse the JSON from env. Some hosts store private_key with literal \n — fix that.
    const sa = JSON.parse(raw);
    if (sa.private_key?.includes("\\n")) {
      sa.private_key = sa.private_key.replace(/\\n/g, "\n");
    }

    admin.initializeApp({
      credential: admin.credential.cert(sa),
    });

    initialized = true;
  }
  return admin;
}

// Convenience accessors
export const adminAuth = () => getAdmin().auth();
export const adminApp  = () => getAdmin().app();
