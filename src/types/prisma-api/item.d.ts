import type { IImage } from "./image";
import type { IItemCategory } from "./item-category";
import type { IItemCogs } from "./item-cogs";
import type { IMultipleUom } from "./multiple-uom";
import type { ITax } from "./tax";
import type { IUnit } from "./unit";

export declare interface IItem {
  id: string;
  code: string;
  name: string;
  description: string | null;
  note: string | null;
  isActive: boolean;
  minQty: number;
  maxQty: number;
  manualCogs: number;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string | null;
  taxId: string | null;
  itemCategoryId: string;
  unitId: string;
  unit?: IUnit;
  itemCategory?: IItemCategory;
  tax?: ITax | null;
  images?: IImage[];
  multipleUoms?: IMultipleUom[];
  itemCogs?: IItemCogs[];
}

export declare interface IItemMutation extends Pick<IItem,
  | "itemCategoryId"
  | "taxId"
  | "code"
  | "name"
  | "description"
  | "minQty"
  | "maxQty"
  | "note"
  | "isActive"
  | "multipleUoms"
> {
  multipleUom: Pick<IMultipleUom, "unitOfMeasureId" | "conversionQty" | "barcode">[];
  files: string[];
}