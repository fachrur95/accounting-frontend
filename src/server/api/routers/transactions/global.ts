import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import axios from "axios";
import { env } from "@/env.mjs";
import { z } from "zod";
import type { ApiCatchError, PaginationResponse } from "@/types/api-response";
import { convertFilterToURL, convertSortToURL } from "@/utils/helpers";
import type { GridFilterModel, GridSortModel } from "@mui/x-data-grid-pro";
import type { ITransaction } from "@/types/prisma-api/transaction";

const transactionType = z.enum([
  "SALE_QUOTATION",
  "SALE_ORDER",
  "SALE_INVOICE",
  "SALE_RETURN",
  "PURCHASE_QUOTATION",
  "PURCHASE_ORDER",
  "PURCHASE_INVOICE",
  "PURCHASE_RETURN",
  "RECEIVABLE_PAYMENT",
  "DEBT_PAYMENT",
  "EXPENSE",
  "REVENUE",
  "TRANSFER_FUND",
  "TRANSFER_ITEM_SEND",
  "TRANSFER_ITEM_RECEIVE",
  "STOCK_OPNAME",
  "JOURNAL_ENTRY",
  "BEGINNING_BALANCE_STOCK",
  "BEGINNING_BALANCE_DEBT",
  "BEGINNING_BALANCE_RECEIVABLE",
  "OPEN_REGISTER",
  "CLOSE_REGISTER",
]);

export const defaultUndefinedResult: PaginationResponse<ITransaction> = {
  rows: [],
  countRows: 0,
  countAll: 0,
  currentPage: 0,
  nextPage: false,
  totalPages: 0,
}

const GLOBAL_URL = `${env.BACKEND_URL}/v1/transactions`;

export const globalTransactionRouter = createTRPCRouter({
  generateNumber: protectedProcedure.input(
    z.object({
      transactionType,
    }),
  ).query(async ({ ctx, input }) => {
    const result = await axios.get<{ transactionNumber: string }>(
      `${GLOBAL_URL}/generate-number/${input.transactionType}`,
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
  findAll: protectedProcedure.input(
    z.object({
      limit: z.number(),
      cursor: z.union([z.string(), z.number()]).nullish(),
      search: z.string().nullish(),
      filter: z.object({
        linkOperator: z.enum(["and", "or"]).optional(),
        items: z.array(
          z.object({
            columnField: z.string(),
            operatorValue: z.string().optional(),
            value: z.any(),
          })
        )
      }).nullish(),
      sort: z.array(
        z.object({
          field: z.string(),
          sort: z.enum(["asc", "desc"]).nullish().default("asc"),
        })
      ).nullish(),
      transactionType: transactionType.nullish(),
    }),
  ).query(async ({ ctx, input }) => {
    const { limit, cursor, search, filter, sort, transactionType } = input;

    let url = `${GLOBAL_URL}?page=${cursor ?? 0}&limit=${limit}`;

    if (transactionType) {
      url += `&transactionType=${transactionType}`;
    }

    if (search && search !== "") {
      url += `&search=${search}`;
    }

    if (filter) {
      url += convertFilterToURL(filter as GridFilterModel)
    }

    if (sort) {
      url += convertSortToURL(sort as GridSortModel)
    }

    const result = await axios.get<PaginationResponse<ITransaction>>(
      url,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${ctx.session.accessToken}` },
      }
    ).then((response) => {
      return response.data;
    }).catch((err) => {
      console.log(err)
      return defaultUndefinedResult;
    });

    return result;
  }),
  findOne: protectedProcedure.input(
    z.object({
      id: z.string(),
    }),
  ).query(async ({ ctx, input }) => {
    const result = await axios.get<ITransaction>(
      `${GLOBAL_URL}/${input.id}`,
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
  destroy: protectedProcedure.input(
    z.object({
      id: z.string(),
    }),
  ).mutation(async ({ ctx, input }) => {
    try {
      const result = await axios.delete<ITransaction>(
        `${GLOBAL_URL}/${input.id}`,
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
