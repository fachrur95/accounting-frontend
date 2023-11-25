import useInfinitePeopleCategory from "@/components/hooks/options/masters/useInfinitePeopleCategory";
import type { AutoDefault } from "@/types/options";
import React from "react";
import { type FieldValues } from "react-hook-form";
import {
  AutocompleteElement,
  type AutocompleteElementProps,
} from "react-hook-form-mui";

const AutocompletePeopleCategory = <TFieldValues extends FieldValues>(
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
  },
): JSX.Element => {
  const { type, ...rest } = props;
  const {
    options: optionsItem,
    isFetching: isFetchingItem,
    renderOption: renderOptionItem,
    onSearch: onSearchItem,
  } = useInfinitePeopleCategory({ type });

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

export default AutocompletePeopleCategory;
