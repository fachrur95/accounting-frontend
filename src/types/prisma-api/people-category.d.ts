import type { IPeople } from "./people";
import type { IPriceBook } from "./price-book";
import type { IUnit } from "./unit";

export declare interface IPeopleCategory {
  id: string;
  code?: string | null;
  name: string;
  discount?: number | null;
  isCustomer: boolean;
  isSupplier: boolean;
  isEmployee: boolean;
  note?: string | null;
  isActive: boolean;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string | null;
  unitId: string;
  unit?: IUnit;
  peoples?: IPeople[];
  priceBooks?: IPriceBook[];
}

export declare type IPeopleCategoryMutation = Pick<IPeopleCategory,
  | "code"
  | "name"
  | "discount"
  | "isCustomer"
  | "isSupplier"
  | "isEmployee"
  | "note"
  | "isActive"
>