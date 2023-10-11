import type { IItem } from "./item";
import type { ITransactionDetail } from "./transaction-detail";
import type { IUnit } from "./unit";

export interface ITax {
  id: string;
  name: string;
  rate: number;
  note: string | null;
  isActive: boolean;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string | null;
  unitId: string;
  unit?: IUnit;
  items?: IItem[];
  transactionDetails?: ITransactionDetail[];
}

export type ITaxMutation = Pick<ITax,
  | "name"
  | "rate"
  | "note"
  | "isActive"
>