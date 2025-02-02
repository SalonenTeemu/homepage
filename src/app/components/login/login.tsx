"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { isUsernameValid, isPasswordValid } from "@/app/utils/utils";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !isUsernameValid(username)) {
      setError("Login failed. Invalid username.");
      return;
    }

    if (!password || !isPasswordValid(password)) {
      setError("Login failed.");
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(`Login failed. ${data.response}`);
        return;
      }

      router.push("/profile");
    } catch (e) {
      setError("Login failed. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50">
      <div className="w-full max-w-md p-6 bg-slate-800 text-slate-50 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        <p className="text-red-500 text-sm text-center">{error}</p>
        <form onSubmit={handleSubmit}>
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
            <label className="block mb-1 ml-1">Password</label>
            <input
              type="password"
              className="w-full p-2 bg-slate-700 text-slate-50 rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-lime-500 text-slate-950 rounded-md hover:bg-lime-600">
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">
            Don't have an account?{" "}
            <Link href="/register" className="text-lime-500 hover:underline">
              Go to Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
