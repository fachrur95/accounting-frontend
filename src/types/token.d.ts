import type { IUser } from "./prisma-api/user";

export declare interface ITokenData {
  access: {
    token: string;
    expires: Date;
  };
  refresh: {
    token: string;
    expires: Date;
  };
}
export declare interface ITokenResponse {
  tokens: ITokenData
}

export declare interface ITokenLoginResponse extends ITokenResponse {
  user?: IUser;
}