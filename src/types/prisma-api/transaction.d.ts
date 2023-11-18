import type { IDataOption } from "../options";
import type { ICashRegister } from "./cash-register";
import type { IChartOfAccount } from "./chart-of-account";
import type { IPeople } from "./people";
import type { ITerm } from "./term";
import type { ITransactionDetail } from "./transaction-detail";
import type { TransactionType } from "./transaction-type";
import type { PaymentType } from "./payment-type";
import type { IUnit } from "./unit";
import type { ITax } from "./tax";
import type { IMultipleUom } from "./multiple-uom";
import type { IItem } from "./item";
// import type { IWarehouse } from "./warehouse";

export declare interface ITransaction {
  id: string;
  transactionType: TransactionType;
  paymentType: PaymentType;
  transactionNumber: string;
  paymentInput: number;
  specialDiscount: number;
  discountGroupInput: number;
  change: number;
  beforeTax: number;
  taxValue: number;
  total: number;
  totalPayment: number;
  underPayment: number;
  entryDate: Date;
  dueDate: Date;
  note?: string | null;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string | null;
  deletedAt: Date | null;
  deletedBy: string | null;
  peopleId: string | null;
  cashierId?: string | null;
  unitId: string;
  termId: string | null;
  // warehouseId?: string | null;
  // warehouseDestinationId?: string | null;
  chartOfAccountId?: string | null;
  cashRegisterId?: string | null;
  transactionParentId?: string | null;
  unitId: string;
  unit?: IUnit;
  people?: IPeople | null;
  cashier?: IPeople | null;
  term?: ITerm | null;
  // // warehouse?: IWarehouse | null;
  // // warehouseDestination?: IWarehouse | null;
  chartOfAccount?: IChartOfAccount | null;
  cashRegister?: ICashRegister | null;
  transactionParent?: ITransaction | null;
  transactionChildren?: ITransaction[];
  transactionDetails?: ITransactionDetail[];
  transactionDetailPayments?: ITransactionDetail[];
}

export declare interface ISalesPurchaseDetailMutation {
  id?: string;
  multipleUomId?: string | null;
  multipleUom?: IDataOption | IMultipleUom | null;
  itemId?: string | null;
  item?: IDataOption | IItem | null;
  chartOfAccountId?: string | null;
  chartOfAccount?: IDataOption | IChartOfAccount | null;
  taxId?: string | null;
  tax?: IDataOption | ITax | null;
  qtyInput: number;
  conversionQty: number;
  priceInput: number;
  discountInput: number;
  note?: string | null;
}

export declare interface ISalesPurchaseDetailReturnMutation {
  id?: string;
  transactionDetailParentId: string;
  multipleUomId?: string | null;
  multipleUom?: IDataOption | IMultipleUom | null;
  itemId?: string | null;
  item?: IDataOption | IItem | null;
  taxId?: string | null;
  tax?: IDataOption | ITax | null;
  qtyInput: number;
  conversionQty: number;
  priceInput: number;
  note?: string | null;
}

export declare interface IStockOpnameDetailMutation {
  id?: string;
  multipleUomId?: string | null;
  multipleUom?: IDataOption | IMultipleUom | null;
  itemId?: string | null;
  item?: IDataOption | IItem | null;
  qtyInput: number;
  conversionQty: number;
  note?: string | null;
}

export declare interface IStockAdjustmentDetailMutation {
  id?: string;
  transactionDetailParentId?: string;
  multipleUomId?: string | null;
  multipleUom?: IDataOption | IMultipleUom | null;
  itemId?: string | null;
  item?: IDataOption | IItem | null;
  qtyCount?: number;
  qtyActual?: number;
  qtyInput: number;
  conversionQty: number;
  note?: string | null;
}

declare interface IPaymentDetailMutation {
  id?: string;
  transactionPaymentId: string;
  transactionPaymentNumber: string;
  entryDate: Date,
  dueDate?: Date,
  underPayment: number;
  remainingPayment: number;
  priceInput: number;
  note?: string | null;
}

declare interface ILiabilityDetailMutation {
  id?: string;
  chartOfAccountId?: string | null;
  chartOfAccount?: IDataOption | IChartOfAccount | null;
  taxId?: string | null;
  tax?: IDataOption | ITax | null;
  priceInput: number;
  discountInput: number;
  note?: string | null;
}

declare interface IJournalEntryDetailMutation {
  id?: string;
  chartOfAccountId?: string | null;
  chartOfAccount?: IDataOption | IChartOfAccount | null;
  debit: number;
  credit: number;
  note?: string | null;
}

