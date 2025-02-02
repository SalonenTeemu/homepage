/**
 * Helper function to fetch again if access token is expired.
 *
 * @param url The URL to fetch
 * @param options The fetch options
 * @returns The fetch response
 */
export async function fetchWithAuth(url: string, options = {}) {
  let res = await fetch(url, { ...options, credentials: "include" });

  // If request fails due to an expired access token (401)
  if (res.status === 401) {
    console.warn("Access token expired, attempting to refresh...");

    // Try to refresh the token
    const refreshRes = await fetch("/api/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (!refreshRes.ok) {
      console.error("Refresh token expired or invalid.");
      return null; // Refresh token is also invalid → user must log in again
    }

    console.log("Access token refreshed! Retrying original request...");

    // Retry the original request with the new token
    res = await fetch(url, { ...options, credentials: "include" });
  }

  return res;
}
