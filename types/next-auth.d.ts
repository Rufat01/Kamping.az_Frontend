import "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id?: string | number;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      isGoogle?: boolean;
    };
  }

  interface User {
    id: string;
    accessToken?: string;
    refreshToken?: string;
    role?: string;
    backendId?: string | number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    role?: string;
    id?: string | number;
    isGoogle?: boolean;
    picture?: string;
  }
}
