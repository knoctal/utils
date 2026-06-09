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
>(data?: T): string {
  return `${data?.firstName || data?.first_name || ''} ${data?.lastName || data?.last_name || ''}`.trim();
}
