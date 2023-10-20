import type { IDataOption } from "../options";
import type { IImage } from "./image";
import type { IItemCategory } from "./item-category";
import type { IItemCogs } from "./item-cogs";
import type { IMultipleUom } from "./multiple-uom";
import type { ITax } from "./tax";
import type { IUnit } from "./unit";
import type { IUnitOfMeasure } from "./unit-of-measure";

export declare interface IItem {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  note?: string | null;
  isActive: boolean;
  minQty: number;
  maxQty: number;
  manualCogs: number;
  price: number;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy?: string | null;
  taxId?: string | null;
  itemCategoryId: string;
  unitId: string;
  unit?: IUnit;
  itemCategory?: IItemCategory;
  tax?: ITax | null;
  images?: IImage[];
  multipleUoms: IMultipleUom[];
  itemCogs?: IItemCogs[];
}

export type IMultipleUomMutation = {
  id?: string;
  unitOfMeasureId: string,
  conversionQty: number,
  barcode?: string,
  unitOfMeasure: IDataOption | IUnitOfMeasure | null,
}

// export declare interface IItemMutation extends Pick<IItem,
//   | "itemCategoryId"
//   | "taxId"
//   | "code"
//   | "name"
//   | "description"
//   | "minQty"
//   | "maxQty"
//   | "note"
//   | "isActive"
// // | "multipleUoms"
// > 
export declare interface IItemMutation {
  itemCategoryId: string;
  taxId?: string | null;
  itemCategory: IDataOption | IItemCategory | null;
  tax?: IDataOption | ITax | null;
  code: string;
  name: string;
  description?: string;
  minQty: number;
  maxQty: number;
  manualCogs?: number;
  price?: number;
  note?: string;
  isActive: boolean;
  multipleUoms: IMultipleUomMutation[];
  files: string[];
  // multipleUoms: (Pick<IMultipleUom, "unitOfMeasureId" | "conversionQty" | "barcode"> & { id?: string, unitOfMeasure: IUnitOfMeasure | null })[];
}