//verifies firebase auth tokens server-side

import * as admin from "firebase-admin";

let initialized = false;

export function adminAuth() {
  if (!initialized) {
    const raw = process.env.FB_SERVICE_ACCOUNT_JSON;
    if (!raw) throw new Error("FB_SERVICE_ACCOUNT_JSON missing in server/.env");

    const sa = JSON.parse(raw);
    if (sa.private_key?.includes("\\n")) sa.private_key = sa.private_key.replace(/\\n/g, "\n");

    admin.initializeApp({ credential: admin.credential.cert(sa) });
    initialized = true;
    console.log("[Firebase Admin] initialized:", sa.project_id);
  }
  return admin.auth();
}

