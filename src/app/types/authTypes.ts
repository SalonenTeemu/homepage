/**
 * Represents a user.
 */
export interface User {
  email?: string;
  username: string;
  role: string;
  emailConfirmed: boolean;
}
