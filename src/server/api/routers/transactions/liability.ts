
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

export const liabilityRouter = createTRPCRouter({
  create: protectedProcedure.input(
    z.object({
      transactionNumber: z.string(),
      chartOfAccountId: z.string(),
      peopleId: z.string().nullish(),
      entryDate: z.date().nullish(),
      note: z.string().nullish(),
      transactionDetails: z.array(
        z.object({
          chartOfAccountId: z.string(),
          taxId: z.string().nullish(),
          priceInput: z.number(),
          discountInput: z.number(),
          note: z.string().nullish(),
        })
      ).min(1),
    }),
  ).mutation(async ({ ctx, input }) => {
    try {
      const result = await axios.post<ITransaction>(
        `${GLOBAL_URL}`,
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
      throw new Error((error as ApiCatchError).message ?? "An error occurred");
    }
  }),
  update: protectedProcedure.input(
    z.object({
      id: z.string(),
      transactionNumber: z.string(),
      chartOfAccountId: z.string(),
      peopleId: z.string().nullish(),
      entryDate: z.date().nullish(),
      note: z.string().nullish(),
      transactionDetails: z.array(
        z.object({
          chartOfAccountId: z.string(),
          taxId: z.string().nullish(),
          priceInput: z.number(),
          discountInput: z.number(),
          note: z.string().nullish(),
        })
      ).min(1),
    }),
  ).mutation(async ({ ctx, input }) => {
    const { id, ...data } = input;
    try {
      const result = await axios.patch<ITransaction>(
        `${GLOBAL_URL}/${id}`,
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
      throw new Error((error as ApiCatchError).message ?? "An error occurred");
    }
  }),
});
