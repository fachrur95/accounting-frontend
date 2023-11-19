import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
  type DefaultUser,
  type User,
  type Session,
  type Account,
  type Profile,
  type Awaitable,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { ApiCatchError } from "@/types/api-response";
// import DiscordProvider from "next-auth/providers/discord";

import { env } from "@/env.mjs";
import type { ITokenData, ITokenLoginResponse } from "@/types/token";
import axios from "axios";
import jwtDecode from "jwt-decode";
import type { IJwtDecode } from "@/types/session";
import type { JWT } from "next-auth/jwt";
import { type AdapterUser } from "next-auth/adapters";
import type { Role } from "@/types/prisma-api/role";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      // ...other properties
      role: Role;
    };
    accessToken: string;
    refreshToken: string;
  }

  interface User extends DefaultUser {
    // ...other properties
    // role: UserRole;
    accessToken: string;
    refreshToken: string;
    // accessTokenExpires: number;
  }
  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

async function refreshAccessToken(tokenObject: User) {
  try {
    const url = `${env.BACKEND_URL}/v1/auth/refresh-tokens`;

    const newTokens = await axios.post<ITokenData>(
      url,
      {
        refreshToken: tokenObject.refreshToken
      },
      {
        headers: {
          withCredentials: true,
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${tokenObject.accessToken}`
        },
      },
    )
      .then((response) => response.data)
      .catch((err) => {
        console.log(err)
        return undefined
      });

    if (!newTokens) {
      return tokenObject;
    }

    return {
      ...tokenObject,
      accessToken: newTokens.access.token,
      refreshToken: newTokens.refresh.token ?? tokenObject.refreshToken, // Fall back to old refresh token
    }
  } catch (error) {
    return {
      ...tokenObject,
      error: "RefreshAccessTokenError",
    }
  }
}

const additionalTime = 10 * 60 * 60; // 10 hours

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, token }) => {
      const decoded = jwtDecode<IJwtDecode>(token.accessToken as string);

      return ({
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          role: decoded.role,
        },
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        error: token.error ?? null,
      })
    },
    async jwt(
      { token, user, trigger, session }:
        {
          token: JWT,
          user: User | AdapterUser,
          trigger?: "signIn" | "signUp" | "update",
          session?: Session,
          account: Account | null,
          profile?: Profile,
          isNewUser?: boolean
        }) {
      if (trigger === "update") {
        return { ...token, accessToken: session?.accessToken, refreshToken: session?.refreshToken }
      }
      if (token.accessToken) {
        const tokenData = jwtDecode<IJwtDecode>(token.accessToken as string);
        if (Date.now() > tokenData.exp * 1000) {
          return refreshAccessToken(token as unknown as User) as Awaitable<JWT>
        }
      }
      if (user) {
        token.id = user.id;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
  },
  providers: [
    /* DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }), */
    CredentialsProvider({
      id: "next-auth",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "example@domain.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await axios.post<ITokenLoginResponse>(
          `${env.BACKEND_URL}/v1/auth/login`,
          {
            email: credentials.email,
            password: credentials.password,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          },
        )
          .then((response) => response.data)
          .catch((error) => {
            throw new Error((error as ApiCatchError).response?.data?.message ?? (error as ApiCatchError).message ?? "An error occurred");
          });

        if (!user) {
          throw new Error("An error occurred");
        }

        const session = jwtDecode<IJwtDecode>(user.tokens.access.token);

        return {
          id: session.sub,
          name: session.name,
          email: session.email,
          role: session.role,
          image: null,
          accessToken: user.tokens.access.token,
          refreshToken: user.tokens.refresh.token,
        };
      },
    }),
    CredentialsProvider({
      id: "register",
      name: "Registration",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@domain.com",
        },
        name: {
          label: "Full Name",
          type: "text",
          placeholder: "Ahmad Fulan",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.name || !credentials.password) {
          throw new Error("Lengkapi data terlebih dahulu");
        }

        const user = await axios.post<ITokenLoginResponse>(
          `${env.BACKEND_URL}/v1/auth/register`,
          {
            email: credentials.email,
            name: credentials.name,
            password: credentials.password,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          },
        )
          .then((response) => response.data)
          .catch((error) => {
            throw new Error((error as ApiCatchError).response?.data?.message ?? (error as ApiCatchError).message ?? "An error occurred");
          });

        if (!user) {
          throw new Error("An error occurred");
        }

        const session = jwtDecode<IJwtDecode>(user.tokens.access.token);

        return {
          id: session.sub,
          name: session.name,
          email: session.email,
          role: session.role,
          image: null,
          accessToken: user.tokens.access.token,
          refreshToken: user.tokens.refresh.token,
        };
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  pages: {
    signIn: "/auth"
  },
  session: {
    strategy: "jwt",
    maxAge: additionalTime,
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
