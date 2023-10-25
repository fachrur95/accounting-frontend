import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import type { IDataOption } from "@/types/options";
import type { PaginationResponse } from "@/types/api-response";
import { useInView } from "react-intersection-observer";
import Box from "@mui/material/Box";
import Done from "@mui/icons-material/Done";
import debounce from "lodash.debounce";
import type { IUnitOfMeasure } from "@/types/prisma-api/unit-of-measure";

const useInfiniteUnitOfMeasure = () => {
  const { ref, inView } = useInView();
  const [search, setSearch] = useState<string>("");
  const [options, setOptions] = useState<IDataOption[]>([]);
  const [countAll, setCountAll] = useState<number>(0);
  const { data, hasNextPage, fetchNextPage, isFetching } =
    api.unitOfMeasure.findAll.useInfiniteQuery(
      { limit: 25, search },
      {
        getNextPageParam: (lastPage: PaginationResponse<IUnitOfMeasure>) =>
          typeof lastPage.currentPage === "number" && options.length < countAll
            ? (lastPage.currentPage ?? 0) + 1
            : undefined,
      },
    );

  const onSearch = debounce(
    (event?: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setSearch(event?.target.value ?? "");
    },
    500,
  ); // Menunda eksekusi selama 500ms

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
          page.rows.map((row: IUnitOfMeasure) => ({
            id: row.id,
            label: row.code ?? row.name ?? "-",
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

export default useInfiniteUnitOfMeasure;
