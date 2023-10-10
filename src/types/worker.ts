export interface IEventDeleteWorker {
  path: WorkerPathType | null;
  variant?: "default" | "success" | "error",
  id: string | null;
  message: string | null;
  progress?: number;
}

export type WorkerPathType =
  | "sales-invoice"
  | "sales-order"
  | "sales-quotation"
  | "sales-delivery"
  | "sales-return"
  | "purchase-invoice"
  | "purchase-order"
  | "purchase-quotation"
  | "purchase-delivery"
  | "purchase-return"
  | "revenues"
  | "expenses"
  | "receivable-payments"
  | "payable-payments"
  | "refundReceivable-payments"
  | "writeOffReceivable-payments"
  | "refundPayable-payments"
  | "writeOffPayable-payments"
  | "dp-receivable-payments"
  | "dp-payable-payments"
  | "assembly-quote"
  | "assembly-order"
  | "assembly-direct"
  | "disassembly-quote"
  | "disassembly-order"
  | "disassembly-direct"
  | "transfer-item-quote"
  | "transfer-item-order"
  | "transfer-item-direct"
  | "transfer-funds"
  | "assembly-mass-quote"
  | "assembly-mass-order"
  | "assembly-mass-direct"
  | "stock-adjustments"
  | "stock-instructions"
  | "opname-counts"
  | "journal-entry"
  | "all-trans"
  | "items"
  | "itemsitemcategory"
  | "itemtype"
  | "uom"
  | "brand"
  | "bom"
  | "term"
  | "exchange"
  | "expedition"
  | "tax";

export type DeleteWorkerEventType = {
  route: "procedure";
  path: WorkerPathType;
  data: string[];
}