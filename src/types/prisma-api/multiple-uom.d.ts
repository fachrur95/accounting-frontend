import type { IItem } from "./item";
import type { IPriceBookDetail } from "./price-book-detail";
import type { ITransactionDetail } from "./transaction-detail";
import type { IUnit } from "./unit";
import type { IUnitOfMeasure } from "./unit-of-measure";

export interface IMultipleUom {
  id: string;
  conversionQty: number;
  barcode: string | null;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string | null;
  unitId: string;
  unitOfMeasureId: string;
  itemId: string;
  unit?: IUnit;
  unitOfMeasure?: IUnitOfMeasure;
  item?: IItem;
  priceBookDetails?: IPriceBookDetail[];
  transactionDetails?: ITransactionDetail[];
}