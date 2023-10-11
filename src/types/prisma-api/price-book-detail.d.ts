import type { IMultipleUom } from "./multiple-uom";
import type { IPriceBook } from "./price-book";

export declare interface IPriceBookDetail {
  id: string;
  qty: number;
  price: number;
  discount: number;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string | null;
  priceBookId: string;
  multipleUomId: string;
  priceBook?: IPriceBook;
  multipleUom?: IMultipleUom;
}