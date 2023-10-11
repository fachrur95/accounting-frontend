import type { IAccountClass } from "./account-class";
import type { ICashRegister } from "./cash-register";
import type { ITransaction } from "./transaction";
import type { ITransactionDetail } from "./transaction-detail";
import type { IUnit } from "./unit";

export declare interface IChartOfAccount {
  id: string;
  code: string;
  group: string | null;
  name: string;
  isActive: boolean;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string | null;
  accountSubClassId: string;
  unitId: string;
  accountSubClass?: IAccountClass;
  unit: IUnit;
  cashRegisterDeposits?: ICashRegister[];
  cashRegisterBeginBalances?: ICashRegister[];
  transactionDetails?: ITransactionDetail[];
  transactions?: ITransaction[];
}

export declare type IChartOfAccountMutation = Pick<IChartOfAccount,
  | "accountSubClassId"
  | "code"
  | "group"
  | "name"
  | "isActive"
>