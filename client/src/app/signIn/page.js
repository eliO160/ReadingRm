"use client";
import { useState } from "react";
import { auth } from "@/lib/firebaseClient";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  TextField, Label, Input, Text, Button, Heading
} from "react-aria-components";

// Optional: if you want to redirect back to where the user came from
function getReturnTo() {
  if (typeof window === "undefined") return "/";
  const url = new URL(window.location.href);
  return url.searchParams.get("returnTo") || "/";
}

export default function SignInPage() {
  // Local form state (controlled inputs keep UI in sync)
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pw);
      // optional: go back to where the soft gate sent us from
      window.location.assign(getReturnTo());
    } catch (error) {
      setErr(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignUp(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, pw);
      window.location.assign(getReturnTo());
    } catch (error) {
      setErr(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setErr("");
    setLoading(true);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      window.location.assign(getReturnTo());
    } catch (error) {
      setErr(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container mx-auto max-w-md px-4 py-8">
      <section aria-labelledby="signin-title">
        <Heading id="signin-title" level={1}>Sign in</Heading>

        <form onSubmit={handleSubmit} noValidate>

          <TextField isRequired className="mt-4 block">
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Text slot="description">Use your school or personal email.</Text>
            {/* You can also show field-specific errors via slot="errorMessage" */}
          </TextField>

          <TextField isRequired className="mt-4 block">
            <Label>Password</Label>
            <Input
              type="password"
              name="password"
              autoComplete="current-password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              required
              minLength={8}
            />
            <Text slot="description">Password must be at least 8 characters.</Text>
          </TextField>

          {/* Global error message (announced by screen readers) */}
          {err && (
            <div role="alert" className="mt-3 text-sm text-red-600">
              {err}
            </div>
          )}

          <div className="mt-6 grid gap-2">
            <Button
              type="submit"
              isDisabled={loading}
              className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
            >
              {loading ? "Signing in…" : "Sign in"}
            </Button>

            {/* Optional: quick sign-up on the same page */}
            <Button
              type="button"
              onPress={handleSignUp}
              isDisabled={loading}
              className="rounded border px-4 py-2"
            >
              Create account
            </Button>

            {/* Google sign-in (must be user-initiated click) */}
            <Button
              type="button"
              onPress={handleGoogle}
              isDisabled={loading}
              className="rounded border px-4 py-2"
            >
              Continue with Google
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
}
