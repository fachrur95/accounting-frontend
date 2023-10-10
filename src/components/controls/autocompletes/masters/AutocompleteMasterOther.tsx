import useInfiniteOther from "@/components/hooks/options/masters/useInfiniteOther";
import type { MasterOtherType } from "@/types/masters/masterOther";
import type { AutoDefault } from "@/types/options";
import React from "react";
import { type FieldValues } from "react-hook-form";
import {
  AutocompleteElement,
  type AutocompleteElementProps,
} from "react-hook-form-mui";

const AutocompleteMasterOther = <TFieldValues extends FieldValues>(
  props: Omit<
    AutocompleteElementProps<
      TFieldValues,
      AutoDefault | string,
      boolean | undefined,
      boolean | undefined
    >,
    "options"
  > & {
    type: MasterOtherType;
  }
): JSX.Element => {
  const { type, ...rest } = props;
  const {
    options: optionsItemCategory,
    isFetching: isFetchingItemCategory,
    renderOption: renderOptionItemCategory,
    onSearch: onSearchItemCategory,
  } = useInfiniteOther({ type });

  return (
    <AutocompleteElement
      {...rest}
      options={optionsItemCategory}
      loading={isFetchingItemCategory}
      textFieldProps={{
        ...rest.textFieldProps,
        onChange: onSearchItemCategory,
      }}
      autocompleteProps={{
        ...rest.autocompleteProps,
        onClose: () => onSearchItemCategory(),
        renderOption: renderOptionItemCategory,
        disableClearable: rest.required,
      }}
    />
  );
};

export default AutocompleteMasterOther;
