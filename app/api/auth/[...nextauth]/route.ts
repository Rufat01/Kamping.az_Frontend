import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Şifrə", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`${API_URL}/api/v1/auth/login/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });

          const data = await res.json();
          if (!res.ok) return null;

          const meRes = await fetch(`${API_URL}/api/v1/auth/me/`, {
            headers: { Authorization: `Bearer ${data.access}` },
          });
          const user = await meRes.json();

          return {
            id: String(user.id),
            email: user.email,
            name: user.full_name,
            role: user.role,
            accessToken: data.access,
            refreshToken: data.refresh,
          };
        } catch {
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" && profile?.email) {
        try {
          const res = await fetch(`${API_URL}/api/v1/auth/google/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: profile.email,
              full_name: profile.name,
              google_id: (profile as { sub?: string }).sub,
              avatar: (profile as { picture?: string }).picture,
            }),
          });
          if (res.ok) {
            const data = await res.json();
            user.accessToken = data.access;
            user.refreshToken = data.refresh;
            user.role = data.user?.role || "user";
            user.backendId = data.user?.id;
          }
        } catch (e) {
          console.error("Google backend sync xətası:", e);
        }
      }
      return true;
    },

    async jwt({ token, user, account, profile }) {
      if (user && account?.provider === "credentials") {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.role = user.role;
        token.id = user.id;
      }

      if (account?.provider === "google") {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.role = user.role || "user";
        token.id = user.backendId;
        token.isGoogle = true;
        token.picture = (profile as { picture?: string })?.picture;
      }

      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user.role = token.role;
      session.user.isGoogle = token.isGoogle;
      session.user.image = token.picture ?? null;
      session.user.id = token.id;
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
