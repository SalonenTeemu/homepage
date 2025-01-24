"use client";

import { useState } from "react";
import {
  isUsernameValid,
  isPasswordValid,
  usernameMinLength,
  passwordMinLength,
} from "@/app/utils/utils";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("JohnDoe");
  const [email, setEmail] = useState("johndoe@example.com");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    if (!isUsernameValid(username)) {
      setError(`Username must be at least ${usernameMinLength} characters.`);
      return;
    }
    if (!isPasswordValid(password)) {
      setError(
        `Password must be at least ${passwordMinLength} characters, include at least one uppercase letter, and at least one number.`
      );
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Simulate saving changes (replace this with API call)
    alert("Profile updated successfully!");
    setPassword(""); // Clear password inputs
    setConfirmPassword("");
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPassword("");
    setConfirmPassword("");
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50">
      <div className="w-full max-w-sm p-6 bg-slate-800 text-slate-50 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">Profile</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {!isEditing ? (
          <div>
            <p className="mb-4">
              <span className="font-bold">Username:</span> {username}
            </p>
            <p className="mb-4">
              <span className="font-bold">Email:</span>{" "}
              {email || "Not provided"}
            </p>
            <button
              className="w-full py-2 bg-lime-500 text-slate-950 rounded-md hover:bg-lime-600"
              onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}>
            <div className="mb-4">
              <label className="block mb-1 ml-1">Username</label>
              <input
                type="text"
                className="w-full p-2 bg-slate-700 text-slate-50 rounded-md"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 ml-1">Email</label>
              <input
                type="email"
                className="w-full p-2 bg-slate-700 text-slate-50 rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="text-sm text-gray-400 mt-2 ml-1">
                Email is optional and is used for account recovery and profile
                updates (e.g., password reset).
              </p>
            </div>
            <div className="mb-4">
              <label className="block mb-1 ml-1">New Password</label>
              <input
                type="password"
                className="w-full p-2 bg-slate-700 text-slate-50 rounded-md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 ml-1">Confirm Password</label>
              <input
                type="password"
                className="w-full p-2 bg-slate-700 text-slate-50 rounded-md"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="flex justify-between">
              <button
                type="submit"
                className="py-2 px-4 bg-lime-500 text-slate-950 rounded-md hover:bg-lime-600">
                Save
              </button>
              <button
                type="button"
                className="py-2 px-4 bg-slate-700 text-slate-50 rounded-md hover:bg-slate-600"
                onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
