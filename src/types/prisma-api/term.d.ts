import type { ITransaction } from "./transaction";
import type { IUnit } from "./unit";

export interface ITerm {
  id: string;
  name: string;
  period: number;
  note: string | null;
  isActive: boolean;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string | null;
  unitId: string;
  unit?: IUnit;
  transactions?: ITransaction[];
}

export type ITermMutation = Pick<ITerm,
  | "name"
  | "period"
  | "note"
  | "isActive"
>