declare interface IBeginBalanceStockDetailMutation {
  id?: string;
  multipleUomId: string;
  itemName: string;
  unit: string;
  qtyInput: number;
  conversionQty: number;
  priceInput: number;
  note?: string | null;
}

declare interface IBeginBalanceDebtReceivableDetailMutation {
  id?: string;
  peopleId: string;
  people: IDataOption | IPeople | null;
  entryDate: Date;
  priceInput: number;
  note?: string | null;
}

export declare interface ISalesMutation {
  transactionNumber: string;
  peopleId: string;
  paymentType: PaymentType;
  people: IDataOption | IPeople | null;
  termId?: string;
  term?: IDataOption | ITerm | null;
  entryDate?: Date;
  paymentInput: number;
  specialDiscount?: number;
  discountGroupInput?: number;
  note?: string;
  chartOfAccountId?: string | null;
  chartOfAccount?: IDataOption | IChartOfAccount | null;
  transactionDetails: ISalesPurchaseDetailMutation[];
}

export declare interface IPurchaseMutation {
  transactionNumber: string;
  peopleId: string;
  people: IDataOption | IPeople | null;
  termId?: string;
  term?: IDataOption | ITerm | null;
  chartOfAccountId?: string | null;
  chartOfAccount?: IDataOption | IChartOfAccount | null;
  entryDate?: Date;
  paymentInput: number;
  specialDiscount?: number;
  discountGroupInput?: number;
  note?: string;
  transactionDetails: ISalesPurchaseDetailMutation[];
}

export declare interface IPaymentMutation {
  transactionNumber: string;
  chartOfAccountId?: string | null;
  chartOfAccount?: IDataOption | IChartOfAccount | null;
  peopleId: string;
  people: IDataOption | IPeople | null;
  entryDate: Date;
  note?: string;
  transactionDetails: IPaymentDetailMutation[];
}

export declare interface ILiabilityMutation {
  transactionNumber: string;
  chartOfAccountId?: string | null;
  chartOfAccount?: IDataOption | IChartOfAccount | null;
  peopleId?: string | null;
  people: IDataOption | IPeople | null;
  entryDate: Date;
  note?: string;
  transactionDetails: ILiabilityDetailMutation[];
}

export declare interface ITransferFundMutation {
  transactionNumber: string;
  chartOfAccountId?: string | null;
  chartOfAccount?: IDataOption | IChartOfAccount | null;
  entryDate: Date;
  note?: string;
  transactionDetails: IPaymentDetailMutation[];
}

export declare interface IJournalEntryMutation {
  transactionNumber: string;
  entryDate: Date;
  note?: string;
  transactionDetails: IJournalEntryDetailMutation[];
}

export declare interface IPaymentDraft {
  id: string;
  transactionType: TransactionType;
  transactionNumber: string;
  entryDate: Date;
  dueDate: Date;
  underPayment: number;
  remainingPayment: number;
}

export declare interface IBeginBalanceStockMutation {
  transactionNumber: string;
  chartOfAccountId?: string | null;
  chartOfAccount?: IDataOption | IChartOfAccount | null;
  entryDate: Date;
  note?: string;
  transactionDetails: IBeginBalanceStockDetailMutation[];
}

export declare interface IBeginBalanceDebtReceivableMutation {
  chartOfAccountId?: string | null;
  chartOfAccount?: IDataOption | IChartOfAccount | null;
  transactionDetails: IBeginBalanceDebtReceivableDetailMutation[];
}

export declare interface IBeginBalanceDebtReceivableDetailFormMutation {
  id?: string;
  transactionNumber: string;
  chartOfAccountId?: string | null;
  chartOfAccount?: IDataOption | IChartOfAccount | null;
  peopleId: string;
  people: IDataOption | IPeople | null;
  entryDate: Date;
  underPayment: number;
  note?: string | null;
}

export declare interface ISalesPurchaseReturnMutation {
  transactionNumber: string;
  transactionParentId: string;
  transactionParent: IDataOption | ITransaction | null;
  peopleId: string;
  people: IDataOption | IPeople | null;
  chartOfAccountId?: string | null;
  chartOfAccount?: IDataOption | IChartOfAccount | null;
  entryDate?: Date;
  paymentInput: number;
  note?: string;
  transactionDetails: ISalesPurchaseDetailReturnMutation[];
}

export declare interface IStockOpnameMutation {
  transactionNumber: string;
  entryDate?: Date;
  note?: string;
  transactionDetails: IStockOpnameDetailMutation[];
}

export declare interface IStockAdjustmentMutation {
  transactionNumber: string;
  transactionParentId?: string;
  transactionParent: IDataOption | ITransaction | null;
  entryDate?: Date;
  note?: string;
  transactionDetails: IStockAdjustmentDetailMutation[];
}
