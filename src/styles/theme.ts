import type { } from '@mui/lab/themeAugmentation';
import { createTheme } from "@mui/material/styles";
import { type ThemeOptions } from "@mui/material/styles/createTheme";

// const modeTheme = window.localStorage.getItem("theme") || "dark";

const themeConfig: Omit<ThemeOptions, "palette"> = {
  shape: {
    borderRadius: 10
  },
}

export const lightTheme: ThemeOptions = createTheme({
  palette: {
    mode: "light",
    background: {
      paper: "#fff",
    }
  },
  ...themeConfig,
});

export const darkTheme: ThemeOptions = createTheme({
  palette: {
    mode: "dark",
    background: {
      paper: "#1f2937",
    }

  },
  ...themeConfig,
});