import useInfiniteItemCategory from "@/components/hooks/options/masters/useInfiniteItemCategory";
import type { AutoDefault } from "@/types/options";
import React from "react";
import { type FieldValues } from "react-hook-form";
import {
  AutocompleteElement,
  type AutocompleteElementProps,
} from "react-hook-form-mui";

const AutocompleteItemCategory = <TFieldValues extends FieldValues>(
  props: Omit<
    AutocompleteElementProps<
      TFieldValues,
      AutoDefault | string,
      boolean | undefined,
      boolean | undefined
    >,
    "options"
  >,
): JSX.Element => {
  const {
    options: optionsItemCategory,
    isFetching: isFetchingItemCategory,
    renderOption: renderOptionItemCategory,
    onSearch: onSearchItemCategory,
  } = useInfiniteItemCategory();

  return (
    <AutocompleteElement
      {...props}
      options={optionsItemCategory}
      loading={isFetchingItemCategory}
      textFieldProps={{
        ...props.textFieldProps,
        onChange: onSearchItemCategory,
      }}
      autocompleteProps={{
        ...props.autocompleteProps,
        onClose: () => onSearchItemCategory(),
        renderOption: renderOptionItemCategory,
        disableClearable: props.required,
        autoHighlight: true,
        openOnFocus: true,
      }}
    />
  );
};

export default AutocompleteItemCategory;
