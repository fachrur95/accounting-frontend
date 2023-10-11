import type { IAccountClass } from "./account-class";
import type { IChartOfAccount } from "./chart-of-account";
import type { Vector } from "./vector";

export interface IAccountSubClass {
  id: string
  code: string
  group: string | null
  name: string
  balanceSheetPosition: Vector
  createdAt: Date
  createdBy: string
  updatedAt: Date
  updatedBy: string | null
  accountClassId: string
  accountClass?: IAccountClass;
  chartOfAccounts?: IChartOfAccount[];
}

export type IAccountSubClassMutation = Pick<IAccountSubClass,
  | "accountClassId"
  | "code"
  | "group"
  | "name"
  | "balanceSheetPosition"
>