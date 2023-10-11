import type { IPeopleCategory } from "./people-category";
import type { ITransaction } from "./transaction";
import type { IUnit } from "./unit";

export interface IPeople {
  id: string;
  code: string | null;
  name: string;
  note: string | null;
  isActive: boolean;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string | null;
  peopleCategoryId: string;
  unitId: string;
  unit?: IUnit;
  peopleCategory?: IPeopleCategory;
  transactionPeoples?: ITransaction[];
  transactionCashiers?: ITransaction[];
}

export type IPeopleMutation = Pick<IPeople,
  | "peopleCategoryId"
  | "code"
  | "name"
  | "note"
  | "isActive"
>