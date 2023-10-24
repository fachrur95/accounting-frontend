import type { Role } from "./role";

export declare interface IUser {
  id: string;
  email: string;
  name: string | null;
  password: string;
  role: Role;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export declare type IUserMutation = Pick<IUser,
  | "email"
  | "name"
  | "role"
>