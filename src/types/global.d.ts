export declare type FormSlugType = ["f" | "v", string | undefined];

export declare type ItemFilter = {
  columnField: string,
  operatorValue: string,
  value: string | number,
}

export declare type FilterType = {
  linkOperator: "and" | "or",
  items: ItemFilter[]
}