'use client';
export default function EnvCheck() {
  return (
    <pre>
      {JSON.stringify(
        {
          hasApiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
          hasAuthDomain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          hasProjectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          hasAppId: !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
          apiBase: process.env.NEXT_PUBLIC_API_BASE,
        },
        null,
        2
      )}
    </pre>
  );
}
