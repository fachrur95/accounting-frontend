import type { IUser } from "./prisma-api/user";

export interface ITokenResponse {
  tokens: {
    access: {
      token: string;
      expires: Date;
    };
    refresh: {
      token: string;
      expires: Date;
    };
  }
}

export interface ITokenLoginResponse extends ITokenResponse {
  user?: IUser;
}