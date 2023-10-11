import type { ITransaction } from "./transaction";
import type { IUnit } from "./unit";

export declare interface IWarehouse {
  id: string;
  name: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string | null;
  unitId: string;
  unit?: IUnit;
  transactions: ITransaction[];
  transactionDestinations: ITransaction[];
}

export declare type IWarehouseMutation = Pick<IWarehouse,
  | "unitId"
  | "name"
>