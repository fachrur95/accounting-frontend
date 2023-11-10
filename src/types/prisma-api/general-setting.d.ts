import type { IDataOption } from "../options";
import type { RecalculateMethod } from "./recalculate-method";
import type { IChartOfAccount } from "./chart-of-account";
import type { IUnit } from "./unit";

export declare interface IGeneralSetting {
  id: string;
  companyName: string;
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
  currentProfitAccount?: IChartOfAccount | null;
  debitAccount?: IChartOfAccount | null;
  creditAccount?: IChartOfAccount | null;
}

export declare type IGeneralSettingMutation = Pick<IGeneralSetting,
  | "companyName"
  | "leader"
  | "accountant"
  | "recalculateMethod"
  | "currentProfitAccountId"
  | "debitAccountId"
  | "creditAccountId"
> & {
  currentProfitAccount?: IDataOption | IChartOfAccount | null;
  debitAccount?: IDataOption | IChartOfAccount | null;
  creditAccount?: IDataOption | IChartOfAccount | null;
}