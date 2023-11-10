import type { IUnit } from "./unit";

export declare interface IFinancialClosing {
  id: string;
  entryDate: Date;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string | null;
  unitId: string
  unit?: IUnit;
}

export declare interface IFinancialClosingMutation {
  entryDate: Date;
}