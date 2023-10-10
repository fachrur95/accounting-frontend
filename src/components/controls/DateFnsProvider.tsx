import {
  LocalizationProvider,
  type LocalizationProviderProps,
  type MuiPickersAdapter,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import ar from "date-fns/locale/ar-SA";

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
      // adapterLocale={ar}
      {...localizationProps}
    >
      {children}
    </LocalizationProvider>
  );
}
