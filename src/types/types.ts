export interface UserTypes {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
  photoURL?: string;
  createdAt?: Date;
  writes?: string[];
  following?: string[];
  followers?: string[];
  writesCount?: number;
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
}
export interface EntryType {
  id: string;
  authorId: string;
  authorName: string;
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
