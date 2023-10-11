import type { IItemCogs } from "./item-cogs";
import type { ITransactionDetail } from "./transaction-detail";
import type { IUnit } from "./unit";

export declare interface IItemCogsDetail {
  id: string;
  qty: number;
  cogs: number;
  date: Date;
  transactionDetailId: string;
  itemCogsId: string;
  unitId: string;
  transactionDetail?: ITransactionDetail;
  itemCogs?: IItemCogs;
  unit?: IUnit;
}