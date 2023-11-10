import type { IAccountSubClass } from "./account-sub-class";
import type { BalanceSheet } from "./balance-sheet";
import type { Vector } from "./vector";
import type { CategoryAccountClass } from "./category-account-class";

export declare interface IAccountClass {
  id: string;
  categoryClass: CategoryAccountClass;
  categoryClassCode?: number | null;
  type: BalanceSheet;
  code: string;
  group?: string | null;
  name: string;
  balanceSheetPosition: Vector;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string | null;
  accountSubClasses?: IAccountSubClass[];
}

export declare type IAccountClassMutation = Pick<IAccountClass,
  | "code"
  | "group"
  | "name"
  | "type"
  | "balanceSheetPosition"
>