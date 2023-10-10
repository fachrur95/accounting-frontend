import { MobileDatePickerElement } from "react-hook-form-mui";
import DateFnsProvider from "./DateFnsProvider";

const DatePicker = (props: {
  label: string;
  name: string;
  required?: boolean;
  size?: "small" | "medium";
  minDate?: Date;
  maxDate?: Date;
}): JSX.Element => {
  const { size, ...rest } = props;
  return (
    <DateFnsProvider>
      <MobileDatePickerElement
        inputProps={{ size: size ?? "medium" }}
        closeOnSelect
        {...rest}
      />
    </DateFnsProvider>
  );
};

export default DatePicker;
