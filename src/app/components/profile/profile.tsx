"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  passwordMinLength,
  isPasswordValid,
  isEmailValid,
} from "@/app/utils/utils";
import { useAuth } from "../../context/authContext";
import { fetchWithAuth } from "@/app/utils/apiUtils";

/**
 * The Profile component.
 *
 * @returns {JSX.Element} The Profile component
 */
export default function Profile() {
  const router = useRouter();
  const authContext = useAuth();
  if (!authContext) {
    return <p>Loading...</p>;
  }
  const { user, fetchProfile } = authContext;
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (email && !isEmailValid(email)) {
      setError("Invalid email address.");
      return;
    }
    if (password && !isPasswordValid(password)) {
      setError(
        `Password must be at least ${passwordMinLength} characters, include at least one uppercase letter, and at least one number.`
      );
      return;
    }
    if (password && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await fetchWithAuth("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (res) {
        const data = await res.json();

        if (!res.ok) {
          setError(`Profile update failed. ${data.response}`);
          return;
        }
        setEmail(data.email);
        setPassword("");
        setConfirmPassword("");
        setError(null);
        setIsEditing(false);

        await fetchProfile();
      } else {
        router.push("/login");
      }
    } catch (err) {
      setError("Error updating profile. Please try again.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError(null);
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50">
      <div className="w-full max-w-sm p-6 bg-slate-800 text-slate-50 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">Profile</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {!isEditing ? (
          <div>
            <p className="mb-4">
              <span className="font-bold">Username:</span> {user.username}
            </p>
            <p className="mb-4">
              <span className="font-bold">Email:</span>{" "}
              {user.email || "Not provided"}
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
              <label className="block mb-1 ml-1">
                New Email (leave empty to keep previous)
              </label>
              <input
                type="email"
                className="w-full p-2 bg-slate-700 text-slate-50 rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
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
