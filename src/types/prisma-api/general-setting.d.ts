import type { IDataOption } from "../options";
import type { RecalculateMethod } from "./recalculate-method";
import type { IChartOfAccount } from "./chart-of-account";
import type { IUnit } from "./unit";

export declare interface IGeneralSetting {
  id: string;
  companyName: string;
  address?: string | null;
  additionalMessage?: string | null;
  leader?: string | null;
  accountant?: string | null;
  recalculateMethod: RecalculateMethod;
  isStrictMode: boolean;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  unitId: string;
  unit?: IUnit;
  currentProfitAccountId: string | null;
  debitAccountId: string | null;
  creditAccountId: string | null;
  defaultSalesId: string | null;
  defaultStockId: string | null;
  defaultCogsId: string | null;
  defaultPaymentBankAccountId: string | null;
  defaultPaymentAccountId: string | null;
  currentProfitAccount?: IChartOfAccount | null;
  debitAccount?: IChartOfAccount | null;
  creditAccount?: IChartOfAccount | null;
  defaultSales?: IChartOfAccount | null;
  defaultStock?: IChartOfAccount | null;
  defaultCogs?: IChartOfAccount | null;
  defaultPaymentBankAccount?: IChartOfAccount | null;
  defaultPaymentAccount?: IChartOfAccount | null;
}

export declare type IGeneralSettingMutation = Pick<IGeneralSetting,
  | "companyName"
  | "address"
  | "additionalMessage"
  | "leader"
  | "accountant"
  | "recalculateMethod"
  | "currentProfitAccountId"
  | "debitAccountId"
  | "creditAccountId"
  | "defaultSalesId"
  | "defaultStockId"
  | "defaultCogsId"
  | "defaultPaymentBankAccountId"
  | "defaultPaymentAccountId"
> & {
  currentProfitAccount?: IDataOption | IChartOfAccount | null;
  debitAccount?: IDataOption | IChartOfAccount | null;
  creditAccount?: IDataOption | IChartOfAccount | null;
  defaultSales?: IDataOption | IChartOfAccount | null;
  defaultStock?: IDataOption | IChartOfAccount | null;
  defaultCogs?: IDataOption | IChartOfAccount | null;
  defaultPaymentBankAccount?: IDataOption | IChartOfAccount | null;
  defaultPaymentAccount?: IDataOption | IChartOfAccount | null;
}