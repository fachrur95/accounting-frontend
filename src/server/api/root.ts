import { exampleRouter } from "@/server/api/routers/example";
import { createTRPCRouter } from "@/server/api/trpc";
import { sessionRouter } from "./routers/auth/session";
import { instituteCredentialsRouter } from "./routers/auth/institute";
import { unitCredentialsRouter } from "./routers/auth/unit";
import { accountClassRouter } from "./routers/masters/account-class";
import { accountSubClassRouter } from "./routers/masters/account-sub-class";
import { cashRegisterRouter } from "./routers/masters/cash-register";
import { chartOfAccountRouter } from "./routers/masters/chart-of-account";
import { itemCategoryRouter } from "./routers/masters/item-category";
import { itemTypeRouter } from "./routers/masters/item-type";
import { itemRouter } from "./routers/masters/item";
import { peopleCategoryRouter } from "./routers/masters/people-category";
import { peopleRouter } from "./routers/masters/people";
import { priceBookRouter } from "./routers/masters/price-book";
import { taxRouter } from "./routers/masters/tax";
import { termRouter } from "./routers/masters/term";
import { unitOfMeasureRouter } from "./routers/masters/unit-of-measure";
import { warehouseRouter } from "./routers/masters/warehouse";
import { globalTransactionRouter } from "./routers/transactions/global";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  session: sessionRouter,
  instituteCredentials: instituteCredentialsRouter,
  unitCredentials: unitCredentialsRouter,
  accountClass: accountClassRouter,
  accountSubClass: accountSubClassRouter,
  cashRegister: cashRegisterRouter,
  chartOfAccount: chartOfAccountRouter,
  itemCategory: itemCategoryRouter,
  itemType: itemTypeRouter,
  item: itemRouter,
  peopleCategory: peopleCategoryRouter,
  people: peopleRouter,
  priceBook: priceBookRouter,
  tax: taxRouter,
  term: termRouter,
  unitOfMeasure: unitOfMeasureRouter,
  warehouse: warehouseRouter,
  globalTransaction: globalTransactionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
