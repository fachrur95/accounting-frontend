import type { IInstitute } from "./prisma-api/institute";
import type { TokenType } from "./prisma-api/token-type";
import type { IUnit } from "./prisma-api/unit";
import type { IUser } from "./prisma-api/user";

export interface ISessionResponse extends Pick<IUser, "id" | "email" | "name" | "role"> {
  session?: ISessionData;
}

export interface ISessionData {
  institute?: IInstitute;
  unit?: IUnit;
  cashRegister?: ICashRegisterSession | null;
}

export interface ICashRegisterSession {
  id: string;
  name: string;
  transactionId: string;
  transactionNumber: string;
  openDate: Date,
  openedBy: string;
}

export interface IJwtDecode {
  session: {
    institute: string;
    unit: string;
  },
  sub: string;
  name: string;
  email: string;
  iat: number;
  exp: number;
  type: TokenType;
}