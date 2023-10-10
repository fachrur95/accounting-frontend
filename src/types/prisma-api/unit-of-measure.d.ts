import type { IMultipleUom } from "./multiple-uom";
import type { IUnit } from "./unit";

export interface IUnitOfMeasure {
  id: string;
  code: string | null;
  name: string;
  note: string | null;
  isActive: boolean;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string | null;
  unitId: string;
  unit?: IUnit;
  multipleUoms?: IMultipleUom[];
}