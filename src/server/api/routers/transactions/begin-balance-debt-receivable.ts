import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import axios from "axios";
import { env } from "@/env.mjs";
import { z } from "zod";
import type { ApiCatchError } from "@/types/api-response";
import type { ITransaction } from "@/types/prisma-api/transaction";

const GLOBAL_URL = `${env.BACKEND_URL}/v1/transactions`;

export const beginBalanceDebtReceivableRouter = createTRPCRouter({
  create: protectedProcedure.input(
    z.object({
      chartOfAccountId: z.string(),
      transactionDetails: z.array(
        z.object({
          peopleId: z.string(),
          entryDate: z.date(),
          priceInput: z.number(),
          note: z.string().nullish(),
        })
      ).min(1),
      type: z.enum(["debt", "receivable"]),
    }),
  ).mutation(async ({ ctx, input }) => {
    const { type, ...data } = input;
    try {
      const result = await axios.post<ITransaction>(
        `${GLOBAL_URL}/beginning-balance-${type}`,
        data,
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
  update: protectedProcedure.input(
    z.object({
      id: z.string(),
      chartOfAccountId: z.string(),
      transactionDetails: z.array(
        z.object({
          id: z.string().nullish(),
          peopleId: z.string(),
          entryDate: z.date(),
          priceInput: z.number(),
          note: z.string().nullish(),
        })
      ).min(1),
      type: z.enum(["debt", "receivable"]),
    }),
  ).mutation(async ({ ctx, input }) => {
    const { id, type, ...data } = input;
    try {
      const result = await axios.patch<ITransaction>(
        `${GLOBAL_URL}/beginning-balance-${type}/${id}`,
        data,
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
