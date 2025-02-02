"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * The confirm email component.
 *
 * @returns {JSX.Element} The confirm email component
 */
export default function ConfirmEmail() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<string>("Validating...");

  useEffect(() => {
    if (token) {
      const confirmEmail = async () => {
        try {
          const res = await fetch(`/api/confirm-email?token=${token}`);
          const data = await res.json();

          if (res.ok) {
            setStatus("Your email has been confirmed successfully!");
          } else {
            setStatus(`Error. ${data.message}`);
          }
        } catch (err) {
          console.log("Error:", err);
          setStatus("An error occurred while confirming your email.");
        }
      };

      confirmEmail();
    } else {
      setStatus("No token found in the URL.");
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50">
      <div className="w-full max-w-md p-6 bg-slate-800 text-slate-50 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Email Confirmation</h1>
        <p>{status}</p>
      </div>
    </div>
  );
}
