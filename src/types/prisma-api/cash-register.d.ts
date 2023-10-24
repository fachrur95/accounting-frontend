import type { IDataOption } from "../options";
import type { IChartOfAccount } from "./chart-of-account";
import type { ITransaction } from "./transaction";
import type { IUnit } from "./unit";

export declare interface ICashRegister {
  id: string;
  name: string;
  note?: string | null;
  isActive: boolean;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string | null;
  mainAccountId: string;
  depositAccountId: string;
  beginBalanceAccountId: string;
  unitId: string;
  mainAccount?: IChartOfAccount;
  depositAccount?: IChartOfAccount;
  beginBalanceAccount?: IChartOfAccount;
  unit?: IUnit;
  transactions: ITransaction[];
}

export declare type ICashRegisterMutation = Pick<ICashRegister,
  | "mainAccountId"
  | "depositAccountId"
  | "beginBalanceAccountId"
  | "name"
  | "note"
  | "isActive"
> & {
  mainAccount: IDataOption | IChartOfAccount | null;
  depositAccount: IDataOption | IChartOfAccount | null;
  beginBalanceAccount: IDataOption | IChartOfAccount | null;
}

export declare type IOpenCashRegisterMutation = {
  transactionNumber: string;
  cashRegisterId: string | null;
  cashRegister: IDataOption | ICashRegister | null;
  amount: number;
}

export declare type ICloseCashRegisterMutation = {
  transactionNumber: string;
  amount: number;
}

export declare type ICashRegisterStatus = {
  id: string;
  name: string;
  status: boolean;
}