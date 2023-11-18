import {
  MobileDatePickerElement,
  DatePickerElement,
  type DatePickerElementProps,
} from "react-hook-form-mui";
import { type FieldValues } from "react-hook-form";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import DateFnsProvider from "./DateFnsProvider";

const DatePicker = <TFieldValues extends FieldValues>(
  props: DatePickerElementProps<TFieldValues, Date> & {
    label?: string;
    size?: "small" | "medium";
    minDate?: Date;
    maxDate?: Date;
    disabled?: boolean;
    className?: string;
  },
): JSX.Element => {
  const { size, ...rest } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <DateFnsProvider>
      {isMobile ? (
        <MobileDatePickerElement
          inputProps={{ size: size ?? "medium" }}
          closeOnSelect
          format="dd MMMM yyyy"
          {...rest}
        />
      ) : (
        <DatePickerElement
          inputProps={{ size: size ?? "medium" }}
          closeOnSelect
          format="dd MMMM yyyy"
          {...rest}
        />
      )}
    </DateFnsProvider>
  );
};

export default DatePicker;
