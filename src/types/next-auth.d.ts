// types/next-auth.d.ts
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // <-- add it to the session type
    } & DefaultSession["user"];
  }

  interface User {
    id: string; // make sure User has an id too
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string; // we’ll store the user id on the token
    sub?: string; // NextAuth sets this for OAuth (e.g., Google)
  }
}
