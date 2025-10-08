export interface AuthErrorTypes {
  name?: string[];
  email?: string[];
  password?: string[];
}

export interface UserTypes {
  id: string;
  name?: string;
  email?: string;
  emailVerified?: boolean;
  token?: string;
  providerData?: {
    providerId?: string;
    uid?: string;
    displayName?: string | null;
    email?: string | null;
    photoURL?: string | null;
    phoneNumber?: string | null;
  }[];
  password?: string;
  photoURL?: string;
  createdAt?: Date;
  writes?: string[];
  following: string[];
  followers: string[];
  writesCount?: number;
  errors?: AuthErrorTypes;
}

export interface EntryType {
  id: string;
  authorId: string;
  authorName: string;
  authorPhotoURL: string;
  authorEmail: string;
  title: string;
  content: string;
  visibility: "public" | "private";
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}
export interface SearchUser {
  id: string;
  name?: string;
  email?: string;
  photoURL?: string;
}
