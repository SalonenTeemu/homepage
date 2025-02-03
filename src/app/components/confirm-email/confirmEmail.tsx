"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/authContext";

/**
 * The confirm email component.
 *
 * @returns {JSX.Element} The confirm email component
 */
export default function ConfirmEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const authContext = useAuth();
  const user = authContext?.user;
  const [status, setStatus] = useState<string>("Validating...");
  const [timer, setTimer] = useState<number>(5);

  const redirectAfterTimeout = (user: any, router: any) => {
    const countdown = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(countdown);
      console.log(user)
      if (user) {
        router.push("/profile");
      } else {
        router.push("/login");
      }
    }, 5000);
  };

  useEffect(() => {
    if (token) {
      const confirmEmail = async () => {
        try {
          const res = await fetch(`/api/confirm-email?token=${token}`);
          const data = await res.json();

          if (res.ok) {
            setStatus("Your email has been confirmed successfully!");
            redirectAfterTimeout(user, router);
          } else {
            setStatus(
              `Error. ${data.message}. You can request a new confirmation email from the profile page.`
            );
            redirectAfterTimeout(user, router);
          }
        } catch (err) {
          console.log("Error:", err);
          setStatus(
            "An error occurred while confirming your email. You can request a new confirmation email from the profile page."
          );
          redirectAfterTimeout(user, router);
        }
      };

      confirmEmail();
    } else {
      setStatus("Error confirming email. No token found in the URL.");
      redirectAfterTimeout(user, router);
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50">
      <div className="w-full max-w-md p-6 bg-slate-800 text-slate-50 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Email Confirmation</h1>
        <p>{status}</p>
        <p className="mt-4 text-green-500">Redirecting in {timer} seconds...</p>
      </div>
    </div>
  );
}
