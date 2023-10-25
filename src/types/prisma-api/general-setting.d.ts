import type { IDataOption } from "../options";
import type { RecalculateMethod } from "./recalculate-method";
import type { IChartOfAccount } from "./chart-of-account";
import type { IUnit } from "./unit";

export declare interface IGeneralSetting {
  id: string;
  companyName: string;
  recalculateMethod: RecalculateMethod;
  isStrictMode: boolean;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  unitId: string;
  unit?: IUnit;
  debitAccountId: string | null;
  creditAccountId: string | null;
  debitAccount?: IChartOfAccount | null;
  creditAccount?: IChartOfAccount | null;
}

export declare type IGeneralSettingMutation = Pick<IGeneralSetting,
  | "companyName"
  | "recalculateMethod"
  | "debitAccountId"
  | "creditAccountId"
> & {
  debitAccount?: IDataOption | IChartOfAccount | null;
  creditAccount?: IDataOption | IChartOfAccount | null;
}