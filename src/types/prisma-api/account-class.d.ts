import type { IAccountSubClass } from "./account-sub-class";
import type { BalanceSheet } from "./balance-sheet";
import type { Vector } from "./vector";

export interface IAccountClass {
  id: string;
  type: BalanceSheet;
  code: string;
  group: string | null;
  name: string;
  balanceSheetPosition: Vector;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string | null;
  accountSubClasses?: IAccountSubClass[];
}