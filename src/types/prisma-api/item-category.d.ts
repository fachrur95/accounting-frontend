import type { IDataOption } from "../options";
import type { IItem } from "./item";
import type { IItemType } from "./item-type";
import type { IChartOfAccount } from "./chart-of-account";
import type { IUnit } from "./unit";

export declare interface IItemCategory {
  id: string;
  name: string;
  note?: string | null;
  isActive: boolean;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string | null;
  itemTypeId: string;
  unitId: string;
  itemType?: IItemType;
  stockAccountId?: string | null;
  stockAccount?: IChartOfAccount | null;
  cogsAccountId?: string | null;
  cogsAccount?: IChartOfAccount | null;
  unit?: IUnit;
  items?: IItem[];
}

export declare type IItemCategoryMutation = Pick<IItemCategory,
  | "itemTypeId"
  | "stockAccountId"
  | "cogsAccountId"
  | "name"
  | "note"
  | "isActive"
> & {
  itemType: IDataOption | IItemType | null;
  stockAccount?: IDataOption | IChartOfAccount | null;
  cogsAccount?: IDataOption | IChartOfAccount | null;
}