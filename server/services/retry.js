export async function withRetry(fn, { retries = 2, baseDelayMS = 400 } = {}) {
  let lastErr;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastErr = error;
      if (i < retries) {
        const delay = baseDelayMS * Math.pow(2, i); // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, delay))
      };
    }
  }
  throw lastErr;
}