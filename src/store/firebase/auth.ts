import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "./config";
import { doc, setDoc } from "firebase/firestore";
import { UserTypes } from "@/types/types";
import { SignupFormSchema } from '@/app/lib/definitions'

export async function signUpUser( formData: FormData) {
  const validatedFields = SignupFormSchema.safeParse({
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
  });
  

if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

const { name, email, password } = validatedFields.data;

const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await setDoc(doc(db,"users",user.uid),
{
  id:user.uid,
  email:user.email,
  name:name || "Anonymous",
  writes:[],
  writesCount:0,
  createdAt: new Date(),
});
return user;
}

export async function signInUser({email, password}:UserTypes) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
}

export function signOutUser() {
  return signOut(auth);
}