import { exampleRouter } from "@/server/api/routers/example";
import { createTRPCRouter } from "@/server/api/trpc";
import { sessionRouter } from "./routers/auth/session";
import { userRouter } from "./routers/auth/user";
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
import { multipleUomRouter } from "./routers/masters/multiple-uom";
import { warehouseRouter } from "./routers/masters/warehouse";
import { globalTransactionRouter } from "./routers/transactions/global";
import { liabilityRouter } from "./routers/transactions/liability";
import { paymentRouter } from "./routers/transactions/payment";
import { journalEntryRouter } from "./routers/transactions/journal-entry";
import { salesRouter } from "./routers/transactions/sales";
import { purchaseRouter } from "./routers/transactions/purchase";
import { generalSettingRouter } from "./routers/general-setting";
import { logActivityRouter } from "./routers/log-activity";
import { dashboardRouter } from "./routers/dashboard";
import { financialClosingRouter } from "./routers/transactions/financial-closing";
import { beginBalanceStockRouter } from "./routers/transactions/begin-balance-stock";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  session: sessionRouter,
  user: userRouter,
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
  multipleUom: multipleUomRouter,
  warehouse: warehouseRouter,
  globalTransaction: globalTransactionRouter,
  liability: liabilityRouter,
  payment: paymentRouter,
  journalEntry: journalEntryRouter,
  sales: salesRouter,
  purchase: purchaseRouter,
  generalSetting: generalSettingRouter,
  logActivity: logActivityRouter,
  dashboard: dashboardRouter,
  financialClosing: financialClosingRouter,
  beginBalanceStock: beginBalanceStockRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
