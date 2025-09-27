"use client";

import { AuthForm } from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white px-4">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Login to Cooking Book App
        </h1>
        <AuthForm />
      </div>
    </div>
  );
}
