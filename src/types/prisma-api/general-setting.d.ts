import type { RecalculateMethod } from "./recalculate-method";
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
}