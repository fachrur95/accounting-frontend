import { DateTimePickerElement } from "react-hook-form-mui";
import DateFnsProvider from "./DateFnsProvider";

const DateTimePicker = (props: {
  label: string;
  name: string;
  required?: boolean;
}): JSX.Element => {
  return (
    <DateFnsProvider>
      <DateTimePickerElement {...props} closeOnSelect />
    </DateFnsProvider>
  );
};

export default DateTimePicker;
