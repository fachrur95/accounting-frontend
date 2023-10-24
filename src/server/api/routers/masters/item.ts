import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import axios from "axios";
import { env } from "@/env.mjs";
import { z } from "zod";
import type { ApiCatchError, PaginationResponse } from "@/types/api-response";
import type { IItem } from "@/types/prisma-api/item";
import type { IMultipleUom } from "@/types/prisma-api/multiple-uom";
import { convertFilterToURL, convertSortToURL } from "@/utils/helpers";
import type { GridFilterModel, GridSortModel } from "@mui/x-data-grid-pro";

export const defaultUndefinedResult: PaginationResponse<IItem> = {
  rows: [],
  countRows: 0,
  countAll: 0,
  currentPage: 0,
  nextPage: false,
  totalPages: 0,
}

const GLOBAL_URL = `${env.BACKEND_URL}/v1/items`;

export const itemRouter = createTRPCRouter({
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
      type: z.enum(["sale", "purchase", "stock", "adjustment"]).nullish(),
    }),
  ).query(async ({ ctx, input }) => {
    const { limit, cursor, search, filter, sort, type } = input;

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

    if (type) {
      url += `${type === "sale"
        ? "&itemCategory.itemType.isSale=true"
        : type === "purchase"
          ? "&itemCategory.itemType.isPurchase=true"
          : type === "stock"
            ? "&itemCategory.itemType.isStock=true"
            : type === "adjustment"
              ? "&itemCategory.itemType.isAdjustment=true"
              : ""}`
    }

    const result = await axios.get<PaginationResponse<IItem>>(
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
    const result = await axios.get<IItem>(
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
  scanBarcode: protectedProcedure.input(
    z.object({
      barcode: z.string(),
    }),
  ).query(async ({ ctx, input }) => {
    const result = await axios.get<IMultipleUom>(
      `${GLOBAL_URL}/scan/${input.barcode}`,
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
      code: z.string(),
      description: z.string().nullish(),
      itemCategoryId: z.string(),
      taxId: z.string().nullish(),
      name: z.string(),
      manualCogs: z.number().nullish(),
      price: z.number().nullish(),
      maxQty: z.number().nullish(),
      minQty: z.number().nullish(),
      note: z.string().nullish(),
      isActive: z.boolean(),
      multipleUoms: z.array(
        z.object({
          unitOfMeasureId: z.string(),
          conversionQty: z.number(),
          barcode: z.string().nullish(),
        })
      ).min(1),
      files: z.array(z.string()),
    }),
  ).mutation(async ({ ctx, input }) => {
    try {
      const result = await axios.post<IItem>(
        `${GLOBAL_URL}`,
        input,
        // { ...data, files: dataFiles },
        // formData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${ctx.session.accessToken}`,
            // 'Content-Type': 'multipart/form-data; boundary=' + formData._boundary
          },
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
      code: z.string(),
      description: z.string().nullish(),
      itemCategoryId: z.string(),
      taxId: z.string().nullish(),
      name: z.string(),
      manualCogs: z.number().nullish(),
      price: z.number().nullish(),
      maxQty: z.number().nullish(),
      minQty: z.number().nullish(),
      note: z.string().nullish(),
      isActive: z.boolean(),
      multipleUoms: z.array(
        z.object({
          id: z.string().nullish(),
          unitOfMeasureId: z.string(),
          conversionQty: z.number(),
          barcode: z.string().nullish(),
        })
      ).min(1),
      files: z.array(z.string()).nullish(),
    }),
  ).mutation(async ({ ctx, input }) => {
    const { id, ...data } = input;
    try {
      const result = await axios.patch<IItem>(
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
      const result = await axios.delete<IItem>(
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
