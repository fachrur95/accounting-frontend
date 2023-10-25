import type { IUnit } from "./unit";
import type { IUser } from "./user";

export declare interface IUserUnit {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  unitId: string;
  user?: IUser;
  unit?: IUnit;
}
