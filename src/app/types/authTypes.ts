/**
 * Represents a user.
 */
export interface User {
	id: string;
	email?: string;
	username: string;
	displayName: string;
	role: string;
	emailConfirmed: boolean;
}
