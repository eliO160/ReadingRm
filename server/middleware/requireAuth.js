import { adminAuth } from "../firebaseAdmin.js";

export async function requireAuth(req, res, next) {
  const h = req.headers.authorization || "";
  const t = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!t) return res.status(401).send("Missing token");
  try {
    req.user = await adminAuth().verifyIdToken(t); // { uid, email, name, picture, ... }
    next();
  } catch (e) {
    console.error("[auth] verify failed:", e?.message);
    res.status(401).send("Invalid or expired token");
  }
}
