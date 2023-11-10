import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import axios from "axios";
import { env } from "@/env.mjs";
import { z } from "zod";
// import type { ApiCatchError } from "@/types/api-response";

const GLOBAL_URL = `${env.BACKEND_URL}/v1/reports/balance-sheet/pdf`;

export const balanceSheetReportRouter = createTRPCRouter({
  pdf: protectedProcedure.input(
    z.object({
      startDate: z.date(),
      endDate: z.date(),
    }),
  ).query(async ({ ctx, input }) => {
    const url = `${GLOBAL_URL}/${input.startDate.toISOString()}/${input.endDate.toISOString()}`;
    const result = await axios.get<Buffer>(
      url,
      {
        withCredentials: true,
        responseType: 'arraybuffer',
        headers: {
          Authorization: `Bearer ${ctx.session.accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/pdf',
        },
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
