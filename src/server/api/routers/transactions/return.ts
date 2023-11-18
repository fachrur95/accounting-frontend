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

export const returnRouter = createTRPCRouter({
  create: protectedProcedure.input(
    z.object({
      transactionParentId: z.string(),
      transactionNumber: z.string(),
      peopleId: z.string(),
      chartOfAccountId: z.string().nullish(),
      paymentInput: z.number(),
      note: z.string().nullish(),
      transactionDetails: z.array(
        z.object({
          transactionDetailParentId: z.string(),
          multipleUomId: z.string(),
          qtyInput: z.number(),
          conversionQty: z.number(),
          priceInput: z.number(),
          note: z.string().nullish(),
        })
      ).min(1),
      type: z.enum(["sales", "purchase"]),
    }),
  ).mutation(async ({ ctx, input }) => {
    const { type, ...data } = input;
    try {
      const result = await axios.post<ITransaction>(
        `${GLOBAL_URL}/${type}-return`,
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
      transactionParentId: z.string(),
      transactionNumber: z.string(),
      peopleId: z.string(),
      chartOfAccountId: z.string().nullish(),
      paymentInput: z.number(),
      note: z.string().nullish(),
      transactionDetails: z.array(
        z.object({
          id: z.string().nullish(),
          transactionDetailParentId: z.string(),
          multipleUomId: z.string(),
          qtyInput: z.number(),
          conversionQty: z.number(),
          priceInput: z.number(),
          note: z.string().nullish(),
        })
      ).min(1),
      type: z.enum(["sales", "purchase"]),
    }),
  ).mutation(async ({ ctx, input }) => {
    const { id, type, ...data } = input;
    try {
      const result = await axios.patch<ITransaction>(
        `${GLOBAL_URL}/${type}-return/${id}`,
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
