import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "./config";
import { getDoc, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { UserTypes } from "@/types/types";
import { SignupFormSchema } from "@/app/lib/definitions";
import {} from "firebase/firestore";

async function createUserDocIfNotExists(user: UserTypes, name?: string) {
  if (!user.id) return;

  const userRef = doc(db, "users", user.id);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    try {
      await setDoc(userRef, {
        id: user.id,
        email: user.email,
        name: name || user.name || "Anonymous",
        writes: [],
        writesCount: 0,
        createdAt: serverTimestamp(),
        following: [],
        followers: [],
      });
    } catch (e) {
      console.error("Failed to create user doc:", e);
      throw e;
    }
  }
}

export async function signUpUser(formData: FormData) {
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = validatedFields.data;

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    await createUserDocIfNotExists(
      { id: user.uid, email: user.email ?? undefined },
      name,
    );

    return { user };
  } catch (error: unknown) {
    console.error("Error signing up:", error);

    let message = "An error occurred during signup.";
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "auth/email-already-in-use"
    ) {
      message = "Email already in use.";
    }

    return {
      errors: {
        email: [message],
      },
    };
  }
}

export async function signInUser({ email, password }: UserTypes) {
  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );
  const user = userCredential.user;

  await createUserDocIfNotExists({
    id: user.uid,
    email: user.email ?? undefined,
    name: user.displayName ?? undefined,
  });

  return user;
}

export function signOutUser() {
  return signOut(auth);
}

export async function resetPassword(email: string) {
  if (!email) {
    throw new Error("Email is required to reset password.");
  }

  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, message: "Password reset email sent." };
  } catch (error: unknown) {
    console.error("Error sending password reset email:", error);

    let message = "Failed to send password reset email.";
    if (typeof error === "object" && error !== null && "code" in error) {
      const code = (error as { code?: string }).code;
      if (code === "auth/user-not-found")
        message = "No account found with that email.";
      if (code === "auth/invalid-email") message = "Invalid email address.";
    }

    return { success: false, message };
  }
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    await createUserDocIfNotExists({
      id: user.uid,
      email: user.email ?? undefined,
      name: user.displayName ?? undefined,
    });

    return { user };
  } catch (error: unknown) {
    console.error("Google sign-in error:", error);

    let message = "An error occurred during Google sign-in.";
    if (typeof error === "object" && error !== null && "code" in error) {
      const code = (error as { code?: string }).code;
      if (code === "auth/popup-closed-by-user")
        message = "Sign-in popup closed.";
      if (code === "auth/cancelled-popup-request")
        message = "Sign-in was canceled.";
    }

    return { error: message };
  }
}
