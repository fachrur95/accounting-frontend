import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import axios from "axios";
import { env } from "@/env.mjs";
import { z } from "zod";
import type {
  IResultDashboardTransactionDaily,
  IResultDashboardTransactionMonthly,
  IResultDashboardTotalOnly,
} from "@/types/dashboard";

const GLOBAL_URL = `${env.BACKEND_URL}/v1/dashboards`;

export const dashboardRouter = createTRPCRouter({
  transactionDaily: protectedProcedure.input(
    z.object({
      type: z.enum(["sales", "purchase"]),
      startDate: z.date(),
      endDate: z.date(),
    }),
  ).query(async ({ ctx, input }) => {
    const { type, startDate, endDate } = input;

    const url = `${GLOBAL_URL}/transaction-daily/${type}/${startDate.toISOString()}/${endDate.toISOString()}`;

    const result = await axios.get<IResultDashboardTransactionDaily[]>(
      url,
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
  transactionMonthly: protectedProcedure.input(
    z.object({
      type: z.enum(["sales", "purchase"]),
      startDate: z.date(),
      endDate: z.date(),
    }),
  ).query(async ({ ctx, input }) => {
    const { type, startDate, endDate } = input;

    const url = `${GLOBAL_URL}/transaction-monthly/${type}/${startDate.toISOString()}/${endDate.toISOString()}`;

    const result = await axios.get<IResultDashboardTransactionMonthly[]>(
      url,
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
  debtReceivableTotal: protectedProcedure.input(
    z.object({
      type: z.enum(["debt", "receivable"]),
      startDate: z.date(),
      endDate: z.date(),
    }),
  ).query(async ({ ctx, input }) => {
    const { type, startDate, endDate } = input;

    const url = `${GLOBAL_URL}/debt-receivable-total/${type}/${startDate.toISOString()}/${endDate.toISOString()}`;

    const result = await axios.get<IResultDashboardTotalOnly>(
      url,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${ctx.session.accessToken}` },
      }
    ).then((response) => {
      return response.data.total;
    }).catch((err) => {
      console.log(err)
      return null;
    });

    return result;
  }),
  income: protectedProcedure.input(
    z.object({
      startDate: z.date(),
      endDate: z.date(),
    }),
  ).query(async ({ ctx, input }) => {
    const { startDate, endDate } = input;

    const url = `${GLOBAL_URL}/income/${startDate.toISOString()}/${endDate.toISOString()}`;

    const result = await axios.get<IResultDashboardTotalOnly>(
      url,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${ctx.session.accessToken}` },
      }
    ).then((response) => {
      return response.data.total;
    }).catch((err) => {
      console.log(err)
      return null;
    });

    return result;
  }),
  expense: protectedProcedure.input(
    z.object({
      startDate: z.date(),
      endDate: z.date(),
    }),
  ).query(async ({ ctx, input }) => {
    const { startDate, endDate } = input;

    const url = `${GLOBAL_URL}/expense/${startDate.toISOString()}/${endDate.toISOString()}`;

    const result = await axios.get<IResultDashboardTotalOnly>(
      url,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${ctx.session.accessToken}` },
      }
    ).then((response) => {
      return response.data.total;
    }).catch((err) => {
      console.log(err)
      return null;
    });

    return result;
  }),
  profitLoss: protectedProcedure.input(
    z.object({
      startDate: z.date(),
      endDate: z.date(),
    }),
  ).query(async ({ ctx, input }) => {
    const { startDate, endDate } = input;

    const url = `${GLOBAL_URL}/profit-loss/${startDate.toISOString()}/${endDate.toISOString()}`;

    const result = await axios.get<IResultDashboardTotalOnly>(
      url,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${ctx.session.accessToken}` },
      }
    ).then((response) => {
      return response.data.total;
    }).catch((err) => {
      console.log(err)
      return null;
    });

    return result;
  }),
});
