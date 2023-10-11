import type { IItem } from "./item";
import type { IItemCogsDetail } from "./item-cogs-detail";
import type { ITransactionDetail } from "./transaction-detail";
import type { IUnit } from "./unit";

export declare interface IItemCogs {
  id: string;
  qty: number;
  qtyStatic: number;
  cogs: number;
  date: Date;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string | null;
  itemId: string;
  transactionDetailId: string;
  unitId: string;
  item?: IItem;
  transactionDetail?: ITransactionDetail;
  unit?: IUnit;
  itemCogsDetails?: IItemCogsDetail[];
}