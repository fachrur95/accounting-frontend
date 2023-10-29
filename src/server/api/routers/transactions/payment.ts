
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import axios from "axios";
import { env } from "@/env.mjs";
import { z } from "zod";
import type { ApiCatchError } from "@/types/api-response";
import type { ITransaction, IPaymentDraft } from "@/types/prisma-api/transaction";

const GLOBAL_URL = `${env.BACKEND_URL}/v1/transactions`;

export const paymentRouter = createTRPCRouter({
  create: protectedProcedure.input(
    z.object({
      transactionNumber: z.string(),
      chartOfAccountId: z.string(),
      peopleId: z.string(),
      entryDate: z.date().nullish(),
      note: z.string().nullish(),
      transactionDetails: z.array(
        z.object({
          transactionPaymentId: z.string(),
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
        `${GLOBAL_URL}/${type}-payment`,
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
      transactionNumber: z.string(),
      chartOfAccountId: z.string(),
      peopleId: z.string().nullish(),
      entryDate: z.date().nullish(),
      note: z.string().nullish(),
      transactionDetails: z.array(
        z.object({
          id: z.string().nullish(),
          transactionPaymentId: z.string(),
          priceInput: z.number(),
          note: z.string().nullish(),
        })
      ).min(1),
      type: z.enum(["debt", "receivable"]),
    }),
  ).mutation(async ({ ctx, input }) => {
    const { type, id, ...data } = input;
    try {
      const result = await axios.patch<ITransaction>(
        `${GLOBAL_URL}/${type}-payment/${id}`,
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
  draft: protectedProcedure.input(
    z.object({
      peopleId: z.string(),
      type: z.enum(["debt", "receivable"]),
    }),
  ).query(async ({ ctx, input }) => {
    const result = await axios.get<IPaymentDraft[]>(
      `${GLOBAL_URL}/payment-draft/${input.type}/${input.peopleId}`,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${ctx.session.accessToken}` },
      }
    ).then((response) => {
      return response.data;
    }).catch((err) => {
      console.log(err)
      return null;
    });

    return result;
  }),
});
