'use client';

import { signUpUser } from "@/store/firebase/auth";

export function AuthForm() {
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);

    try {
      const user = await signUpUser(formData);
      if (user?.errors) {
        alert(
          `Invalid input:\n${user.errors.name?.join(", ") ?? ""}\n${user.errors.email?.join(", ") ?? ""}\n${user.errors.password?.join(", ") ?? ""}`
        );
        return;
      }
      alert("User signed up successfully!");
    } catch (error) {
      console.error("Error signing up:", error);
      alert("Failed to sign up. Please try again.");
    }
  };
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-10 relative z-10 w-full max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="text-black">
          <div>
            <label htmlFor="username">Username:</label>
            <input id="username" name="username" placeholder="Username" />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input id="email" name="email" type="email" placeholder="Email" />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input id="password" name="password" type="password" placeholder="Password" />
          </div>
          <button type="submit" className="text-xl m-2 p-2 rounded-xl bg-gray-600 text-white">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default AuthForm;
