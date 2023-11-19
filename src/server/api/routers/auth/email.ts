import { z } from "zod";
import axios from "axios";
import { env } from "@/env.mjs";
import type { ApiCatchError } from "@/types/api-response";
import {
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";

const GLOBAL_URL = `${env.BACKEND_URL}/v1/auth`;

export const emailRouter = createTRPCRouter({
  forgotPassword: publicProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const result = await axios.post<{ message: string }>(
          `${GLOBAL_URL}/forgot-password`,
          input,
          {
            withCredentials: true,
          }
        ).then((response) => {
          return response.data;
        });

        return result;
      } catch (error) {
        throw new Error((error as ApiCatchError).response?.data?.message ?? (error as ApiCatchError).message ?? "An error occurred");
      }
    }),
  resetPassword: publicProcedure
    .input(z.object({ token: z.string(), password: z.string() }))
    .mutation(async ({ input }) => {
      const { token, ...data } = input;
      try {
        const result = await axios.post<{ message: string }>(
          `${GLOBAL_URL}/reset-password?token=${token}`,
          data,
          {
            withCredentials: true,
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
