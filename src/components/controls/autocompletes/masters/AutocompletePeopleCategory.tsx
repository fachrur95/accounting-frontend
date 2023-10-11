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
  >,
): JSX.Element => {
  const {
    options: optionsItem,
    isFetching: isFetchingItem,
    renderOption: renderOptionItem,
    onSearch: onSearchItem,
  } = useInfinitePeopleCategory();

  return (
    <AutocompleteElement
      {...props}
      options={optionsItem}
      loading={isFetchingItem}
      textFieldProps={{
        ...props.textFieldProps,
        onChange: onSearchItem,
      }}
      autocompleteProps={{
        ...props.autocompleteProps,
        onClose: () => onSearchItem(),
        renderOption: renderOptionItem,
        disableClearable: props.required,
      }}
    />
  );
};

export default AutocompletePeopleCategory;
