import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import axios from "axios";
import { env } from "@/env.mjs";
import { z } from "zod";
import type { ITokenData } from "@/types/token";
import type { IInstitute } from "@/types/prisma-api/institute";
import type { ApiCatchError, PaginationResponse } from "@/types/api-response";

export const defaultUndefinedResult: PaginationResponse<IInstitute> = {
  rows: [],
  countRows: 0,
  countAll: 0,
  currentPage: 0,
  nextPage: false,
  totalPages: 0,
}

export const instituteCredentialsRouter = createTRPCRouter({
  getAll: protectedProcedure.input(
    z.object({
      limit: z.number(),
      cursor: z.union([z.string(), z.number()]).nullish(),
      search: z.string().nullish(),
    }),
  ).query(async ({ ctx, input }) => {
    const { limit, cursor, search } = input;

    let url = `${env.BACKEND_URL}/v1/auth/institutes?page=${cursor ?? 0}&limit=${limit}`;

    if (search && search !== "") {
      url += `&search=${search}`;
    }

    const result = await axios.get<PaginationResponse<IInstitute>>(
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
  set: protectedProcedure.input(
    z.object({
      id: z.string(),
    }),
  ).mutation(async ({ ctx, input }) => {
    const { id } = input;

    const result = await axios.post<ITokenData>(
      `${env.BACKEND_URL}/v1/auth/set-institute`,
      {
        instituteId: id,
        refreshToken: ctx.session.refreshToken,
      },
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
  findOne: protectedProcedure.input(
    z.object({
      id: z.string(),
    }),
  ).query(async ({ ctx, input }) => {
    const result = await axios.get<IInstitute>(
      `${env.BACKEND_URL}/v1/institutes/${input.id}`,
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
    }),
  ).mutation(async ({ ctx, input }) => {
    try {
      const result = await axios.post<IInstitute>(
        `${env.BACKEND_URL}/v1/institutes`,
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
    }),
  ).mutation(async ({ ctx, input }) => {
    const { id, ...data } = input
    try {
      const result = await axios.patch<IInstitute>(
        `${env.BACKEND_URL}/v1/institutes/${id}`,
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
      const result = await axios.delete<IInstitute>(
        `${env.BACKEND_URL}/v1/institutes/${input.id}`,
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
