import useInfinitePeople from "@/components/hooks/options/masters/useInfinitePeople";
import type { AutoDefault } from "@/types/options";
import React from "react";
import { type FieldValues } from "react-hook-form";
import {
  AutocompleteElement,
  type AutocompleteElementProps,
} from "react-hook-form-mui";

const AutocompletePeople = <TFieldValues extends FieldValues>(
  props: Omit<
    AutocompleteElementProps<
      TFieldValues,
      AutoDefault | string,
      boolean | undefined,
      boolean | undefined
    >,
    "options"
  > & {
    type?: "customer" | "supplier" | "employee";
    addNew?: boolean;
  },
): JSX.Element => {
  const { type, addNew, ...rest } = props;
  const {
    options: optionsItem,
    isFetching: isFetchingItem,
    renderOption: renderOptionItem,
    onSearch: onSearchItem,
  } = useInfinitePeople({ type, addNew });

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

export default AutocompletePeople;
