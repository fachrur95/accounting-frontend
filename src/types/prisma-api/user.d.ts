import type { IDataOption } from "../options";
import type { Role } from "./role";
import type { IUnit } from "./unit";
import type { IUserUnit } from "./user-unit";

export declare interface IUser {
  id: string;
  email: string;
  name: string | null;
  password: string;
  role: Role;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  userUnits?: IUserUnit[];
}

declare type UserUnitType = {
  id?: string;
  unitId: string,
  unit: IDataOption | IUnit | null,
}

export declare type IUserMutation = Pick<IUser,
  | "email"
  | "name"
  | "role"
  | "password"
> & {
  userUnits: UserUnitType[],
}