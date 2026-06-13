/**
 * Safely calls the function and returns null if it throws an error
 *
 * Intended for use in React components where we want to attempt to render something but if it fails,
 * we want to fail gracefully by returning null instead of throwing an error.
 */
export function tryOrNull<T>(fn: () => T) {
  try {
    return fn();
  } catch {
    return null;
  }
}

/**
 * Calls an async function safely and returns an object with the data or error.
 *
 * @param fn The async function to call
 * @returns An object with either the data or an error
 */
export async function tryCatch<T>(fn: () => Promise<T>) {
  try {
    return { data: await fn(), error: null } as { data: T; error: null };
  } catch (error) {
    return { data: null, error: error as Error } as { data: null; error: Error };
  }
}
