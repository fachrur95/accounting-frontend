import { darkTheme, lightTheme } from "@/styles/theme";
import { CssBaseline, ThemeProvider as MuiProvider } from "@mui/material";
import { SnackbarProvider } from "notistack";
import { useTheme } from "next-themes";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type GlobalContextType = {
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  theme: "system" | "light" | "dark" | string | undefined;
};

const globalContextDefaultValues: GlobalContextType = {
  theme: "system",
};

const GlobalContext = createContext<GlobalContextType>(
  globalContextDefaultValues
);

export function useGlobalContext() {
  return useContext(GlobalContext);
}

type Props = {
  children: ReactNode;
};

export function GlobalContextProvider({ children }: Props) {
  const [currentTheme, setCurrentTheme] = useState<
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    "system" | "light" | "dark" | string | undefined
  >("system");
  const { theme, systemTheme } = useTheme();

  useEffect(() => {
    const curTheme = theme === "system" ? systemTheme : theme;
    // console.log({ curTheme });
    setCurrentTheme(curTheme);
  }, [theme, systemTheme]);

  const value = { theme: currentTheme };

  return (
    <>
      <GlobalContext.Provider value={value}>
        <MuiProvider theme={currentTheme === "dark" ? darkTheme : lightTheme}>
          <SnackbarProvider maxSnack={3} dense autoHideDuration={3000}>
            <CssBaseline enableColorScheme={true} />
            {children}
          </SnackbarProvider>
        </MuiProvider>
      </GlobalContext.Provider>
    </>
  );
}
