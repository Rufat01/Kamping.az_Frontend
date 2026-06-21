import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function decodeJwtExpiry(token: string): number {
  const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
  const payload = JSON.parse(Buffer.from(base64, "base64").toString("utf8"));
  return payload.exp * 1000;
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const res = await fetch(`${API_URL}/api/v1/auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: token.refreshToken }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error("Refresh failed");

    return {
      ...token,
      accessToken: data.access,
      accessTokenExpiry: decodeJwtExpiry(data.access),
      ...(data.refresh ? { refreshToken: data.refresh } : {}),
      error: undefined,
    };
  } catch {
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

export const authOptions: NextAuthOptions = {
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
        token.accessTokenExpiry = user.accessToken
          ? decodeJwtExpiry(user.accessToken)
          : undefined;
      }

      if (account?.provider === "google") {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.role = user.role || "user";
        token.id = user.backendId;
        token.isGoogle = true;
        token.picture = (profile as { picture?: string })?.picture;
        token.accessTokenExpiry = user.accessToken
          ? decodeJwtExpiry(user.accessToken)
          : undefined;
      }

      if (!token.accessTokenExpiry && token.accessToken) {
        try {
          token.accessTokenExpiry = decodeJwtExpiry(token.accessToken);
        } catch {
          // decode alınmadısa refresh edəcəyik
        }
      }

      if (token.accessTokenExpiry && Date.now() < token.accessTokenExpiry - 60_000) {
        return token;
      }

      return refreshAccessToken(token);
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.error = token.error;
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
