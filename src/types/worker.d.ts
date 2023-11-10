export declare interface IEventDeleteWorker {
  path: WorkerPathType | null;
  variant?: "default" | "success" | "error",
  id: string | null;
  message: string | null;
  progress?: number;
}

export declare type WorkerPathType =
  | "account-class"
  | "account-sub-class"
  | "cash-register"
  | "chart-of-account"
  | "item"
  | "item-category"
  | "item-type"
  | "people"
  | "people-category"
  | "price-book"
  | "tax"
  | "term"
  | "unit-of-measure"
  | "financial-closing"
  | "warehouse"
  | "user"
  | "transaction";

export declare type DeleteWorkerEventType = {
  path: WorkerPathType;
  data: string[];
}