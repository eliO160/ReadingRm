export async function api(path, { method = 'GET', body, token } = {}) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  // Read the raw text once so we don't try to consume the body twice
  const text = await res.text();

  if (!res.ok) {
    // Use the body text as the error message if present
    throw new Error(text || `HTTP ${res.status}`);
  }

  // No content (e.g. 204) or empty body → just return null
  if (!text) {
    return null;
  }

  // Try to parse JSON; if it isn't JSON, just return the raw text
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
