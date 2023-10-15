import type { ICashRegister } from "./cash-register";
import type { IChartOfAccount } from "./chart-of-account";
import type { IPeople } from "./people";
import type { ITerm } from "./term";
import type { ITransactionDetail } from "./transaction-detail";
import type { TransactionType } from "./transaction-type";
import type { IUnit } from "./unit";
// import type { IWarehouse } from "./warehouse";

export declare interface ITransaction {
  id: string;
  transactionType: TransactionType;
  transactionNumber: string;
  paymentInput: number;
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