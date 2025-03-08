import { LRUCache } from "lru-cache";

/**
 * Define rate limiting options for global requests.
 */
const rateLimitOptions = {
	max: 200, // Max requests per IP
	ttl: 60 * 10 * 1000, // 10 minutes
};

/**
 * Define rate limiting options for forum posting.
 */
const postRateLimitOptions = {
	max: 10, // Max posts per user per day
	ttl: 24 * 60 * 60 * 1000, // 24 hours
};

// Create a new caches for rate limiting
const rateLimiter = new LRUCache<string, number>(rateLimitOptions);
const postRateLimiter = new LRUCache<string, number>(postRateLimitOptions);

/**
 * Check if the request is within the rate limit for the given IP address.
 *
 * @param ip The IP address of the client
 * @returns The rate limit status, true if the request is allowed, false if the request is blocked
 */
export function checkRateLimit(ip: string): boolean {
	const count = rateLimiter.get(ip) || 0;

	if (count >= rateLimitOptions.max) {
		return false; // Block request
	}

	rateLimiter.set(ip, count + 1, { ttl: rateLimitOptions.ttl });
	return true; // Allow request
}

/**
 * Check if the user is within the rate limit for posting.
 *
 * @param userId The user ID
 * @returns The rate limit status, true if the request is allowed, false if the request is blocked
 */
export function checkPostRateLimit(userId: string): boolean {
	const count = postRateLimiter.get(userId) || 0;

	if (count >= postRateLimitOptions.max) {
		return false; // Block request
	}

	postRateLimiter.set(userId, count + 1, { ttl: postRateLimitOptions.ttl });
	return true; // Allow request
}
