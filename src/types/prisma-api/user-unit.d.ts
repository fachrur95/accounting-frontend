import type { IUnit } from "./unit";
import type { IUser } from "./user";

export interface IUserUnit {
  id: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string | null;
  userId: string;
  unitId: string;
  user?: IUser;
  unit?: IUnit;
}
