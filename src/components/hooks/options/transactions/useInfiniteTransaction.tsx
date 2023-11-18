import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import type { IDataOption } from "@/types/options";
import type { PaginationResponse } from "@/types/api-response";
import { useInView } from "react-intersection-observer";
import Box from "@mui/material/Box";
import Done from "@mui/icons-material/Done";
import debounce from "lodash.debounce";
import type { ITransaction } from "@/types/prisma-api/transaction";

export const transactionTypeData = {
  sales_quote: "SALE_QUOTATION",
  sales_order: "SALE_ORDER",
  sales_invoice: "SALE_INVOICE",
  sales_return: "SALE_RETURN",
  purchase_quote: "PURCHASE_QUOTATION",
  purchase_order: "PURCHASE_ORDER",
  purchase_invoice: "PURCHASE_INVOICE",
  purchase_return: "PURCHASE_RETURN",
  receivable_payment: "RECEIVABLE_PAYMENT",
  payable_payment: "DEBT_PAYMENT",
  expense: "EXPENSE",
  revenue: "REVENUE",
  transfer_fund: "TRANSFER_FUND",
  transfer_item_send: "TRANSFER_ITEM_SEND",
  transfer_item_receive: "TRANSFER_ITEM_RECEIVE",
  stock_opname: "STOCK_OPNAME",
  stock_adjustment: "STOCK_ADJUSTMENT",
  journal_entry: "JOURNAL_ENTRY",
  begin_balance_stock: "BEGINNING_BALANCE_STOCK",
  begin_balance_debt: "BEGINNING_BALANCE_DEBT",
  begin_balance_receivable: "BEGINNING_BALANCE_RECEIVABLE",
  open_register: "OPEN_REGISTER",
  close_register: "CLOSE_REGISTER",
};

const useInfiniteTransaction = ({
  type,
}: {
  type: keyof typeof transactionTypeData;
}) => {
  const { ref, inView } = useInView();
  const [search, setSearch] = useState<string>("");
  const [options, setOptions] = useState<IDataOption[]>([]);
  const [countAll, setCountAll] = useState<number>(0);
  const { data, hasNextPage, fetchNextPage, isFetching } =
    api.globalTransaction.findAll.useInfiniteQuery(
      { limit: 25, search, transactionType: transactionTypeData[type] },
      {
        getNextPageParam: (lastPage: PaginationResponse<ITransaction>) =>
          typeof lastPage.currentPage === "number" && options.length < countAll
            ? (lastPage.currentPage ?? 0) + 1
            : undefined,
      },
    );

  const onSearch = debounce(
    (event?: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setSearch(event?.target.value ?? "");
    },
    150,
  );

  const renderOption = (
    props: React.HtmlHTMLAttributes<HTMLLIElement>,
    option: IDataOption,
    {
      selected,
      index,
    }: { selected: boolean; index: number; inputValue: string },
  ) => {
    return (
      <li {...props}>
        <div className="flex w-full items-center justify-between">
          {option.label}
          <Box
            component={Done}
            sx={{ width: 17, height: 17, mr: "5px", ml: "-2px" }}
            style={{
              visibility: selected ? "visible" : "hidden",
            }}
          />
        </div>
        {index === options.length - 1 && (
          <div className="invisible" ref={ref}></div>
        )}
      </li>
    );
  };

  useEffect(() => {
    if (data) {
      const dataOptions: IDataOption[] = data?.pages
        .map((page) =>
          page.rows.map((row: ITransaction) => ({
            id: row.id,
            label: row.transactionNumber ?? "-",
          })),
        )
        .flat();
      const dataCountAll: number = data.pages[0]?.countAll ?? 0;
      setOptions(dataOptions);
      setCountAll(dataCountAll);
    }
  }, [data]);

  useEffect(() => {
    if (inView && hasNextPage) {
      void fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return { options, isFetching, renderOption, onSearch };
};

export default useInfiniteTransaction;
