import type { IChartOfAccount } from "./chart-of-account";
import type { IItemCogs } from "./item-cogs";
import type { IItemCogsDetail } from "./item-cogs-detail";
import type { IMultipleUom } from "./multiple-uom";
import type { ITax } from "./tax";
import type { ITransaction } from "./transaction";
import type { Vector } from "./vector";

export declare interface ITransactionDetail {
  id: string;
  qtyInput: number;
  priceInput: number;
  discountInput: number;
  conversionQty: number;
  taxRate: number;
  vector: Vector;
  qty: number;
  beforeDiscount: number;
  discount: number;
  amount: number;
  taxValue: number;
  total: number;
  note?: string | null;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string | null;
  transactionId: string;
  transactionPaymentId?: string | null;
  transactionDetailParentId?: string | null;
  multipleUomId?: string | null;
  taxId?: string | null;
  chartOfAccountId?: string | null;
  transaction?: ITransaction;
  transactionPayment?: ITransaction | null;
  transactionDetailParent?: ITransactionDetail | null;
  multipleUom?: IMultipleUom | null;
  tax?: ITax | null;
  chartOfAccount?: IChartOfAccount | null;
  itemCogs?: IItemCogs | null;
  itemCogsDetails?: IItemCogsDetail[];
}