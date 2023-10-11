import type { IItem } from "./item";
import type { IItemType } from "./item-type";
import type { IUnit } from "./unit";

export interface IItemCategory {
  id: string
  name: string
  note: string | null
  isActive: boolean
  createdAt: Date
  createdBy: string
  updatedAt: Date
  updatedBy: string | null
  itemTypeId: string
  unitId: string
  itemType?: IItemType;
  unit?: IUnit;
  items?: IItem[];
}

export type IItemCategoryMutation = Pick<IItemCategory,
  | "itemTypeId"
  | "name"
  | "note"
  | "isActive"
>