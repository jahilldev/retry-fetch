/* -----------------------------------
 *
 * IOptions
 *
 * -------------------------------- */

interface IOptions extends Request {
  fetch?: typeof globalThis.fetch;
  retries?: number;
  timeout: number;
}

/* -----------------------------------
 *
 * Fetch
 *
 * -------------------------------- */

async function retryFetch(
  requestUrl: string,
  { fetch = globalThis.fetch, retries = 3, timeout = 30e3, ...options }: Partial<IOptions>
): Promise<Response> {
  let error: Error = new Error();
  const meta = { requestUrl, retries, options, timeout: false };
  const control = new AbortController();
  let attempt = 1;

  while (retries > 0) {
    const onTimeout = setTimeout(() => (meta.timeout = true) && control.abort(), timeout);

    try {
      const result: Response = await fetch(requestUrl, {
        ...options,
        signal: control.signal,
      });

      clearTimeout(onTimeout);

      if (result.ok) {
        return result;
      }
    } catch (reason) {
      error = reason as Error;
    }

    await sleep(2 ** attempt * 10e3);

    retries -= 1;
    attempt += 1;
  }

  error = Object.assign(error, { meta });

  throw error;
}

/* -----------------------------------
 *
 * Sleep
 *
 * -------------------------------- */

async function sleep(seconds = 1): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1e3));
}

/* -----------------------------------
 *
 * Export
 *
 * -------------------------------- */

export { retryFetch };
