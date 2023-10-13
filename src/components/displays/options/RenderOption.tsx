import type { IDataOption } from "@/types/options";
import Box from "@mui/material/Box";
import React, { useEffect } from "react";
import Done from "@mui/icons-material/Done";
import { useInView } from "react-intersection-observer";

interface IRenderOptionProps {
  props: React.HtmlHTMLAttributes<HTMLLIElement>;
  option: IDataOption;
  length: number;
  state: { selected: boolean; index: number; inputValue: string };
  hasNextPage?: boolean;
  fetchNextPage: () => void;
}

const RenderOption = React.forwardRef<HTMLLIElement, IRenderOptionProps>(
  (
    {
      props,
      option,
      state: { selected, index },
      hasNextPage,
      fetchNextPage,
    }: IRenderOptionProps,
    ref,
  ) => {
    const { ref: refInView, inView } = useInView();

    useEffect(() => {
      if (inView && hasNextPage) {
        void fetchNextPage();
      }
    }, [inView, hasNextPage, fetchNextPage]);

    return (
      <li {...props} ref={ref}>
        <Box
          component={Done}
          sx={{ width: 17, height: 17, mr: "5px", ml: "-2px" }}
          style={{
            visibility: selected ? "visible" : "hidden",
          }}
        />
        {option.label}
        {index === length - 1 && (
          <div className="invisible" ref={refInView}></div>
        )}
      </li>
    );
  },
);
RenderOption.displayName = "RenderOption";

export default RenderOption;
