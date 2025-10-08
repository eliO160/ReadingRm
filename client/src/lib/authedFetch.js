import { auth } from "@/lib/firebaseClient";

export async function authedFetch(url, options = {}) {
  const user = auth.currentUser;
  if (!user) throw Object.assign(new Error("AUTH_REQUIRED"), { code: "AUTH_REQUIRED" });
  const token = await user.getIdToken();
  const res = await fetch(url, {
    ...options,
    headers: { ...(options.headers || {}), Authorization: `Bearer ${token}` }
  });
  if (res.status === 401) {
    throw Object.assign(new Error("AUTH_REQUIRED"), { code: "AUTH_REQUIRED" });
  }
  return res;
}
