import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import axios from "axios";
import { env } from "@/env.mjs";
import { z } from "zod";
import type { ApiCatchError } from "@/types/api-response";
import type { IGeneralSetting } from "@/types/prisma-api/general-setting";

const GLOBAL_URL = `${env.BACKEND_URL}/v1/general-settings`;

export const generalSettingRouter = createTRPCRouter({
  update: protectedProcedure.input(
    z.object({
      companyName: z.string(),
      recalculateMethod: z.enum(["FIFO", "AVG", "MANUAL"]),
      debitAccountId: z.string().nullish(),
      creditAccountId: z.string().nullish(),
    }),
  ).mutation(async ({ ctx, input }) => {
    try {
      const result = await axios.patch<IGeneralSetting>(
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
});
