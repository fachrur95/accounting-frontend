import useInfiniteChartOfAccount from "@/components/hooks/options/masters/useInfiniteChartOfAccount";
import type { AutoDefault } from "@/types/options";
import React from "react";
import { type FieldValues } from "react-hook-form";
import {
  AutocompleteElement,
  type AutocompleteElementProps,
} from "react-hook-form-mui";

const AutocompleteChartOfAccount = <TFieldValues extends FieldValues>(
  props: Omit<
    AutocompleteElementProps<
      TFieldValues,
      AutoDefault | string,
      boolean | undefined,
      boolean | undefined
    >,
    "options"
  > & {
    type?: "cash-bank" | "bank";
  },
): JSX.Element => {
  const { type, ...rest } = props;
  const {
    options: optionsItem,
    isFetching: isFetchingItem,
    renderOption: renderOptionItem,
    onSearch: onSearchItem,
  } = useInfiniteChartOfAccount({ type });

  return (
    <AutocompleteElement
      {...rest}
      options={optionsItem}
      loading={isFetchingItem}
      textFieldProps={{
        ...rest.textFieldProps,
        onChange: onSearchItem,
      }}
      autocompleteProps={{
        ...rest.autocompleteProps,
        onClose: () => onSearchItem(),
        renderOption: renderOptionItem,
        disableClearable: rest.required,
        autoHighlight: true,
        openOnFocus: true,
      }}
    />
  );
};

export default AutocompleteChartOfAccount;
