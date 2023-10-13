import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import axios from "axios";
import { env } from "@/env.mjs";
import { z } from "zod";
import type { ApiCatchError, PaginationResponse } from "@/types/api-response";
import type { IPeopleCategory } from "@/types/prisma-api/people-category";

export const defaultUndefinedResult: PaginationResponse<IPeopleCategory> = {
  rows: [],
  countRows: 0,
  countAll: 0,
  currentPage: 0,
  nextPage: false,
  totalPages: 0,
}

const GLOBAL_URL = `${env.BACKEND_URL}/v1/people-categories`;

export const peopleCategoryRouter = createTRPCRouter({
  findAll: protectedProcedure.input(
    z.object({
      limit: z.number(),
      cursor: z.union([z.string(), z.number()]).nullish(),
      search: z.string().nullish(),
    }),
  ).query(async ({ ctx, input }) => {
    const { limit, cursor, search } = input;

    let url = `${GLOBAL_URL}?page=${cursor ?? 0}&limit=${limit}`;

    if (search && search !== "") {
      url += `&search=${search}`;
    }

    const result = await axios.get<PaginationResponse<IPeopleCategory>>(
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
    const result = await axios.get<IPeopleCategory>(
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
      code: z.string().nullish(),
      name: z.string(),
      isCustomer: z.boolean(),
      isSupplier: z.boolean(),
      isEmployee: z.boolean(),
      note: z.string().nullish(),
      isActive: z.boolean(),
    }),
  ).mutation(async ({ ctx, input }) => {
    try {
      const result = await axios.post<IPeopleCategory>(
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
      code: z.string().nullish(),
      name: z.string(),
      isCustomer: z.boolean(),
      isSupplier: z.boolean(),
      isEmployee: z.boolean(),
      note: z.string().nullish(),
      isActive: z.boolean(),
    }),
  ).mutation(async ({ ctx, input }) => {
    const { id, ...data } = input
    try {
      const result = await axios.patch<IPeopleCategory>(
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
  destroy: protectedProcedure.input(
    z.object({
      id: z.string(),
    }),
  ).mutation(async ({ ctx, input }) => {
    try {
      const result = await axios.delete<IPeopleCategory>(
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
      throw new Error((error as ApiCatchError).message ?? "An error occurred");
    }
  }),
});
