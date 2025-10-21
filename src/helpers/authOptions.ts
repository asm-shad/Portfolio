/* eslint-disable @typescript-eslint/no-explicit-any */
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
    accessToken?: string;
    refreshToken?: string;
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
    accessToken?: string;
    refreshToken?: string;
  }

  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    id: string;
    role?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          console.error("Email or Password is missing");
          return null;
        }

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          const data = await res.json();
          console.log("Backend response in authorize:", data);

          // Check if login was successful based on your backend response
          if (data.success && data.user && data.tokens) {
            // Return user with tokens - these will be passed to JWT callback
            return {
              id: data.user.id.toString(),
              name: data.user.name,
              email: data.user.email,
              image: data.user.picture,
              role: data.user.role,
              accessToken: data.tokens.accessToken,
              refreshToken: data.tokens.refreshToken,
            };
          } else {
            console.error("Login failed:", data.message);
            throw new Error(data.message || "Invalid credentials");
          }
        } catch (error: any) {
          console.error("Auth error:", error);
          throw new Error(error.message || "Login failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      console.log("JWT callback - user:", user);
      console.log("JWT callback - token:", token);

      // Initial sign in
      if (user && account) {
        console.log("Initial sign in - storing tokens in JWT");
        return {
          ...token,
          id: user.id,
          role: user.role,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
        };
      }

      // Update session if needed
      if (trigger === "update" && session) {
        console.log("Updating JWT with new session data");
        return { ...token, ...session };
      }

      return token;
    },
    async session({ session, token }) {
      console.log("Session callback - token:", token);
      console.log("Session callback - session before:", session);

      if (session?.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;
      }

      console.log("Session callback - session after:", session);
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
};
