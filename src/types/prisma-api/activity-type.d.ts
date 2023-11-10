/* export declare type ActivityType =
  | "REGISTER"
  | "LOGIN"
  | "LOGOUT"
  | "VERIFY_EMAIL"
  | "RESET_PASSWORD"
  | "VIEW"
  | "READ"
  | "INSERT"
  | "UPDATE"
  | "DELETE"; */

export enum ActivityType {
  REGISTER = "REGISTER",
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  VERIFY_EMAIL = "VERIFY_EMAIL",
  RESET_PASSWORD = "RESET_PASSWORD",
  VIEW = "VIEW",
  READ = "READ",
  INSERT = "INSERT",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
}