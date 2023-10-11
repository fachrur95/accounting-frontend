import type { TransactionType } from "./transaction-type";
import type { IUnit } from "./unit";

export declare interface IPrefix {
  id: string;
  transactionType: TransactionType;
  name: string;
  prefix: string;
  lastCode: number;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string | null;
  unitId: string;
  unit?: IUnit;
}