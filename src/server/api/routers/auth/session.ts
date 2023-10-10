import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import axios from "axios";
import { env } from "@/env.mjs";
import type { ISessionResponse } from "@/types/session";

export const sessionRouter = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx }) => {
    const result = await axios.get<ISessionResponse>(
      `${env.BACKEND_URL}/v1/auth/session`,
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

});
