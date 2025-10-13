"use client";

import { useState } from "react";
import { useUser } from "./UserContext";
import { GoogleLogoIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

export function AuthForm() {
  const { signUp, signIn, signInWithGoogle, resetPassword } = useUser();
  const router = useRouter();

  const [mode, setMode] = useState<"signup" | "signin" | "reset">("signup");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const toggleMode = (newMode: "signup" | "signin" | "reset") => {
    setMode(newMode);
    setError("");
    setMessage("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setError("");
    setMessage("");

    try {
      if (mode === "signup") {
        const username = formData.get("username") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const result = await signUp(username, email, password);
        if (result?.error) {
          setError(result.error);
          return;
        }
        router.push("/dashboard");
      } else if (mode === "signin") {
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const result = await signIn(email, password);
        if (result?.error) {
          setError(result.error);
          return;
        }
        router.push("/dashboard");
      } else if (mode === "reset") {
        const email = formData.get("email") as string;
        const result = await resetPassword(email);

        if (result?.success) {
          setMessage(result.message || "Password reset email sent.");
        } else {
          setError(result?.message || "Failed to send password reset email.");
        }
      }
    } catch (err: unknown) {
      console.error("Error:", err);
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-10 relative z-10 w-full max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="text-black">
          <h2 className="text-2xl font-bold mb-4 text-center">
            {mode === "signup"
              ? "Sign Up"
              : mode === "signin"
                ? "Sign In"
                : "Reset Password"}
          </h2>

          {error && (
            <p className="text-red-600 whitespace-pre-line mb-4">{error}</p>
          )}
          {message && (
            <p className="text-green-600 whitespace-pre-line mb-4">{message}</p>
          )}

          {mode === "signup" && (
            <div className="mb-4">
              <label htmlFor="username">Username:</label>
              <input
                id="username"
                name="username"
                placeholder="Username"
                className="w-full p-2 border rounded"
                autoComplete="username"
                required
              />
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {mode !== "reset" && (
            <div className="mb-4">
              <label htmlFor="password">Password:</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                className="w-full p-2 border rounded"
                required={mode === "signup" || mode === "signin"}
                autoComplete="current-password"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 bg-gray-800 text-white rounded"
          >
            {mode === "signup"
              ? "Sign Up"
              : mode === "signin"
                ? "Sign In"
                : "Send Reset Email"}
          </button>

          <button
            type="button"
            onClick={async () => {
              const result = await signInWithGoogle();
              if (result?.error) setError(result.error);
              else router.push("/dashboard");
            }}
            className="w-full py-2 bg-white text-gray-800 border border-gray-300 rounded mt-2 flex items-center justify-center gap-2 hover:bg-gray-100 transition"
          >
            <GoogleLogoIcon size={20} weight="fill" />
            Continue with Google
          </button>

          <div className="mt-4 text-center text-sm text-gray-700 space-y-1">
            {mode === "signup" && (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => toggleMode("signin")}
                  className="text-blue-600 underline"
                >
                  Sign In
                </button>
              </p>
            )}

            {mode === "signin" && (
              <>
                <p>
                  Don’t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => toggleMode("signup")}
                    className="text-blue-600 underline"
                  >
                    Sign Up
                  </button>
                </p>
                <p>
                  Forgot your password?{" "}
                  <button
                    type="button"
                    onClick={() => toggleMode("reset")}
                    className="text-blue-600 underline"
                  >
                    Reset Password
                  </button>
                </p>
              </>
            )}

            {mode === "reset" && (
              <p>
                Remember your password?{" "}
                <button
                  type="button"
                  onClick={() => toggleMode("signin")}
                  className="text-blue-600 underline"
                >
                  Back to Sign In
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
