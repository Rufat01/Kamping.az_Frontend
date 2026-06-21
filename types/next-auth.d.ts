import "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    error?: string;
    user: {
      id?: string | number;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      isGoogle?: boolean;
      profile_completed?: boolean;
      phone?: string | null;
    };
  }

  interface User {
    id: string;
    accessToken?: string;
    refreshToken?: string;
    role?: string;
    backendId?: string | number;
    profileCompleted?: boolean;
    phone?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpiry?: number;
    role?: string;
    id?: string | number;
    isGoogle?: boolean;
    picture?: string;
    error?: string;
    profileCompleted?: boolean;
    phone?: string | null;
  }
}
