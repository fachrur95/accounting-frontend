import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import axios from "axios";
import { env } from "@/env.mjs";
import { z } from "zod";
import type { ApiCatchError, PaginationResponse } from "@/types/api-response";
import type { IItemType } from "@/types/prisma-api/item-type";
import { convertFilterToURL, convertSortToURL } from "@/utils/helpers";
import type { GridFilterModel, GridSortModel } from "@mui/x-data-grid-pro";

export const defaultUndefinedResult: PaginationResponse<IItemType> = {
  rows: [],
  countRows: 0,
  countAll: 0,
  currentPage: 0,
  nextPage: false,
  totalPages: 0,
}

const GLOBAL_URL = `${env.BACKEND_URL}/v1/item-types`;

export const itemTypeRouter = createTRPCRouter({
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
    }),
  ).query(async ({ ctx, input }) => {
    const { limit, cursor, search, filter, sort } = input;

    let url = `${GLOBAL_URL}?page=${cursor ?? 0}&limit=${limit}`;

    if (search && search !== "") {
      url += `&search=${search}`;
    }

    if (filter) {
      url += convertFilterToURL(filter as GridFilterModel)
    }

    if (sort) {
      url += convertSortToURL(sort as GridSortModel)
    }

    const result = await axios.get<PaginationResponse<IItemType>>(
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
    const result = await axios.get<IItemType>(
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
  create: protectedProcedure.input(
    z.object({
      name: z.string(),
      isStock: z.boolean(),
      isSale: z.boolean(),
      isPurchase: z.boolean(),
      isAdjustment: z.boolean(),
      isTransfer: z.boolean(),
      note: z.string().nullish(),
      isActive: z.boolean(),
    }),
  ).mutation(async ({ ctx, input }) => {
    try {
      const result = await axios.post<IItemType>(
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
      throw new Error((error as ApiCatchError).response?.data?.message ?? (error as ApiCatchError).message ?? "An error occurred");
    }
  }),
  update: protectedProcedure.input(
    z.object({
      id: z.string(),
      name: z.string(),
      isStock: z.boolean(),
      isSale: z.boolean(),
      isPurchase: z.boolean(),
      isAdjustment: z.boolean(),
      isTransfer: z.boolean(),
      note: z.string().nullish(),
      isActive: z.boolean(),
    }),
  ).mutation(async ({ ctx, input }) => {
    const { id, ...data } = input
    try {
      const result = await axios.patch<IItemType>(
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
      throw new Error((error as ApiCatchError).response?.data?.message ?? (error as ApiCatchError).message ?? "An error occurred");
    }
  }),
  destroy: protectedProcedure.input(
    z.object({
      id: z.string(),
    }),
  ).mutation(async ({ ctx, input }) => {
    try {
      const result = await axios.delete<IItemType>(
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
