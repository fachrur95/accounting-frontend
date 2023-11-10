import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import axios from "axios";
import { env } from "@/env.mjs";
import { z } from "zod";
import type { ISessionResponse } from "@/types/session";
import type { IUser } from "@/types/prisma-api/user";
import type { ApiCatchError } from "@/types/api-response";

export const sessionRouter = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx }) => {
    const result = await axios.get<ISessionResponse>(
      `${env.BACKEND_URL}/v1/auth/session`,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${ctx.session.accessToken}` },
      }
    ).then((response) => {
      return response.data;
    }).catch((err) => {
      console.log(err)
      return null
    });

    return result;
  }),
  update: protectedProcedure.input(
    z.object({
      email: z.string(),
      name: z.string().nullish(),
      password: z.string(),
      newPassword: z.string().nullish(),
    }),
  ).mutation(async ({ ctx, input }) => {
    try {
      const result = await axios.patch<IUser>(
        `${env.BACKEND_URL}/v1/auth/update`,
        input,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${ctx.session.accessToken}` },
        }
      ).then((response) => {
        return response.data;
      });

      return result;
    } catch (error) {
      throw new Error((error as ApiCatchError).response?.data?.message ?? (error as ApiCatchError).message ?? "An error occurred");
    }
  }),
});
