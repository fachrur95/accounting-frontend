import type { IUnit } from "./unit";

export declare interface IFinancialClosing {
  id: string
  entryDate: Date
  createdAt: Date
  createdBy: string
  unitId: string
  unit?: IUnit;
}