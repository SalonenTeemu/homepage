"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!captchaValue) {
      setError("Please verify the CAPTCHA.");
      return;
    }

    // Perform registration logic here (e.g., API call)

    // Simulating successful registration and navigating to the login page
    alert("Registration successful!");
    router.push("/login");
  };

  const onCaptchaChange = (value: string | null) => {
    setCaptchaValue(value);
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50">
      <div className="w-full max-w-sm p-6 bg-slate-800 text-slate-50 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">Register</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
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
            <label className="block mb-1 ml-1">Email (optional)</label>
            <input
              type="email"
              className="w-full p-2 bg-slate-700 text-slate-50 rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="text-sm text-gray-400 mt-2 ml-1">
              Email is optional and can be used for account recovery and profile
              updates (password reset).
            </p>
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

          <div className="mb-4 flex justify-center">
            <ReCAPTCHA
              sitekey="6LfLB8AqAAAAAHspOOhsK4xnydZ5aFcSTfegjZRe"
              onChange={onCaptchaChange}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-lime-500 text-slate-950 rounded-md hover:bg-lime-600">
            Register
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-lime-500 hover:underline">
              Go to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
