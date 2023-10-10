import type { Role } from "./role";

export interface IUser {
  id: string;
  email: string;
  name: string | null;
  password: string;
  role: Role;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
