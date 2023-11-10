import type { IInstitute } from "./prisma-api/institute";
import type { Role } from "./prisma-api/role";
import type { TokenType } from "./prisma-api/token-type";
import type { IUnit } from "./prisma-api/unit";
import type { IUser } from "./prisma-api/user";

export declare interface ISessionResponse extends Pick<IUser, "id" | "email" | "name" | "role"> {
  session?: ISessionData;
}

export declare interface ISessionData {
  institute?: IInstitute;
  unit?: IUnit;
  cashRegister?: ICashRegisterSession | null;
}

export declare interface ICashRegisterSession {
  id: string;
  name: string;
  transactionId: string;
  transactionNumber: string;
  openDate: Date,
  openedBy: string;
}

export declare interface IJwtDecode {
  session?: {
    institute: string | null;
    unit: string | null;
  },
  sub: string;
  name: string;
  email: string;
  role: Role;
  iat: number;
  exp: number;
  type: TokenType;
}