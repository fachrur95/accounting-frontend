import type { ITransaction } from "./transaction";
import type { IUnit } from "./unit";

export interface IWarehouse {
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

export type IWarehouseMutation = Pick<IWarehouse,
  | "unitId"
  | "name"
>