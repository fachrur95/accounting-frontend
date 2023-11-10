// export declare type TransactionType =
//   | "SALE_QUOTATION"
//   | "SALE_ORDER"
//   | "SALE_INVOICE"
//   | "SALE_RETURN"
//   | "PURCHASE_QUOTATION"
//   | "PURCHASE_ORDER"
//   | "PURCHASE_INVOICE"
//   | "PURCHASE_RETURN"
//   | "RECEIVABLE_PAYMENT"
//   | "DEBT_PAYMENT"
//   | "DOWN_PAYMENT_RECEIVE"
//   | "DOWN_PAYMENT_DEBT"
//   | "EXPENSE"
//   | "REVENUE"
//   | "TRANSFER_FUND"
//   | "TRANSFER_ITEM_SEND"
//   | "TRANSFER_ITEM_RECEIVE"
//   | "STOCK_OPNAME"
//   | "JOURNAL_ENTRY"
//   | "BEGINNING_BALANCE_STOCK"
//   | "BEGINNING_BALANCE_DEBT"
//   | "BEGINNING_BALANCE_RECEIVABLE"
//   | "OPEN_REGISTER"
//   | "CLOSE_REGISTER";

export enum TransactionType {
  SALE_QUOTATION = "SALE_QUOTATION",
  SALE_ORDER = "SALE_ORDER",
  SALE_INVOICE = "SALE_INVOICE",
  SALE_RETURN = "SALE_RETURN",
  PURCHASE_QUOTATION = "PURCHASE_QUOTATION",
  PURCHASE_ORDER = "PURCHASE_ORDER",
  PURCHASE_INVOICE = "PURCHASE_INVOICE",
  PURCHASE_RETURN = "PURCHASE_RETURN",
  RECEIVABLE_PAYMENT = "RECEIVABLE_PAYMENT",
  DEBT_PAYMENT = "DEBT_PAYMENT",
  DOWN_PAYMENT_RECEIVE = "DOWN_PAYMENT_RECEIVE",
  DOWN_PAYMENT_DEBT = "DOWN_PAYMENT_DEBT",
  EXPENSE = "EXPENSE",
  REVENUE = "REVENUE",
  TRANSFER_FUND = "TRANSFER_FUND",
  TRANSFER_ITEM_SEND = "TRANSFER_ITEM_SEND",
  TRANSFER_ITEM_RECEIVE = "TRANSFER_ITEM_RECEIVE",
  STOCK_OPNAME = "STOCK_OPNAME",
  JOURNAL_ENTRY = "JOURNAL_ENTRY",
  BEGINNING_BALANCE_STOCK = "BEGINNING_BALANCE_STOCK",
  BEGINNING_BALANCE_DEBT = "BEGINNING_BALANCE_DEBT",
  BEGINNING_BALANCE_RECEIVABLE = "BEGINNING_BALANCE_RECEIVABLE",
  OPEN_REGISTER = "OPEN_REGISTER",
  CLOSE_REGISTER = "CLOSE_REGISTER",
}