/**
 * Returns the full name of a user based on their first and last name.
 *
 * @param data User data containing `firstName` and `lastName`
 * @returns The full name of the user
 */
export function fullName<
  T extends {
    firstName?: string | null;
    first_name?: string | null;
    lastName?: string | null;
    last_name?: string | null;
  },
>(data?: T | null): string {
  return `${data?.firstName || data?.first_name || ''} ${data?.lastName || data?.last_name || ''}`.trim();
}

/**
 * Returns the initials of a user based on their first and last name.
 *
 * @param data User data containing `firstName` and `lastName`
 * @param defaultInitials The default initials to return if the user's initials cannot be derived from the provided data
 * @returns The initials of the user or a default value if the initials cannot be derived from the provided data
 */
export function makeInitials<
  T extends {
    firstName?: string | null;
    first_name?: string | null;
    lastName?: string | null;
    last_name?: string | null;
  },
>(data?: T | null, defaultInitials: string = ''): string {
  return (
    `${(data?.firstName || data?.first_name || '').charAt(0)} ${(data?.lastName || data?.last_name || '').charAt(0)}`.trim() ||
    defaultInitials
  );
}
