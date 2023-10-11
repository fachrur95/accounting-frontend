import type { IUser } from "./prisma-api/user";

export interface ITokenData {
  access: {
    token: string;
    expires: Date;
  };
  refresh: {
    token: string;
    expires: Date;
  };
}
export interface ITokenResponse {
  tokens: ITokenData
}

export interface ITokenLoginResponse extends ITokenResponse {
  user?: IUser;
}