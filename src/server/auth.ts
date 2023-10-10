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
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// import DiscordProvider from "next-auth/providers/discord";

import { env } from "@/env.mjs";
import type { ITokenLoginResponse } from "@/types/token";
import axios from "axios";
import jwtDecode from "jwt-decode";
import type { IJwtDecode } from "@/types/session";
import type { JWT } from "next-auth/jwt";
import { type AdapterUser } from "next-auth/adapters";

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
      // role: UserRole;
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

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
      },
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
    }),
    jwt(
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
      // console.log({ now: Date.now(), exp: user.accessTokenExpires, res: Date.now() > user.accessTokenExpires })
      /* if (Date.now() > user.accessTokenExpires) {
        return refreshAccessToken(token as unknown as User)
      } */
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
        // console.log({ test: typeof credentials?.callbackUrl })
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
          .catch((err) => console.log(err));

        if (!user) {
          return null;
        }

        const session = jwtDecode<IJwtDecode>(user.tokens.access.token);

        return {
          id: session.sub,
          name: session.name,
          email: session.email,
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
  session: {
    strategy: "jwt",
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
