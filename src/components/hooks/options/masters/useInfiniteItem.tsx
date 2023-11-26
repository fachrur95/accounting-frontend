import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import type { IDataOption } from "@/types/options";
import type { PaginationResponse } from "@/types/api-response";
import { useInView } from "react-intersection-observer";
import Box from "@mui/material/Box";
import Done from "@mui/icons-material/Done";
import debounce from "lodash.debounce";
import type { IItem } from "@/types/prisma-api/item";
import Image from "next/image";
import Avatar from "@mui/material/Avatar";
import ImageNotSupported from "@mui/icons-material/ImageNotSupported";
import { stringAvatar } from "@/utils/helpers";

const useInfiniteItem = ({
  type,
  addNew,
}: {
  type?: "sale" | "purchase" | "stock" | "adjustment";
  addNew?: boolean;
}) => {
  const { ref, inView } = useInView();
  const [search, setSearch] = useState<string>("");
  const [options, setOptions] = useState<IDataOption[]>([]);
  const [countAll, setCountAll] = useState<number>(0);
  const { data, hasNextPage, fetchNextPage, isFetching } =
    api.item.findAll.useInfiniteQuery(
      { limit: 25, search, type },
      {
        getNextPageParam: (lastPage: PaginationResponse<IItem>) =>
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
          {/* <Box className="flex flex-row items-center gap-2">
            {typeof option.image === "string" ? (
              <Image
                src={option.image}
                alt={option.label}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <Avatar {...stringAvatar(option.label)} />
            )} */}
          {option.label}
          {/* </Box> */}
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
          page.rows.map((row: IItem) => ({
            id: row.id,
            label: `${row.code} - ${row.name}` ?? "-",
            price: row.price ?? 0,
            image: row.images?.[0]?.imageUrl ?? undefined,
          })),
        )
        .flat();
      const dataCountAll: number = data.pages[0]?.countAll ?? 0;
      if (addNew) {
        const isExisting = dataOptions.some(
          (opt) => opt.label.toLowerCase() === search.toLowerCase(),
        );
        if (search !== "" && !isExisting) {
          dataOptions.push({
            label: `Tambah "${search}"`,
            inputValue: search,
          });
        }
      }
      setOptions(dataOptions);
      setCountAll(dataCountAll);
    }
  }, [data, search, addNew]);

  useEffect(() => {
    if (inView && hasNextPage) {
      void fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return { options, isFetching, renderOption, onSearch };
};

export default useInfiniteItem;
