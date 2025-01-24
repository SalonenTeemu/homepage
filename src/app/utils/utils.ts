/**
 * Generates a random alphanumeric ID of a specified length.
 *
 * @param {number} length The length of the generated ID
 * @returns {string} The generated ID
 */
export function makeId(length: number) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

/**
 * Play a sound effect from the audio folder.
 *
 * @param sound The sound to play
 */
export const playSound = function (sound: string) {
  const audio = new Audio(`/projects/audio/${sound}.mp3`);
  audio.play();
};

/**
 * Minimum lengths for username and password.
 */
export const usernameMinLength = 4;
export const passwordMinLength = 8;

/**
 * Validate username length.
 *
 * @param username The username to validate
 * @returns The result of the validation
 */
export const isUsernameValid = (username: string) => username.length >= 4;

/**
 * Validate password strength.
 *
 * @param password The password to validate
 * @returns The result of the validation
 */
export const isPasswordValid = (password: string) =>
  password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password);

/**
 * Validate email address.
 *
 * @param email The email address to validate
 * @returns The result of the validation
 */
export const isEmailValid = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
