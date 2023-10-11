import type { IItemCategory } from "./item-category";
import type { IUnit } from "./unit";

export declare interface IItemType {
  id: string;
  name: string;
  isStock: boolean;
  isSale: boolean;
  isPurchase: boolean;
  isAdjustment: boolean;
  isTransfer: boolean;
  note: string | null;
  isActive: boolean;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string | null;
  unitId: string;
  unit?: IUnit;
  itemCategories?: IItemCategory[];
}

export declare type IItemTypeMutation = Pick<IItemType,
  | "name"
  | "isStock"
  | "isSale"
  | "isPurchase"
  | "isAdjustment"
  | "isTransfer"
  | "note"
  | "isActive"
>