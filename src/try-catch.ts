/**
 * Safely calls the function and returns null if it throws an error
 *
 * Intended for use in React components where we want to attempt to render something but if it fails,
 * we want to fail gracefully by returning null instead of throwing an error.
 */
export function tryWithNull<T>(fn: () => T) {
  try {
    return fn();
  } catch {
    return null;
  }
}

/**
 * Calls an async function safely and returns an object with the data or error.
 *
 * */
export async function tryWithNullAsync<T>(fn: () => Promise<T>) {
  try {
    return { data: await fn(), error: null } as { data: T; error: null };
  } catch (error) {
    return { data: null, error: error as Error } as { data: null; error: Error };
  }
}
