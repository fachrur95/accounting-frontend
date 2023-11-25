import useInfiniteMultipleUom from "@/components/hooks/options/masters/useInfiniteMultipleUom";
import type { AutoDefault, IDataOption } from "@/types/options";
import React, { useEffect } from "react";
import { type FieldValues } from "react-hook-form";
import {
  AutocompleteElement,
  type AutocompleteElementProps,
} from "react-hook-form-mui";

const AutocompleteMultipleUom = <TFieldValues extends FieldValues>(
  props: Omit<
    AutocompleteElementProps<
      TFieldValues,
      AutoDefault | string,
      boolean | undefined,
      boolean | undefined
    >,
    "options"
  > & {
    itemId: string;
    setDefault: (value: IDataOption) => void;
  },
): JSX.Element => {
  const { itemId, setDefault, ...rest } = props;
  const {
    options: optionsItem,
    isFetching: isFetchingItem,
    renderOption: renderOptionItem,
    onSearch: onSearchItem,
  } = useInfiniteMultipleUom({ itemId });

  useEffect(() => {
    if (optionsItem.length > 0) {
      const defaultUnit = optionsItem.find(
        (option) => option.conversionQty === 1,
      );
      if (defaultUnit) {
        setDefault(defaultUnit);
      }
    }
  }, [setDefault, optionsItem]);

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

export default AutocompleteMultipleUom;
