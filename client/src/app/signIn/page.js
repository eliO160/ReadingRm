//user signs in → you call your API with a token → server verifies → Mongo upserts user

"use client";

import { useState } from "react";
import { auth } from "@/lib/firebaseClient";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState("");
  const [profile, setProfile] = useState(null);

  async function signInEmail(e) {
    e.preventDefault();
    setMsg("");
    try { await signInWithEmailAndPassword(auth, email, pw); setMsg("Signed in."); }
    catch (err) { setMsg(err.message); }
  }

  async function signUpEmail() {
    setMsg("");
    try { await createUserWithEmailAndPassword(auth, email, pw); setMsg("Account created."); }
    catch (err) { setMsg(err.message); }
  }

  async function signInGoogle() {
    setMsg("");
    try { await signInWithPopup(auth, new GoogleAuthProvider()); setMsg("Google sign-in complete."); }
    catch (err) { setMsg(err.message); }
  }

  async function callProtected() {
    try {
      if (!auth.currentUser) throw new Error("Sign in first");
      const token = await auth.currentUser.getIdToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`API ${res.status}`);
      setProfile(await res.json());
      setMsg("Fetched profile from API.");
    } catch (err) {
      setMsg(err.message);
    }
  }

  return (
    <main style={{ maxWidth: 480, margin: "2rem auto", padding: 16 }}>
      <h1>Sign in</h1>
      <div style={{ display: "flex", gap: 8, margin: "8px 0" }}>
        <button onClick={signInGoogle}>Continue with Google</button>
        <button onClick={() => signOut(auth)}>Sign out</button>
      </div>

      <form onSubmit={signInEmail} style={{ display: "grid", gap: 8 }}>
        <input placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={pw} onChange={(e)=>setPw(e.target.value)} />
        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit">Sign in</button>
          <button type="button" onClick={signUpEmail}>Create account</button>
        </div>
      </form>

      <div style={{ marginTop: 12 }}>
        <button onClick={callProtected}>Call protected /api/profile</button>
      </div>

      {msg && <p style={{ marginTop: 12 }}>Status: {msg}</p>}
      {profile && <pre style={{ background: "#f6f6f6", padding: 12 }}>{JSON.stringify(profile, null, 2)}</pre>}
    </main>
  );
}
