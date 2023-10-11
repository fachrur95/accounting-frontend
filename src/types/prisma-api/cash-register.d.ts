import type { IChartOfAccount } from "./chart-of-account";
import type { ITransaction } from "./transaction";
import type { IUnit } from "./unit";

export interface ICashRegister {
  id: string;
  name: string;
  note: string | null;
  isActive: boolean;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string | null;
  depositAccountId: string;
  beginBalanceAccountId: string;
  unitId: string;
  depositAccount?: IChartOfAccount;
  beginBalanceAccount?: IChartOfAccount;
  unit?: IUnit;
  transactions: ITransaction[];
}

export type ICashRegisterMutation = Pick<ICashRegister,
  | "depositAccountId"
  | "beginBalanceAccountId"
  | "name"
  | "note"
  | "isActive"
>