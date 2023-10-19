import { type MuiPickersAdapter } from "@mui/x-date-pickers";
import {
  LocalizationProvider,
  type LocalizationProviderProps,
} from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import idFormat from "date-fns/locale/id";

export type DateFnsProviderProps<TDate> = Omit<
  LocalizationProviderProps<TDate, unknown>,
  "dateAdapter"
> & {
  dateAdapter?: new (...args: unknown[]) => MuiPickersAdapter<TDate>;
};

export default function DateFnsProvider({
  children,
  ...props
}: DateFnsProviderProps<Date>) {
  const { dateAdapter, ...localizationProps } = props;
  return (
    <LocalizationProvider
      dateAdapter={dateAdapter ?? AdapterDateFns}
      adapterLocale={idFormat}
      {...localizationProps}
    >
      {children}
    </LocalizationProvider>
  );
}
