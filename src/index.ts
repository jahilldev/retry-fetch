/* -----------------------------------
 *
 * IOptions
 *
 * -------------------------------- */

interface IOptions extends Request {
  retries?: number;
  timeout: number;
  backoff?: number;
}

/* -----------------------------------
 *
 * Fetch
 *
 * -------------------------------- */

async function retryFetch(
  requestUrl: string,
  { retries = 3, timeout = 30e3, backoff = 500, ...options }: Partial<IOptions>
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

      return result;
    } catch (reason) {
      error = reason as Error;
    }

    await sleep(2 ** attempt * backoff);

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
